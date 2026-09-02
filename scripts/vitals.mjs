/**
 * Core Web Vitals, measured — not estimated.
 *
 * Lighthouse is not installed in this environment and installing it was not
 * authorised, so this measures the same field metrics directly through the
 * browser's own PerformanceObserver, under Lighthouse's mobile emulation
 * profile (Slow 4G: 1.6 Mbit/s down, 150 ms RTT; 4x CPU slowdown).
 *
 * It runs against a LOCAL production build. That makes TTFB optimistic — the
 * Vercel edge is not in the path — but LCP, CLS and total blocking time are
 * governed by payload size and main-thread work, which are the same bytes and
 * the same JavaScript that ship to production.
 *
 * Usage: node scripts/vitals.mjs [baseUrl] [--fast]
 */
import { chromium } from 'playwright';

const BASE = (process.argv[2] || 'http://127.0.0.1:3111').replace(/\/$/, '');
const ROUTES = ['/', '/leistungen', '/pflegegrade-und-kosten', '/kontakt', '/karriere'];

// Lighthouse's mobile throttling profile.
const SLOW_4G = { offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 };
const CPU_SLOWDOWN = 4;

// Google's "good" thresholds.
const BUDGET = { lcp: 2500, cls: 0.1, tbt: 200, fcp: 1800 };

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

const rows = [];
let failures = 0;

for (const [label, viewport, throttled] of [
  ['mobile', { width: 390, height: 844 }, true],
  ['desktop', { width: 1440, height: 900 }, false],
]) {
  for (const route of ROUTES) {
    const ctx = await browser.newContext({
      viewport,
      locale: 'de-DE',
      deviceScaleFactor: label === 'mobile' ? 3 : 1,
      isMobile: label === 'mobile',
      hasTouch: label === 'mobile',
    });
    const page = await ctx.newPage();

    let bytes = 0;
    page.on('response', async (res) => {
      const len = Number(res.headers()['content-length'] || 0);
      if (len) bytes += len;
    });

    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Network.enable');
    if (throttled) {
      await cdp.send('Network.emulateNetworkConditions', SLOW_4G);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: CPU_SLOWDOWN });
    }

    // Register the observers before any navigation so nothing is missed.
    await page.addInitScript(() => {
      window.__v = { lcp: 0, cls: 0, fcp: 0, longTasks: [] };
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__v.lcp = e.startTime;
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__v.cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__v.fcp = e.startTime;
      }).observe({ type: 'paint', buffered: true });
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) window.__v.longTasks.push({ start: e.startTime, dur: e.duration });
      }).observe({ type: 'longtask', buffered: true });
    });

    await page.goto(BASE + route, { waitUntil: 'load', timeout: 60000 });
    // LCP is only final once the page stops changing; settle, then seal it the
    // way the real metric is sealed — on the first interaction.
    await page.waitForTimeout(2500);
    await page.evaluate(() => document.body.click());
    await page.waitForTimeout(200);

    const v = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      // Total Blocking Time: every millisecond of a long task beyond 50 ms,
      // counted between FCP and the end of load.
      const tbt = window.__v.longTasks
        .filter((t) => t.start >= window.__v.fcp)
        .reduce((sum, t) => sum + Math.max(0, t.dur - 50), 0);
      return {
        lcp: Math.round(window.__v.lcp),
        cls: Number(window.__v.cls.toFixed(4)),
        fcp: Math.round(window.__v.fcp),
        tbt: Math.round(tbt),
        ttfb: Math.round(nav.responseStart || 0),
        domInteractive: Math.round(nav.domInteractive || 0),
      };
    });

    const bad = [];
    if (v.lcp > BUDGET.lcp) bad.push('LCP');
    if (v.cls > BUDGET.cls) bad.push('CLS');
    if (v.tbt > BUDGET.tbt) bad.push('TBT');
    if (v.fcp > BUDGET.fcp) bad.push('FCP');
    if (bad.length) failures++;

    rows.push({ label, route, ...v, kb: Math.round(bytes / 1024), bad });
    await ctx.close();
  }
}

await browser.close();

const pad = (s, n) => String(s).padEnd(n);
console.log(`\n${pad('profile', 9)}${pad('route', 26)}${pad('FCP', 8)}${pad('LCP', 8)}${pad('TBT', 8)}${pad('CLS', 9)}${pad('TTFB', 8)}${pad('KB', 7)}status`);
console.log('-'.repeat(96));
for (const r of rows) {
  console.log(
    pad(r.label, 9) + pad(r.route, 26) + pad(r.fcp + 'ms', 8) + pad(r.lcp + 'ms', 8) +
    pad(r.tbt + 'ms', 8) + pad(r.cls, 9) + pad(r.ttfb + 'ms', 8) + pad(r.kb, 7) +
    (r.bad.length ? 'OVER BUDGET: ' + r.bad.join(', ') : 'good')
  );
}
console.log(`\nBudget: LCP<=${BUDGET.lcp}ms  CLS<=${BUDGET.cls}  TBT<=${BUDGET.tbt}ms  FCP<=${BUDGET.fcp}ms (Google "good")`);
console.log('mobile = Slow 4G (1.6 Mbit/s, 150ms RTT) + 4x CPU slowdown; desktop = unthrottled.');
console.log(failures ? `\n${failures} route(s) OVER BUDGET` : '\nEvery route is inside the "good" threshold on all four metrics.');
process.exit(failures ? 1 : 0);
