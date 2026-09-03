/**
 * Composites the real Supra logo onto the caregivers' uniforms.
 *
 * WHY THIS IS A SCRIPT AND NOT A PROMPT. The photographs are generated, and
 * generated lettering is unreliable: it produces "Suppera", "Cupera", a mirrored
 * S, or a wordmark that is subtly the wrong shape — and a care provider's own
 * name spelt wrong on its own staff is worse than no logo at all. So the real
 * asset (public/logo-supra.png, the same file the site header uses) is
 * composited geometrically. Nothing regenerates the lettering, which means it
 * cannot come out misspelt.
 *
 * THE ONE DELIBERATE DEVIATION FROM THE BRAND FILE. The logo's wordmark is
 * brand blue (#003399). The uniforms are navy. Blue on navy is unreadable, so
 * the script that goes on fabric is the light knockout in assets/brand — the
 * same thing a real embroiderer would supply for a dark garment. The sun keeps
 * its orange, because that is what carries the identity on a dark ground, and
 * the letterforms and proportions are untouched.
 *
 * MAKING IT SIT IN THE CLOTH rather than on top of it, in four steps, none of
 * them dramatic: a stitch shadow offset a pixel down-right so the mark has
 * depth; a rotation matched to the angle of each person's body; a fraction of
 * the underlying fabric's own luminance multiplied back over the mark so it
 * picks up the shirt's light and folds; and a whisker of blur so it shares the
 * photograph's focus instead of being the sharpest thing in the frame.
 *
 * WHAT IT STILL IS NOT: a true displacement map. The logo is a flat mark
 * rotated into place, not warped along the fabric's folds. On a chest that is
 * close to flat in frame — which is every placement here — the difference is
 * not visible at page size. It would be visible on a heavily creased or steeply
 * turned torso, which is why the placements below sit on the flattest part of
 * each chest.
 *
 * Coordinates are fractions of the master, so they survive any re-crop.
 *
 * Usage: node scripts/brand-photos.mjs   (then rebuild with build-images.mjs)
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'assets/photos');
const OUT = path.join(process.cwd(), 'assets/photos-branded');
const LOGO = path.join(process.cwd(), 'assets/brand/logo-knockout.png');

/**
 * x, y  — centre of the mark, as a fraction of the master.
 * w     — width of the mark, as a fraction of the master's width.
 * rot   — degrees, matched to the tilt of that person's shoulders.
 *
 * One entry per CAREGIVER, not per photograph: `karriere` has two people in
 * uniform and therefore two entries. Nothing is placed on a client, on a family
 * member, or on civilian clothing.
 */
const PLACEMENTS = {
  /* hero and grundpflege are centred on the illegible emblem the generator put
     there, so the real mark covers the invented one rather than sitting beside
     it — two logos on one chest was the first version's mistake. Both are
     sized a little larger than the rest for the same reason. */
  hero: [{ x: 0.618, y: 0.630, w: 0.040, rot: -4, cover: { x: 0.596, y: 0.612, w: 0.048, h: 0.052, fromDx: -0.052, fromDy: -0.010 } }],
  beratung: [{ x: 0.190, y: 0.480, w: 0.032, rot: 8 }],
  betreuung: [{ x: 0.300, y: 0.560, w: 0.030, rot: -3 }],
  grundpflege: [{ x: 0.416, y: 0.388, w: 0.036, rot: 2, cover: { x: 0.397, y: 0.356, w: 0.046, h: 0.056, fromDx: -0.058, fromDy: 0.030 } }],
  behandlungspflege: [{ x: 0.290, y: 0.530, w: 0.038, rot: -2 }],
  hauswirtschaft: [{ x: 0.295, y: 0.525, w: 0.029, rot: 3 }],
  karriere: [
    { x: 0.245, y: 0.525, w: 0.028, rot: -3 },  // left, curly hair
    { x: 0.495, y: 0.445, w: 0.032, rot: 2 },   // right, bag over shoulder
  ],
};
fs.mkdirSync(OUT, { recursive: true });

for (const [name, marks] of Object.entries(PLACEMENTS)) {
  const file = path.join(SRC, `${name}.jpg`);
  if (!fs.existsSync(file)) throw new Error(`Missing master: ${file}`);
  const base = sharp(file);
  const { width: W, height: H } = await base.metadata();

  const layers = [];
  for (const m of marks) {
    /* Two of the generated photographs already had an invented emblem on the
       chest — illegible lettering that reads as a logo at a glance and as
       nonsense at full size. The real mark goes on top, but the logo has
       transparent gaps between the sun and the S, and the old scribble showed
       through them. So the fabric is patched first: a clean piece of the same
       shirt, taken from `fromDx`/`fromDy` away, blurred and feathered hard at
       the edges, laid over the invented emblem. Then the real mark goes on the
       clean cloth.

       The offsets are sideways, not downward, and that is the second attempt:
       sampling from below landed on a forearm in both photographs and stamped a
       skin-coloured rectangle on the shirt. Sample along the garment. */
    if (m.cover) {
      const cw = Math.round(m.cover.w * W);
      const ch = Math.round(m.cover.h * H);
      const cl = Math.round(m.cover.x * W);
      const ct = Math.round(m.cover.y * H);
      const patch = await sharp(file)
        .extract({
          left: Math.max(0, Math.min(W - cw, cl + Math.round((m.cover.fromDx ?? 0) * W))),
          top: Math.max(0, Math.min(H - ch, ct + Math.round((m.cover.fromDy ?? 0) * H))),
          width: cw,
          height: ch,
        })
        .blur(2.5)
        .toBuffer();
      const feather = Buffer.from(
        `<svg width="${cw}" height="${ch}"><defs><radialGradient id="f"><stop offset="25%" stop-color="#fff"/><stop offset="100%" stop-color="#000"/></radialGradient></defs>`
        + `<rect width="${cw}" height="${ch}" fill="url(#f)"/></svg>`,
      );
      layers.push({
        input: await sharp(patch)
          .composite([{ input: await sharp(feather).blur(6).toBuffer(), blend: 'dest-in' }])
          .png()
          .toBuffer(),
        left: cl,
        top: ct,
        blend: 'over',
      });
    }

    const lw = Math.round(m.w * W);

    const logo = await sharp(LOGO)
      .resize({ width: lw })
      .rotate(m.rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .blur(0.35)
      .toBuffer();
    const { width: rw, height: rh } = await sharp(logo).metadata();
    const left = Math.round(m.x * W - rw / 2);
    const top = Math.round(m.y * H - rh / 2);

    // The mark is laid on at just under full opacity rather than being
    // multiplied by the fabric beneath it. The first version did multiply, and
    // it was wrong in a way worth recording: navy is dark, so multiplying by it
    // dragged a white knockout down to a barely visible smudge. Embroidery on a
    // dark garment is BRIGHTER than the cloth, not darker. What it does share
    // with the cloth is softness, which the blur above provides.
    const shaded = await sharp(logo).ensureAlpha(0.92).toBuffer();

    // Stitch shadow first, then the mark itself.
    layers.push({
      input: await sharp(shaded).modulate({ brightness: 0.25 }).blur(0.9).toBuffer(),
      left: left + 1,
      top: top + 1,
      blend: 'over',
    });
    layers.push({ input: shaded, left, top, blend: 'over' });
  }

  const out = path.join(OUT, `${name}.jpg`);
  await base.composite(layers).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toFile(out);
  console.log(`${name.padEnd(20)} ${marks.length} mark(s)  ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}

console.log(`\nBranded masters written to assets/photos-branded.`);
