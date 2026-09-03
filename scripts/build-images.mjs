/**
 * Builds the photographic set from the client's approved originals.
 *
 * WHERE THE PICTURES COME FROM NOW. Seven photographs supplied and approved by
 * the client, stored as JPEG masters in assets/photos/, all seven of them
 * 1448x1086. They arrive already branded — the Supra logo is on the uniforms in
 * the supplied files — so this script only crops and encodes. Nothing here
 * retouches a photograph, draws a logo or alters a person.
 *
 * There was an interim state where the site composited the logo itself, in
 * scripts/brand-photos.mjs, because the supplied frames carried an illegible
 * generated emblem. That script has been deleted along with the masters it
 * produced: every uniform on the site now carries the logo the client
 * photographed, not one this repository drew. Every earlier source — the Age Cymru
 * documentary series, the Centre for Ageing Better library, Dominik Lange's
 * photograph — has been removed from the site entirely, files included.
 *
 * ONE FRAME PER PLACEMENT, and that is the point of the new set. The old set
 * reused three sittings at seven crops, and it showed: the same carer, the same
 * client, the same room, over and over. These seven are seven different homes
 * and seven different people. Only one frame appears twice (see `grundpflege`)
 * and never on the same page, and the treatment below is deliberately light so
 * they do not collapse back into looking like a single shoot.
 *
 * THE SOURCE CONSTRAINT, stated because it drives every width below. The
 * originals are 1672x941 — 16:9, and not large. That is plenty for a phone and
 * short for a Retina desktop, so the widths per crop stop at what the source
 * actually contains rather than at a number that would only look sharp in a
 * config file. The one exception is the desktop hero, marked below.
 *
 * TREATMENT is minimal on purpose: a small warm bias, nothing else. An earlier
 * version of this site graded its photographs hard enough that they all took on
 * one cast, which is exactly the "same fake photoshoot repeated" look the new
 * set exists to avoid. Different homes are allowed to have different light.
 *
 * Usage: node scripts/build-images.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.join(process.cwd(), 'public/img');
const SRC = path.join(process.cwd(), 'assets/photos');

/**
 * file   — the master in assets/photos.
 * crops  — name, aspect ratio, widths, and the focal point as a fraction of
 *          the source. The focal point is the whole game: `cover` cropping with
 *          a default centre has put a face half outside the frame on this
 *          project more than once.
 *          `q` optionally overrides encoder settings for one crop.
 *          `allowUpscale` permits widths beyond what the crop contains; only
 *          the desktop hero uses it, and the note there explains why.
 */
