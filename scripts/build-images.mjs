/**
 * Builds the photographic set.
 *
 * ART DIRECTION — why these photographs and not others.
 *
 * Every image on this site comes from one body of work: Jon Pountney's
 * documentary series for Age Cymru, the national charity for older people in
 * Wales ("This Is Older"). One photographer, one commission, one register.
 * That is the difference between a site that has pictures and a site that has
 * photography: the faces are real, the rooms are real, nobody is holding a
 * clipboard and smiling at nothing.
 *
 * It also matters for this client specifically. The site being replaced used
 * AI-generated images of people who do not exist — a fact its own Impressum
 * had to disclose. For a care service, where the entire question a visitor is
 * asking is "can I trust these people in my mother's flat", invented faces are
 * a liability, not a shortcut. Licensed documentary photography of real people
 * answers the question the fake ones raise.
 *
 * TREATMENT is deliberately minimal: a small warm bias and a touch of
 * contrast, so the set sits with the warm paper palette without becoming a
 * duotone. An earlier version of this site tinted the hero hard enough that
 * the subject stopped being legible; that is the failure this avoids. The
 * photographs are allowed to be photographs.
 *
 * WHAT WAS REMOVED, and why it is a shorter list than it was.
 *
 * Three sittings were cut because they failed the test that matters: does the
 * picture show a care relationship? An older man looking out of a window and a
 * woman knitting in her chair are dignified photographs of older people, and
 * neither says anything about this business — the brief for a home-care site
 * is not "elderly lifestyle". A third, a woman with a cup in a hall with other
 * people behind her, read as a day centre, which is the one setting an
 * ambulatory service must not show: the entire proposition is that the client
 * stays at home.
 *
 * They were removed rather than replaced because no better licensed frame was
 * reachable at the time — the source was returning errors from every access
 * path. Fewer, correct pictures beat more, wrong ones, and a section with no
 * photograph is not a defect. Two of the sections that lost one are a timeline
 * and a step list, which are better without.
 *
 * Licensing: Unsplash Licence. Attribution is not required by the licence but
 * is given anyway, in /impressum.
 *
 * Usage: node scripts/build-images.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const OUT = path.join(process.cwd(), 'public/img');
const TMP = path.join(process.cwd(), '.image-cache');

/**
 * source  — the Unsplash photo id, so any of these can be traced back.
 * url     — the direct image URL at a size large enough for every crop below.
 * crops   — name, aspect ratio, widths, and the focal point as a fraction of
 *           the source. The focal point is the whole game: `cover` cropping
 *           with a default centre put a face half outside the frame twice.
 */
const SOURCES = [
  {
    key: 'pflegerin',
    id: 'dMhB7w99ju8',
    credit: 'Jon Pountney für Age Cymru',
    url: 'https://images.unsplash.com/photo-1765896387387-0538bc9f997e?fm=jpg&q=92&w=2400',
    crops: [
      /* 6:5, not 16:10. From the laptop breakpoint the picture fills a panel
         that is 54% of the viewport wide and as tall as the hero copy — about
         777x760 at 1440px, so very nearly square. A 16:10 crop dropped into
         that box lost a third of its width to object-cover and cut the second
         face off at the frame edge. Match the crop to the container, again. */
      { name: 'hero-wide', ratio: 6 / 5, widths: [900, 1300, 1800], focus: { x: 0.5, y: 0.44 } },
      // 1:1 on phones, not 4:5. The source frame is 1.41:1 and holds two
      // faces near its edges; a 4:5 crop takes only 57% of the width and
      // sliced both of them off. A square takes 71% and keeps them.
      { name: 'hero-tall', ratio: 1, widths: [560, 840, 1120], focus: { x: 0.5, y: 0.44 } },
      /* The caregiver alone, tight, for the careers page. Same frame as the
         hero — which is the point rather than a compromise. A commissioned
         shoot gives a site one recurring cast; using one sitting at three
         different crops is the nearest a licensed set gets to that, and it
         reads as far more coherent than five unrelated scenes did. */
      { name: 'pflegekraft', ratio: 4 / 5, widths: [480, 720, 1000], focus: { x: 0.27, y: 0.44 } },
    ],
  },
  {
    key: 'beratung',
    id: 'wLXJ1Q-_S88',
    credit: 'Jon Pountney für Age Cymru',
    url: 'https://images.unsplash.com/photo-1685608625845-184d982f3f69?fm=jpg&q=92&w=2400',
    crops: [{ name: 'beratung', ratio: 3 / 2, widths: [600, 900, 1400], focus: { x: 0.56, y: 0.45 } }],
  },
  {
    key: 'kueche',
    id: 'bSXk1lOp8T0',
    credit: 'Jon Pountney für Age Cymru',
    url: 'https://images.unsplash.com/photo-1762955911431-4c44c7c3f408?fm=jpg&q=92&w=2400',
    crops: [
      { name: 'leistungen', ratio: 16 / 9, widths: [900, 1400, 1900], focus: { x: 0.52, y: 0.45 } },
      /* A portrait cut of the same kitchen, for the home page's argument about
         planning by what a task actually takes. Same sitting as the services
         page, a different frame of it — which is how one shoot supplies a
         whole site, and why the set now reads as one brand rather than five. */
      { name: 'haltung', ratio: 4 / 5, widths: [480, 720, 1000], focus: { x: 0.58, y: 0.46 } },
    ],
  },
];

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

