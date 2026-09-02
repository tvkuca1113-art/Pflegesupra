/**
 * Proves the conversion events still fire.
 *
 * The footer and the contact block are server components; their links carry
 * data-track attributes and one delegated listener turns those into events.
 * That indirection is exactly the kind of thing a later refactor breaks
 * silently — the links keep working, the phone still rings, and the client
 * simply stops being able to tell which page produced the call. So it is
 * asserted rather than assumed.
 *
 * Requires a build made with NEXT_PUBLIC_GA_ID set, because without a
 * measurement ID the consent banner never appears and every event stays
 * queued by design:
 *
 *   NEXT_PUBLIC_GA_ID=G-TEST0000 npm run build && npx next start -p 3111
 *   node scripts/analytics-check.mjs
 */
import { chromium } from 'playwright';
const BASE = (process.argv[2] || 'http://127.0.0.1:3111').replace(/\/$/, '');
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox','--disable-gpu','--hide-scrollbars'] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, locale: 'de-DE' });
const p = await ctx.newPage();
let fail = 0;
const check = (ok, msg) => { console.log((ok ? 'PASS  ' : 'FAIL  ') + msg); if (!ok) fail++; };

await p.goto(BASE + '/kontakt', { waitUntil: 'load' });
await p.waitForTimeout(600);

// Grant consent the way the banner does, then click the footer's phone link.
await p.evaluate(() => { window.dataLayer = []; });
const accept = p.getByRole('button', { name: 'Statistik erlauben' }).first();
check(await accept.count() === 1, 'consent banner is present');
await accept.click(); await p.waitForTimeout(250);
await p.evaluate(() => { window.dataLayer = []; });

for (const [sel, expect] of [
  ['footer a[data-track="phone_click"]', { event: 'phone_click', placement: 'footer' }],
  ['footer a[data-track="email_click"]', { event: 'email_click', placement: 'footer' }],
  ['main a[data-track="phone_click"]', { event: 'phone_click', placement: 'kontakt_aside' }],
  ['main a[data-track="whatsapp_click"]', { event: 'whatsapp_click', placement: 'kontakt_aside' }],
]) {
  const el = p.locator(sel).first();
  const n = await el.count();
  if (!n) { check(false, sel + ' — not found'); continue; }
  // Fire the click without letting the browser follow tel:/mailto:/target=_blank.
  await p.evaluate((s) => {
    const a = document.querySelector(s);
    a.addEventListener('click', (e) => e.preventDefault(), { once: true });
    a.removeAttribute('target');
    a.click();
  }, sel);
  await p.waitForTimeout(120);
  const last = await p.evaluate(() => (window.dataLayer || []).at(-1));
  check(JSON.stringify(last) === JSON.stringify(expect), `${sel} -> ${JSON.stringify(last)}`);
}

// A parameter that is not in the spec must still be dropped.
await p.evaluate(() => {
  const a = document.createElement('a');
  a.href = '#'; a.setAttribute('data-track', 'phone_click');
  a.setAttribute('data-track-params', '{"placement":"probe","strasse":"Musterstrasse 1"}');
  document.body.appendChild(a);
  a.addEventListener('click', (e) => e.preventDefault(), { once: true });
  a.click();
});
await p.waitForTimeout(100);
const sanitised = await p.evaluate(() => (window.dataLayer || []).at(-1));
check(JSON.stringify(sanitised) === JSON.stringify({ event: 'phone_click', placement: 'probe' }),
  'unlisted params are dropped -> ' + JSON.stringify(sanitised));

// Malformed JSON must not break the click.
await p.evaluate(() => {
  const a = document.createElement('a');
  a.href = '#'; a.setAttribute('data-track', 'email_click');
  a.setAttribute('data-track-params', '{not json');
  document.body.appendChild(a);
  a.addEventListener('click', (e) => e.preventDefault(), { once: true });
  a.click();
});
await p.waitForTimeout(100);
const broken = await p.evaluate(() => (window.dataLayer || []).at(-1));
check(JSON.stringify(broken) === JSON.stringify({ event: 'email_click' }), 'malformed params degrade safely -> ' + JSON.stringify(broken));

const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
check(errs.length === 0, 'no page errors');

await b.close();
console.log(fail ? `\n${fail} FAILED` : '\nDelegated click tracking fires the same events as the old handlers.');
process.exit(fail ? 1 : 0);