const SOURCES = [
  {
    /* IMAGE 01 — the opening photograph. A care worker and a client at the
       client's own dining table: radiator under the window, tulips, a display
       cabinet, the flat of someone who has lived somewhere a long time. The
       empty wall on the left is the reason this frame works as a hero — it is
       where the crop can breathe rather than where a face gets cut. */
    file: 'hero.jpg',
    crops: [
      /* 0.95:1 on desktop, and this is the one crop that upscales.

         The desktop panel has NO fixed aspect: it is 54% of the viewport wide
         and as tall as the copy beside it, so it MEASURES 553x809 (0.68) at
         1024px, 778x844 (0.92) at 1440px and 1037x844 (1.23) at 1920px. 0.95
         sits in the middle of that range.

         A 0.95 crop of a 1672x941 frame contains 894x941 real pixels, and the
         slot wants about 1556x1688 on a 1440px screen at DPR 2. Nothing can
         invent those pixels. Sharp's Lanczos upscale with a firmer unsharp mask
         still beats leaving the browser to do it bilinearly at display time, so
         the 1300 variant exists and is honestly an upscale. If higher-resolution
         originals ever arrive, this is the first place they pay off. */
      { name: 'hero-wide', ratio: 0.95, widths: [600, 860, 1032], focus: { x: 0.60, y: 0.50 }, q: { avif: 46, webp: 72 } },
      /* 16:9 on phones — the native aspect of the master, which means the
         phone hero is the whole frame with nothing cropped away at all.

         That is deliberate and it replaced a 1.36:1 crop. The container used to
         be sized in viewport units (`h-[34vh]`), so its aspect changed with
         every handset — 1.36:1 at 390px, 1.98:1 at 320px — and a fixed crop
         could only match one of them; object-cover sliced the rest, which on
         this frame means losing the client at the right edge and shipping a
         hero of one person talking to nobody. The container is now
         `aspect-[16/9]`, so the box and the crop are the same shape at every
         width and both people are guaranteed to survive. It is also sharper:
         every width below is native pixels. */
      { name: 'hero-tall', ratio: 16 / 9, widths: [480, 760, 1040, 1280, 1448], focus: { x: 0.5, y: 0.44 }, q: { avif: 44, webp: 70 } },
    ],
  },
  {
    /* IMAGE 02 — a care worker, a daughter and the client reading the care plan
       together at the kitchen table. It belongs beside the four questions
       families ask, because it shows the answer to all four at once: someone
       explains, the family is in the room, and it is written down. */
    file: 'beratung.jpg',
    crops: [{ name: 'beratung', ratio: 3 / 2, widths: [600, 900, 1400], focus: { x: 0.50, y: 0.48 } }],
  },
  {
    /* IMAGE 03 — Betreuung. Coffee in the conservatory with a younger
       colleague: company rather than a task. Deliberately NOT used for
       Grundpflege or Behandlungspflege, which are different promises. */
    file: 'betreuung.jpg',
    crops: [{ name: 'betreuung', ratio: 16 / 9, widths: [600, 900, 1400], focus: { x: 0.5, y: 0.46 } }],
  },
  {
    /* IMAGE 04 — Grundpflege, and the home page's argument about independence.
       Helping a man into his jacket in his own hallway: he is going out, and he
       is doing the walking. Support, not rescue. */
    file: 'grundpflege.jpg',
    crops: [
      { name: 'grundpflege', ratio: 16 / 9, widths: [600, 900, 1400], focus: { x: 0.5, y: 0.44 } },
      /* The same frame at 3:2 for the home page. The section beside it argues
         that you do not take over what someone can still do themselves, which
         is exactly what this picture is of. It is the only frame used twice in
         the set, and the two uses are on different pages. */
      { name: 'haltung', ratio: 3 / 2, widths: [600, 900, 1400], focus: { x: 0.52, y: 0.46 } },
    ],
  },
  {
    /* IMAGE 05 — Behandlungspflege. A weekly dispenser being explained, not
       administered: the client is following along, which is the difference
       between medical support at home and a procedure being done to someone.
       The crop keeps the dispenser legible without turning the frame into a
       product shot. */
    file: 'behandlungspflege.jpg',
    crops: [{ name: 'behandlungspflege', ratio: 16 / 9, widths: [600, 900, 1400], focus: { x: 0.5, y: 0.46 } }],
  },
  {
    /* IMAGE 06 — Hauswirtschaft. Shopping being put away together. Explicitly
       not a cleaning company: no bucket, no mop, no spray bottle. */
    file: 'hauswirtschaft.jpg',
    crops: [{ name: 'hauswirtschaft', ratio: 16 / 9, widths: [600, 900, 1400], focus: { x: 0.5, y: 0.46 } }],
  },
  {
    /* IMAGE 07 — Karriere. Two colleagues checking the round on a tablet in a
       block's entrance hall, bags packed. The recruiting page's job is to let a
       nurse picture the working day, and this is the working day: the corridor
       before the first visit, with someone to check it with. */
    file: 'karriere.jpg',
    crops: [{ name: 'karriere', ratio: 3 / 2, widths: [600, 900, 1400], focus: { x: 0.5, y: 0.46 } }],
  },
];

fs.mkdirSync(OUT, { recursive: true });

