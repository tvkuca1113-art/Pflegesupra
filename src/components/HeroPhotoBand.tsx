/**
 * The photograph, on phones and tablets — as a band in the flow, not as a
 * backdrop behind the text.
 *
 * Why it is not a backdrop here. The mobile hero's text fills essentially the
 * whole section, so any photograph behind it has to be darkened far enough for
 * white type to clear 4.5:1 — and at that point the image stops being
 * recognisable. Two attempts at tuning the overlay proved it: the contrast
 * passed and the picture still read as a blue smudge. There is no opacity that
 * satisfies both, because they are the same pixels.
 *
 * Splitting them solves it outright. The band carries no text, so it needs no
 * darkening and only a light blue cast to stay in the palette; the message
 * below sits on solid brand ink, where contrast is not a question at all.
 * A visitor arriving on a phone sees the logo, then a pair of hands, then the
 * offer — which is the order that does the emotional work.
 *
 * From `lg` up the layout has a free right-hand column, so the photograph goes
 * back to being a full-bleed backdrop there — see HeroBackdrop.
 *
 * Decorative: it illustrates the idea of care, it does not depict Supra's staff
 * or clients. Credited in the Impressum, `alt=""` for assistive technology.
 */
/** Everything below `lg`, matching the Tailwind breakpoint used for layout. */
const PHONE = '(max-width: 63.999rem)';

export default function HeroPhotoBand() {
  const srcSet = (ext: string) =>
    [480, 760, 1040].map((w) => `/img/hero-hands-band-${w}.${ext} ${w}w`).join(', ');

  return (
    <div className="relative lg:hidden" aria-hidden="true">
      <picture>
        <source media={PHONE} type="image/avif" srcSet={srcSet('avif')} sizes="100vw" />
        <source media={PHONE} type="image/webp" srcSet={srcSet('webp')} sizes="100vw" />
        <img
          /* A 1x1 transparent GIF, not the real file. From `lg` up neither
             <source> matches and the browser falls back to this src — and it
             would download the phone crop for a band that is not displayed.
             Measured: 25 KB wasted on every desktop visit. */
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt=""
          width={1560}
          height={980}
          /* The LCP element on a phone, so eager and high priority. The
             explicit dimensions reserve its space and keep CLS at zero. */
          fetchPriority="high"
          decoding="async"
          /* A cinematic 2:1 on phones keeps the primary call button above the
             fold; taller screens can afford 16:9. */
          className="aspect-[2/1] w-full object-cover object-[46%_52%] sm:aspect-[16/9]"
        />
      </picture>

      {/* Only the bottom edge is shaded, to settle the photograph into the
          brand ink below rather than ending on a hard line. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
        style={{ background: 'linear-gradient(to bottom, rgba(0,26,82,0) 0%, #001a52 100%)' }}
      />
      {/* The same 4px orange rule that marks every section heading, used here
          as the seam between the photograph and the message. */}
      <span className="absolute inset-x-0 bottom-0 block h-1 bg-sun" />
    </div>
  );
}