/** Downloads once and caches, so re-running is cheap and offline-friendly. */
function fetchSource(s) {
  const file = path.join(TMP, `${s.key}.jpg`);
  if (fs.existsSync(file) && fs.statSync(file).size > 10000) return file;
  execFileSync('curl', ['-sS', '-L', '-o', file, s.url], { stdio: 'inherit' });
  return file;
}

/**
 * Crops to an exact aspect around a focal point, then resizes.
 *
 * Doing the crop ourselves rather than leaning on `fit: 'cover'` is what makes
 * the same photograph usable at 16:10 and at 4:5 — cover would take the middle
 * of the frame in both, and the middle of a 16:10 frame is not where the face
 * is once you squeeze it to 4:5.
 */
async function crop(file, ratio, focus) {
  const img = sharp(file);
  const { width: W, height: H } = await img.metadata();
  let w = W;
  let h = Math.round(W / ratio);
  if (h > H) { h = H; w = Math.round(H * ratio); }
  const left = Math.max(0, Math.min(W - w, Math.round(focus.x * W - w / 2)));
  const top = Math.max(0, Math.min(H - h, Math.round(focus.y * H - h / 2)));
  return sharp(file).extract({ left, top, width: w, height: h });
}

const rows = [];

for (const s of SOURCES) {
  const file = fetchSource(s);
  for (const c of s.crops) {
    for (const w of c.widths) {
      const base = await crop(file, c.ratio, c.focus);
      // The treatment, and the reason it is NOT sharp's `tint()`: tint
      // replaces the image's chroma outright while keeping its luminance, so
      // it does not warm a photograph, it turns it into a monotone. The first
      // build of this set came out sepia. A warm wash composited in
      // `soft-light` at low strength biases the colour instead of replacing
      // it, which is what art direction actually means here.
      const h = Math.round(w / c.ratio);
      const treated = base
        .resize(w, h, { fit: 'cover' })
        .modulate({ saturation: 0.93, brightness: 1.02 })
        .composite([{
          input: { create: { width: w, height: h, channels: 4, background: { r: 255, g: 232, b: 200, alpha: 0.34 } } },
          blend: 'soft-light',
        }])
        .sharpen({ sigma: 0.6 });

      for (const fmt of ['avif', 'webp']) {
        const out = path.join(OUT, `${c.name}-${w}.${fmt}`);
        await (fmt === 'avif'
          ? treated.clone().avif({ quality: 52, effort: 6 })
          : treated.clone().webp({ quality: 74 })
        ).toFile(out);
        rows.push([`${c.name}-${w}.${fmt}`, (fs.statSync(out).size / 1024).toFixed(0) + ' KB', s.credit]);
      }
    }
  }
}

/* The Open Graph card.
   1200x630 is the size every platform crops to; the previous default was the
   260px logo, which social previews upscaled into a blur. A photograph with no
   text baked in, so the card never contradicts a headline that has since been
   rewritten — the title comes from the page's own metadata. */
{
  const src = fetchSource(SOURCES[0]);
  const base = await crop(src, 1200 / 630, { x: 0.5, y: 0.42 });
  const out = path.join(process.cwd(), 'public/og-default.jpg');
  await base
    .resize(1200, 630, { fit: 'cover' })
    .modulate({ saturation: 0.93, brightness: 1.02 })
    .composite([{
      input: { create: { width: 1200, height: 630, channels: 4, background: { r: 255, g: 232, b: 200, alpha: 0.34 } } },
      blend: 'soft-light',
    }])
    .jpeg({ quality: 82, progressive: true })
    .toFile(out);
  rows.push(['og-default.jpg', (fs.statSync(out).size / 1024).toFixed(0) + ' KB', SOURCES[0].credit]);
}

const pad = (v, n) => String(v).padEnd(n);
console.log(`\n${pad('file', 26)}${pad('size', 10)}credit`);
console.log('-'.repeat(72));
for (const r of rows) console.log(pad(r[0], 26) + pad(r[1], 10) + r[2]);
console.log(`\n${rows.length} files written to public/img.`);