/**
 * Crops to an exact aspect around a focal point.
 *
 * Doing the crop here rather than leaning on `fit: 'cover'` is what makes one
 * photograph usable at 16:9 and at 0.95:1 — cover takes the middle of the frame
 * in both, and the middle of a 16:9 frame is not where the face is once you
 * squeeze it to near-square.
 */
async function crop(file, ratio, focus) {
  const { width: W, height: H } = await sharp(file).metadata();
  let w = W;
  let h = Math.round(W / ratio);
  if (h > H) { h = H; w = Math.round(H * ratio); }
  const left = Math.max(0, Math.min(W - w, Math.round(focus.x * W - w / 2)));
  const top = Math.max(0, Math.min(H - h, Math.round(focus.y * H - h / 2)));
  return { pipeline: sharp(file).extract({ left, top, width: w, height: h }), w, h };
}

const rows = [];

for (const s of SOURCES) {
  const file = path.join(SRC, s.file);
  if (!fs.existsSync(file)) throw new Error(`Missing master: ${file}`);

  for (const c of s.crops) {
    for (const w of c.widths) {
      const { pipeline, w: cw } = await crop(file, c.ratio, c.focus);
      if (w > cw && !c.allowUpscale) {
        throw new Error(`${c.name}: width ${w} exceeds the ${cw}px this crop contains. Lower the width or set allowUpscale.`);
      }
      const h = Math.round(w / c.ratio);
      const up = w > cw;

      let t = pipeline
        .resize(w, h, { fit: 'cover', kernel: 'lanczos3' })
        .modulate({ saturation: 0.97, brightness: 1.01 })
        .composite([{
          input: { create: { width: w, height: h, channels: 4, background: { r: 255, g: 240, b: 220, alpha: 0.16 } } },
          blend: 'soft-light',
        }]);
      // Upscaled variants get a firmer unsharp mask, because that is what
      // Lanczos costs. Native ones get the light default.
      t = t.sharpen({ sigma: up ? 0.9 : 0.5 });

      for (const fmt of ['avif', 'webp']) {
        const out = path.join(OUT, `${c.name}-${w}.${fmt}`);
        await (fmt === 'avif'
          ? t.clone().avif({ quality: c.q?.avif ?? 48, effort: 6 })
          : t.clone().webp({ quality: c.q?.webp ?? 74 })
        ).toFile(out);
        rows.push([`${c.name}-${w}.${fmt}`, (fs.statSync(out).size / 1024).toFixed(0) + ' KB', up ? 'upscaled' : 'native']);
      }
    }
  }
}

/* The Open Graph card.
   1200x630 is the size every platform crops to. Built from the hero so a shared
   link shows the picture the page opens on, with no text baked in — the card
   then never contradicts a headline that has since been rewritten. */
{
  const { pipeline } = await crop(path.join(SRC, 'hero.jpg'), 1200 / 630, { x: 0.56, y: 0.44 });
  const out = path.join(process.cwd(), 'public/og-default.jpg');
  await pipeline
    .resize(1200, 630, { fit: 'cover', kernel: 'lanczos3' })
    .modulate({ saturation: 0.97, brightness: 1.01 })
    .composite([{
      input: { create: { width: 1200, height: 630, channels: 4, background: { r: 255, g: 240, b: 220, alpha: 0.16 } } },
      blend: 'soft-light',
    }])
    .sharpen({ sigma: 0.6 })
    .jpeg({ quality: 82, progressive: true })
    .toFile(out);
  rows.push(['og-default.jpg', (fs.statSync(out).size / 1024).toFixed(0) + ' KB', 'native']);
}

const pad = (v, n) => String(v).padEnd(n);
console.log(`\n${pad('file', 30)}${pad('size', 10)}scale`);
console.log('-'.repeat(56));
for (const r of rows) console.log(pad(r[0], 30) + pad(r[1], 10) + r[2]);
console.log(`\n${rows.length} files written to public/img.`);
