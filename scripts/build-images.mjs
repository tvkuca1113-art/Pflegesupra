/**
 * Builds the photographic set.
 *
 * ART DIRECTION — why these photographs and not others.
 *
 * Two documentary sources, both charities photographing older people in their
 * own lives: the Centre for Ageing Better's image library, which supplies the
 * opening photograph, and Jon Pountney's series for Age Cymru, which supplies
 * the rest. Not one commission any more, and the honest reason is that the one
 * commission did not contain a usable hero. What matters for coherence is the
 * register, and both are the same register: real people, real rooms, nobody
 * holding a clipboard and smiling at nothing.
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
 * Licensing: Unsplash Licence for both sources. Attribution is not required by
 * the licence but is given anyway, in /impressum, for each source separately.
 *
 * Usage: node scripts/build-images.mjs
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const OUT = path.join(process.cwd(), 'public/img');
const TMP = path.join(process.cwd(), '.image-cache');

/* The hero is encoded harder than the rest of the set, and it is worth saying
   why rather than leaving a magic number.

   Every other image on this site is lazy: its bytes arrive after the page is
   usable and cost nothing that a visitor perceives. The hero is the one eager
   image and therefore *is* the Largest Contentful Paint on the home page. When
   the opening frame was replaced, LCP on the throttled mobile profile went from
   1.28 s to 2.05 s — not because the new picture is worse but because it is a
   whole room in daylight, with foliage and patterned fabric, where the old one
   was a soft close-up. Detail costs bytes.

   Measured at 1040px on the phone crop: quality 52 gives 67 KB, quality 40
   gives 41 KB, quality 34 gives 32 KB. Compared side by side at 1:1, 34 is
   already hard to separate from 52 on skin and spectacle frames; 40 is not
   separable at all, and it is the number here. That took LCP back to 1.34 s.

   The `effort` knob is deliberately NOT touched, and that is a correction: the
   first version of this raised it to 9 on the reasoning that a build-time
   encode may as well work harder. Measured on the 1300px desktop crop, effort
   6 gives 65 KB in 25 s, effort 7 gives 66 KB in 33 s and effort 9 gives 65 KB
   in 82 s. It buys nothing and triples the build. Quality was doing all the
   work; effort was doing none.

   The other crops stay at the set default: spending anything extra on an image
   nobody waits for buys nothing either. */
const HERO_Q = { avif: 40, webp: 66 };

/**
 * source  — the Unsplash photo id, so any of these can be traced back.
 * url     — the direct image URL at a size large enough for every crop below.
 * crops   — name, aspect ratio, widths, and the focal point as a fraction of
 *           the source. The focal point is the whole game: `cover` cropping
 *           with a default centre put a face half outside the frame twice.
 *           `q` optionally overrides the encoder quality for one crop; only
 *           the hero uses it, because only the hero is eager and therefore the
 *           only image whose bytes land in the LCP. See HERO_Q above.
 */
const SOURCES = [
  {
    /* THE OPENING PHOTOGRAPH.
       Centre for Ageing Better's image library rather than Age Cymru, and the
       reason is worth recording. The frame that used to sit here was a tight
       two-head close-up: warm, but with no room in it — no window, no wall, no
       furniture, nothing that said where this was happening. At hero size it
       read as a fragment of a photograph rather than a photograph, and the
       client rejected it outright, twice.

       This one is a whole scene. A real front room, daylight through the
       window, two people in an unposed exchange over a photo album, and enough
       air around them to crop at two very different aspects. It says the one
       thing the hero of an ambulatory service has to say: this happens in your
       home, not in an institution. Nobody looks at the camera, nobody is in
       uniform, there is no equipment and no logo. */
    key: 'hausbesuch',
    id: 'rQJ3xo-0WYE',
    credit: 'Centre for Ageing Better',
    url: 'https://images.unsplash.com/photo-1702648156180-25d8be9c9527?fm=jpg&q=92&w=2400',
    crops: [
      /* 0.95:1 — very slightly taller than square — from the laptop breakpoint
         up, and this one is a compromise rather than a match, which is worth
         being explicit about.

         The desktop panel has no fixed aspect: it is 54% of the viewport wide
         and as tall as the copy beside it, so it MEASURES 553x809 (0.68) at
         1024px, 778x844 (0.92) at 1440px and 1037x844 (1.23) at 1920px. No
         single crop fits all of that. 0.95 sits in the middle of where the
         traffic is: at 1440 it loses 3% of its width to object-cover, at 1366
         about 8%, and at the two ends it gives up roughly a quarter of one
         dimension — which the framing below is chosen to survive, both faces
         well inside the centre.

         The first version of this crop was 6:5. That is the aspect the panel
         had before the hero copy was retuned, and nobody re-measured: at 1440
         it silently threw away 23% of the frame's width. Measure the box. */
      { name: 'hero-wide', ratio: 0.95, widths: [900, 1300, 1800], focus: { x: 0.56, y: 0.48 }, q: HERO_Q },
      /* 1.36:1 on phones — MEASURED from the box, not chosen by eye. The phone
         hero container is `h-[34vh] max-h-[20rem]` at full width, which comes
         out 360x265, 390x287 and 430x317 on the three handset sizes: 1.36:1
         every time. Match the crop to the box. Every time. */
      { name: 'hero-tall', ratio: 1.36, widths: [480, 760, 1040], focus: { x: 0.55, y: 0.5 }, q: HERO_Q },
    ],
  },
  {
    key: 'pflegerin',
    id: 'dMhB7w99ju8',
    credit: 'Jon Pountney für Age Cymru',
    url: 'https://images.unsplash.com/photo-1765896387387-0538bc9f997e?fm=jpg&q=92&w=2400',
    crops: [
      /* This sitting used to supply the hero as well. It no longer does — see
         the note on `hausbesuch` above — and what is left is the crop it was
         always best at: the caregiver alone, tight, in working clothes, for the
         careers page. A close-up with no room in it is a weak hero and a strong
         portrait; the mistake was asking one frame to be both. */
      { name: 'pflegekraft', ratio: 4 / 5, widths: [480, 720, 1000], focus: { x: 0.27, y: 0.44 } },
      /* And the same frame wide, for /ueber-uns.

         That slot used to be filled by a separate sitting — two women talking
         over coffee — which was cut from this script as a canteen scene and
         then went on serving the page anyway, because the generated files were
         still committed and nothing re-ran the script. A crop the build cannot
         reproduce is a crop that does not exist; it only looked like it did.
         So the slot is filled from a sitting that is actually here. */
      { name: 'ueber-uns', ratio: 3 / 2, widths: [600, 900, 1400], focus: { x: 0.5, y: 0.42 } },
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
          ? treated.clone().avif({ quality: c.q?.avif ?? 52, effort: 6 })
          : treated.clone().webp({ quality: c.q?.webp ?? 74 })
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
  const base = await crop(src, 1200 / 630, { x: 0.56, y: 0.5 });
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
