/**
 * Samples the real rendered hero background under each piece of hero text and
 * checks the text colour against the WORST (lightest) pixel it sits on.
 *
 * A gradient plus a glow cannot be reasoned about from token values alone —
 * the effective background differs per pixel. This measures it.
 *
 * Usage: node scripts/hero-contrast.mjs [baseUrl]
 */
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs';

const BASE = process.argv[2] || 'http://127.0.0.1:3111';
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const L = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [L(a), L(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

let failures = 0;

for (const [w, h, label] of [[390, 844, 'mobile'], [768, 900, 'tablet'], [1440, 900, 'desktop']]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, locale: 'de-DE' });
  const page = await ctx.newPage();
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await page.waitForTimeout(400);

  // Hide the text itself so we photograph only the ground beneath it.
  const targets = await page.evaluate(() => {
    const hero = document.querySelector('section.on-dark');
    if (!hero) return [];

    // Fixed overlays (the sticky call bar) sit above the hero and would be
    // photographed as if they were its background. Content scrolling under a
    // fixed bar is normal; measuring the bar as the ground is not.
    document.querySelectorAll('body *').forEach((el) => {
      if (getComputedStyle(el).position === 'fixed') el.style.visibility = 'hidden';
    });

    const out = [];
    const texts = [...hero.querySelectorAll('p, h1, h2, li, span')].filter((el) => {
      // Only elements that render text directly on the hero ground.
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) return false;
      if (el.closest('.btn')) return false;      // buttons carry their own ground
      if (el.closest('aside')) return false;     // the white card is a surface of its own
      if (getComputedStyle(el).visibility === 'hidden') return false;
      const r = el.getBoundingClientRect();
      return r.width > 4 && r.height > 4;
    });
    for (const el of texts) {
      const r = el.getBoundingClientRect();
      // Tailwind's opacity utilities compute to color-mix()/oklab(), which no
      // rgb() regex parses and which canvas does not normalise as a string
      // either. Rasterising one pixel works for any colour space: the browser
      // does the conversion and we read the result back as RGBA.
      const norm = (css) => {
        const cv = document.createElement('canvas');
        cv.width = cv.height = 1;
        const c2 = cv.getContext('2d');
        c2.clearRect(0, 0, 1, 1);
        c2.fillStyle = css;
        c2.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = c2.getImageData(0, 0, 1, 1).data;
        return `rgba(${r}, ${g}, ${b}, ${(a / 255).toFixed(3)})`;
      };
      out.push({
        name: (el.textContent || '').trim().slice(0, 22),
        color: norm(getComputedStyle(el).color),
        x: Math.round(r.x), y: Math.round(r.y),
        w: Math.round(r.width), h: Math.round(r.height),
      });
      el.style.visibility = 'hidden';
    }
    return out;
  });

  const shot = `/tmp/hero-ground-${label}.png`;
  await page.screenshot({ path: shot });
  const png = PNG.sync.read(fs.readFileSync(shot));

  for (const t of targets) {
    if (t.w <= 0 || t.h <= 0) continue;
    // Canvas gives either "#rrggbb" or "rgba(r, g, b, a)".
    let fg, alpha = 1;
    if (t.color.startsWith('#')) {
      fg = t.color.replace('#', '').match(/../g).map((x) => parseInt(x, 16));
    } else {
      const m = t.color.match(/rgba?\(([^)]+)\)/);
      if (!m) { console.log(`SKIP  ${label} ${t.name} — unparsed colour ${t.color}`); failures++; continue; }
      const parts = m[1].split(',').map((n) => parseFloat(n));
      alpha = parts[3] ?? 1;
      fg = [parts[0], parts[1], parts[2]];
    }

    let worst = null, worstL = -1;
    for (let y = t.y; y < Math.min(t.y + t.h, png.height); y += 3) {
      for (let x = t.x; x < Math.min(t.x + t.w, png.width); x += 3) {
        if (x < 0 || y < 0) continue;
        const i = (png.width * y + x) << 2;
        const px = [png.data[i], png.data[i + 1], png.data[i + 2]];
        const l = L(px);
        if (l > worstL) { worstL = l; worst = px; }
      }
    }
    if (!worst) continue;

    // Composite semi-transparent text (e.g. text-white/90) over that pixel,
    // because that is what the eye actually receives.
    const eff = fg.map((c, i) => Math.round(c * alpha + worst[i] * (1 - alpha)));
    const r = ratio(eff, worst);
    const ok = r >= 4.5;
    if (!ok) failures++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label.padEnd(7)} ${t.name.padEnd(24)} ${r.toFixed(2)}:1  text rgb(${eff}) on lightest ground rgb(${worst})`);
  }
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} FAILURE(S)` : '\nAll hero text clears 4.5:1 against the lightest pixel it sits on.');
process.exit(failures ? 1 : 0);
