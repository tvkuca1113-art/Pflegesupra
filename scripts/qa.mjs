/**
 * QA harness. Crawls the built site and asserts the things this project
 * promised: one H1 per page, no heading-level jumps, unique metadata, no broken
 * internal links, no horizontal overflow at any tested width, adequate touch
 * targets, alt text on every image, a working skip link, and no console errors.
 *
 * Usage: node scripts/qa.mjs [baseUrl]
 * Exits non-zero if any check fails, so it can gate a deploy.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3111';
const EXEC = '/opt/pw-browsers/chromium';

const ROUTES = [
  '/', '/leistungen',
  '/leistungen/grundpflege', '/leistungen/behandlungspflege',
  '/leistungen/betreuung-und-entlastung', '/leistungen/hauswirtschaft',
  '/leistungen/verhinderungspflege',
  '/pflegegrade-und-kosten', '/ablauf', '/fragen-und-antworten',
  '/einsatzgebiet/muenchen', '/einsatzgebiet/pfaffenhofen-an-der-ilm',
  '/ueber-uns', '/karriere', '/kontakt', '/impressum', '/datenschutz',
];
const WIDTHS = [320, 375, 390, 430, 768, 1280, 1440];

const failures = [];
const warnings = [];
const fail = (route, msg) => failures.push(`${route}: ${msg}`);
const warn = (route, msg) => warnings.push(`${route}: ${msg}`);

const browser = await chromium.launch({
  executablePath: EXEC,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--hide-scrollbars'],
});

const seenTitles = new Map();
const seenDescs = new Map();
const allInternalLinks = new Set();
const pageStats = [];

// ---------------------------------------------------------------- page audit
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
for (const route of ROUTES) {
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => consoleErrors.push('JS: ' + String(e).slice(0, 160)));

  let bytes = 0;
  page.on('response', async (r) => {
    const len = r.headers()['content-length'];
    if (len) bytes += parseInt(len, 10);
  });

  const res = await page.goto(BASE + route, { waitUntil: 'load', timeout: 45000 });
  if (res?.status() !== 200) fail(route, `HTTP ${res?.status()}`);

  const d = await page.evaluate(() => {
    const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')];
    const levels = heads.map((h) => +h.tagName[1]);
    const jumps = [];
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) jumps.push(`${heads[i - 1].tagName}->${heads[i].tagName}`);
    }
    return {
      h1s: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 60)),
      jumps,
      title: document.title,
      desc: document.querySelector('meta[name="description"]')?.content ?? '',
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? '',
      lang: document.documentElement.lang,
      imgsNoAlt: [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.src.slice(-40)),
      internal: [...document.querySelectorAll('a[href]')]
        .map((a) => a.getAttribute('href'))
        .filter((h) => h && h.startsWith('/') && !h.startsWith('//')),
      emptyHref: [...document.querySelectorAll('a')]
        .filter((a) => { const h = a.getAttribute('href'); return !h || h === '#'; }).length,
      skipLink: (() => {
        const a = document.querySelector('a.skip');
        return a ? { text: a.textContent.trim(), href: a.getAttribute('href') } : null;
      })(),
      landmarks: {
        main: document.querySelectorAll('main').length,
        header: document.querySelectorAll('header').length,
        footer: document.querySelectorAll('footer').length,
        nav: document.querySelectorAll('nav').length,
      },
      jsonLdTypes: [...document.querySelectorAll('script[type="application/ld+json"]')]
        .flatMap((s) => {
          try {
            const j = JSON.parse(s.textContent);
            const g = j['@graph'] ?? [j];
            return g.map((x) => (Array.isArray(x['@type']) ? x['@type'].join('|') : x['@type']));
          } catch { return ['INVALID_JSON']; }
        }),
      // Interactive controls smaller than the WCAG 2.2 (2.5.8) 24px minimum.
      // 44px is the target we actually design to; anything under 24 is a fail.
      smallTargets: [...document.querySelectorAll('a,button,input,select,textarea,summary')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden' || r.width === 0) return false;
          if (el.closest('[aria-hidden="true"]')) return false;
          if (el.classList.contains('skip')) return false;
          // WCAG 2.2 SC 2.5.8 exempts a target that sits inside a sentence and
          // is therefore sized by the surrounding line-height ("Inline"
          // exception). Detect that as: an inline link whose parent carries
          // text of its own beyond the link.
          if (el.tagName === 'A' && cs.display.startsWith('inline')) {
            const parent = el.parentElement;
            if (parent) {
              const own = (parent.textContent || '').replace(el.textContent || '', '').trim();
              if (own.length > 0) return false;
            }
          }
          // A form control wrapped in its own label is hit via the label, so
          // measure the label instead of the control.
          if (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) {
            const label = el.closest('label');
            if (label) {
              const lr = label.getBoundingClientRect();
              return lr.height < 24 || lr.width < 24;
            }
          }
          return r.height < 24 || r.width < 24;
        })
        .map((el) => `${el.tagName}.${el.className.toString().slice(0, 24)} ${Math.round(el.getBoundingClientRect().height)}px`),
    };
  });

  if (d.h1s.length !== 1) fail(route, `expected exactly 1 <h1>, found ${d.h1s.length}: ${JSON.stringify(d.h1s)}`);
  if (d.jumps.length) fail(route, `heading level jumps: ${d.jumps.join(', ')}`);
  if (!d.title) fail(route, 'missing <title>');
  if (!d.desc) fail(route, 'missing meta description');
  if (!d.canonical) fail(route, 'missing canonical');
  if (d.lang !== 'de') fail(route, `lang="${d.lang}", expected "de"`);
  if (d.imgsNoAlt.length) fail(route, `images without alt: ${d.imgsNoAlt.join(', ')}`);
  if (d.emptyHref) fail(route, `${d.emptyHref} link(s) with empty or "#" href`);
  if (!d.skipLink) fail(route, 'no skip link');
  if (d.landmarks.main !== 1) fail(route, `expected 1 <main>, found ${d.landmarks.main}`);
  if (d.jsonLdTypes.includes('INVALID_JSON')) fail(route, 'invalid JSON-LD');
  if (d.smallTargets.length) fail(route, `targets under 24px: ${d.smallTargets.slice(0, 4).join('; ')}`);
  if (consoleErrors.length) fail(route, `console errors: ${consoleErrors.slice(0, 2).join(' | ')}`);

  if (seenTitles.has(d.title)) fail(route, `duplicate <title> with ${seenTitles.get(d.title)}`);
  seenTitles.set(d.title, route);
  if (seenDescs.has(d.desc)) fail(route, `duplicate description with ${seenDescs.get(d.desc)}`);
  seenDescs.set(d.desc, route);

  d.internal.forEach((h) => allInternalLinks.add(h.split('#')[0].split('?')[0]));
  pageStats.push({ route, kb: Math.round(bytes / 1024), jsonLd: d.jsonLdTypes.join(',') });
  await page.close();
}
await ctx.close();

// ------------------------------------------------------- responsive overflow
for (const width of WIDTHS) {
  const c = await browser.newContext({ viewport: { width, height: 800 }, locale: 'de-DE' });
  for (const route of ['/', '/pflegegrade-und-kosten', '/kontakt', '/leistungen/grundpflege', '/fragen-und-antworten']) {
    const p = await c.newPage();
    await p.goto(BASE + route, { waitUntil: 'load' });
    const over = await p.evaluate(() => {
      const doc = document.documentElement;
      if (doc.scrollWidth <= window.innerWidth + 1) return null;
      // Name the widest offending element so the failure is actionable.
      const worst = [...document.querySelectorAll('body *')]
        .map((el) => ({ el, r: el.getBoundingClientRect() }))
        .filter((x) => x.r.right > window.innerWidth + 1 || x.r.left < -1)
        .sort((a, b) => b.r.right - a.r.right)[0];
      return {
        scrollW: doc.scrollWidth,
        innerW: window.innerWidth,
        culprit: worst ? `${worst.el.tagName}.${worst.el.className.toString().slice(0, 40)}` : 'unknown',
      };
    });
    if (over) fail(`${route} @${width}px`, `horizontal overflow ${over.scrollW}>${over.innerW}, widest: ${over.culprit}`);
    await p.close();
  }
  await c.close();
}

// ------------------------------------------------------------- broken links
const linkCtx = await browser.newContext();
const linkPage = await linkCtx.newPage();
for (const href of [...allInternalLinks].sort()) {
  if (href.startsWith('/api/')) continue;
  const r = await linkPage.goto(BASE + href, { waitUntil: 'commit' }).catch(() => null);
  const s = r?.status();
  if (s !== 200) fail('link-check', `${href} -> HTTP ${s ?? 'no response'}`);
}
await linkCtx.close();

// ------------------------------------------- keyboard: skip link and focus
const kbCtx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const kb = await kbCtx.newPage();
await kb.goto(BASE + '/', { waitUntil: 'load' });
await kb.keyboard.press('Tab');
const first = await kb.evaluate(() => {
  const el = document.activeElement;
  const r = el.getBoundingClientRect();
  return { cls: el.className.toString(), text: el.textContent?.trim().slice(0, 40), visible: r.top >= 0 && r.height > 0 };
});
if (!first.cls.includes('skip')) fail('keyboard', `first Tab focuses "${first.text}", expected the skip link`);
if (!first.visible) fail('keyboard', 'skip link is not visible when focused');
await kb.keyboard.press('Enter');
const jumped = await kb.evaluate(() => location.hash);
if (jumped !== '#inhalt') fail('keyboard', `skip link did not move to #inhalt (hash="${jumped}")`);

// Every focusable control must show a focus indicator.
// :focus-visible only matches keyboard focus, so this walks the page with real
// Tab presses instead of calling el.focus(), which would report false failures.
const noFocusRing = [];
await kb.goto(BASE + '/', { waitUntil: 'load' });
for (let i = 0; i < 25; i++) {
  await kb.keyboard.press('Tab');
  const r = await kb.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return null;
    const cs = getComputedStyle(el);
    return {
      id: el.tagName + '.' + el.className.toString().slice(0, 30),
      outline: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0,
      shadow: cs.boxShadow !== 'none',
    };
  });
  if (r && !r.outline && !r.shadow && !noFocusRing.includes(r.id)) noFocusRing.push(r.id);
}
if (noFocusRing.length) fail('keyboard', `no visible focus indicator on: ${noFocusRing.slice(0, 5).join(', ')}`);
await kbCtx.close();

// -------------------------------------------------- reduced motion honoured
const rmCtx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
const rm = await rmCtx.newPage();
await rm.goto(BASE + '/', { waitUntil: 'load' });
const scrollBehavior = await rm.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
if (scrollBehavior !== 'auto') fail('reduced-motion', `scroll-behavior is "${scrollBehavior}", expected "auto"`);
await rmCtx.close();

// ---------------------------------------------------------------- 404 route
const nfCtx = await browser.newContext();
const nf = await nfCtx.newPage();
const nfRes = await nf.goto(BASE + '/gibt-es-nicht-xyz', { waitUntil: 'load' });
if (nfRes?.status() !== 404) fail('404', `expected HTTP 404, got ${nfRes?.status()}`);
const nfH1 = await nf.evaluate(() => document.querySelectorAll('h1').length);
if (nfH1 !== 1) fail('404', `expected 1 <h1>, found ${nfH1}`);
await nfCtx.close();

await browser.close();

// -------------------------------------------------------------------- report
console.log('\nPage weight (uncompressed, as reported by content-length):');
for (const s of pageStats) console.log(`  ${String(s.kb).padStart(4)} KB  ${s.route}`);

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.log('  ~ ' + w));
}

if (failures.length) {
  console.log(`\n${failures.length} FAILURE(S):`);
  failures.forEach((f) => console.log('  x ' + f));
  process.exit(1);
}
console.log(`\nAll checks passed across ${ROUTES.length} routes and ${WIDTHS.length} viewports.`);
