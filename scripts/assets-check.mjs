/**
 * Proves that every asset the pages actually ask for exists.
 *
 * The QA harness checks the rendered page: alt text, overflow, touch targets,
 * console errors. What it could not see is a `srcset` candidate that no browser
 * happened to pick during the run. A 404 in a srcset is invisible on the test
 * machine and visible to whichever visitor's viewport and pixel ratio select
 * it — the widths a laptop chooses are not the widths a phone chooses.
 *
 * This walks every route, expands every `srcset` and `<source>` in full,
 * collects `<img src>`, CSS `url()` on any element, preloads, icons and the
 * Open Graph image, and requests each one. It also flags files in public/img
 * that no page references, because an orphan is either dead weight in the
 * bundle or a rename someone forgot to finish.
 *
 * Usage: node scripts/assets-check.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE = (process.argv[2] || 'http://127.0.0.1:3090').replace(/\/$/, '');

const ROUTES = [
  '/', '/leistungen', '/leistungen/grundpflege', '/leistungen/behandlungspflege',
  '/leistungen/betreuung-und-entlastung', '/leistungen/hauswirtschaft',
  '/leistungen/verhinderungspflege', '/pflegegrade-und-kosten', '/ablauf',
  '/fragen-und-antworten', '/einsatzgebiet/muenchen',
  '/einsatzgebiet/pfaffenhofen-an-der-ilm', '/ueber-uns', '/karriere',
  '/kontakt', '/impressum', '/datenschutz',
];

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });

/** Every asset URL any page mentions, mapped to the routes that mention it. */
const wanted = new Map();
const note = (url, route) => {
  if (!url || url.startsWith('data:')) return;
  const abs = url.startsWith('http') ? url : BASE + (url.startsWith('/') ? url : `/${url}`);
  if (!abs.startsWith(BASE)) return; // third-party is not ours to assert
  if (!wanted.has(abs)) wanted.set(abs, new Set());
  wanted.get(abs).add(route);
};

for (const route of ROUTES) {
  const page = await ctx.newPage();
  const res = await page.goto(BASE + route, { waitUntil: 'load', timeout: 45000 });
  if (!res || res.status() >= 400) {
    console.log(`FAIL  ${route} returned ${res ? res.status() : 'no response'}`);
    await page.close();
    continue;
  }
  // Lazy images only populate srcset attributes, which is what we read — no
  // need to scroll, and scrolling would only make the run slower and flakier.
  const found = await page.evaluate(() => {
    const out = [];
    const fromSrcset = (v) => (v || '').split(',').map((s) => s.trim().split(/\s+/)[0]).filter(Boolean);
    document.querySelectorAll('img').forEach((i) => {
      out.push(i.getAttribute('src'));
      out.push(...fromSrcset(i.getAttribute('srcset')));
    });
    document.querySelectorAll('source').forEach((s) => out.push(...fromSrcset(s.getAttribute('srcset'))));
    document.querySelectorAll('link[rel="preload"][as="image"], link[rel="preload"][as="font"], link[rel="icon"], link[rel="apple-touch-icon"], link[rel="manifest"]')
      .forEach((l) => out.push(l.getAttribute('href')));
    document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')
      .forEach((m) => out.push(m.getAttribute('content')));
    document.querySelectorAll('*').forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none') {
        for (const m of bg.matchAll(/url\((['"]?)(.*?)\1\)/g)) out.push(m[2]);
      }
    });
    return out.filter(Boolean);
  });
  found.forEach((u) => note(u, route));
  await page.close();
}

let fails = 0;
const referenced = new Set();
const urls = [...wanted.keys()].sort();
for (const url of urls) {
  // GET, not HEAD: Next's image optimiser answers HEAD with 400, which made the
  // first run of this script report every route as broken when nothing was.
  const r = await ctx.request.get(url).catch(() => null);
  const status = r ? r.status() : 'ERR';
  const p = new URL(url).pathname;
  referenced.add(p);
  if (status !== 200) {
    fails++;
    console.log(`FAIL  ${status}  ${p}  <- ${[...wanted.get(url)].join(', ')}`);
  }
}
console.log(`\n${urls.length} asset URLs referenced across ${ROUTES.length} routes; ${fails} failed.`);

/* Orphans: shipped but never asked for. */
const dir = path.join(process.cwd(), 'public/img');
const orphans = fs.readdirSync(dir).filter((f) => !referenced.has(`/img/${f}`));
if (orphans.length) {
  console.log(`\n${orphans.length} file(s) in public/img that no page references:`);
  for (const o of orphans) console.log(`  ${o}`);
} else {
  console.log('\nNo orphaned files in public/img.');
}

await browser.close();
process.exit(fails ? 1 : 0);
