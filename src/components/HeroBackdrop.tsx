/**
 * The hero backdrop: a photograph, a brand-blue duotone over it, and the
 * logo's sun.
 *
 * On the photograph. The client's own site uses AI-generated images of people
 * who do not exist, which its Impressum states outright — that is corrosive on
 * a care provider's site and none of it was carried over. This is the opposite
 * case: a real photograph by a named photographer, licensed for commercial use
 * (Unsplash), credited in the Impressum, and used as ATMOSPHERE ONLY. It is
 * never captioned or framed as Supra's team, staff, clients or premises,
 * because it is not. `alt=""` keeps it decorative for assistive technology.
 *
 * Art direction is real, not a crop of convenience: `wide` keeps the hands
 * right of centre so the headline column stays clear on a laptop, `tall` is a
 * separate crop tight on the hands for a phone, where a 16:9 image would
 * squeeze into an unreadable vertical sliver. <picture> switches between them
 * by media query — something a single responsive image cannot do.
 *
 * The duotone is baked into the files (sharp: darken, then tint with brand
 * chroma) rather than applied with a CSS filter, so it costs nothing at
 * runtime and cannot fail to load separately from the image.
 *
 * Contrast over a photograph varies per pixel, so it is measured rather than
 * assumed: `npm run check:hero` photographs the ground under every piece of
 * hero text and checks the lightest pixel. Do not weaken the overlays below
 * without re-running it.
 */
export default function HeroBackdrop() {
  const CX = 200;
  const CY = 200;

  const wide = (ext: string) =>
    [1200, 1800, 2400].map((w) => `/img/hero-hands-wide-${w}.${ext} ${w}w`).join(', ');
  const tall = (ext: string) =>
    [560, 840, 1120].map((w) => `/img/hero-hands-tall-${w}.${ext} ${w}w`).join(', ');

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-brand-ink print:hidden"
      aria-hidden="true"
    >
      {/* ONE <picture> with media-scoped sources, not two hidden <picture>
          blocks. A container with `display:none` does NOT stop the browser
          fetching the image inside it — measured: both crops were being
          downloaded at every breakpoint, roughly doubling the bytes. Media
          attributes on <source> are what art direction is actually for, and
          only the matching one is requested.

          `tall` is a landscape crop tight on the hands, for phones, where the
          hero is ~1,389px tall and a wide image would be sliced into an
          unreadable vertical sliver. `wide` keeps the hands right of centre so
          the headline column stays clear on a laptop. */}
      <picture>
        <source media="(min-width: 64rem)" type="image/avif" srcSet={wide('avif')} sizes="100vw" />
        <source media="(min-width: 64rem)" type="image/webp" srcSet={wide('webp')} sizes="100vw" />
        <source type="image/avif" srcSet={tall('avif')} sizes="100vw" />
        <source type="image/webp" srcSet={tall('webp')} sizes="100vw" />
        <img
          src="/img/hero-hands-tall-840.webp"
          alt=""
          /* The LCP element, so eager and high priority rather than lazy. */
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[54%_42%] lg:object-[64%_46%]"
        />
      </picture>

      {/* Contrast overlays. Two elements rather than one because the text runs
          the full width on a phone and sits in the left column from lg up — but
          these are CSS only, so an unused one costs nothing.

          On a phone the eyebrow starts 102px into the hero, so there is no
          clean window above the text: the photograph is a texture behind type,
          and how light it may be is set by measurement, not taste.
          `npm run check:hero` reports contrast against the lightest pixel under
          each line; this lands around 6:1 against a 4.5:1 requirement. */}
      <div
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,19,68,0.70) 0%, rgba(0,20,72,0.66) 34%, rgba(0,20,72,0.74) 72%, rgba(0,20,72,0.86) 100%)',
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(100deg, rgba(0,19,68,0.95) 0%, rgba(0,20,72,0.86) 32%, rgba(0,22,80,0.50) 60%, rgba(0,24,86,0.30) 100%)',
        }}
      />

      {/* Warm light from the logo's sun, kept tight so it never washes the text. */}
      <div
        className="absolute right-[-14%] top-[-24%] h-[70%] w-[130%] sm:right-[-6%] sm:w-[70%]"
        style={{
          background:
            'radial-gradient(circle at 72% 34%, rgba(255,138,43,0.26) 0%, rgba(255,102,0,0.10) 38%, rgba(255,102,0,0) 68%)',
        }}
      />

      {/* The sun itself: the logo's eleven rays over a half-disc, whole and
          uncropped. Hidden from lg up, where the "Was passiert" card moves into
          the right column and carries its own sunrise band — two suns in one
          composition read as a mistake rather than a motif. */}
      <svg
        viewBox="0 0 400 260"
        className="absolute right-3 top-2 w-28 sm:right-6 sm:top-3 sm:w-36 lg:hidden"
        role="presentation"
        focusable="false"
      >
        <defs>
          <linearGradient id="sunrise-ray" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%" stopColor="#ff6600" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffa657" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {Array.from({ length: 11 }, (_, i) => {
          const angle = (Math.PI / 10) * i;
          const inner = 118;
          const outer = 156 + (i % 2 ? 0 : 22);
          return (
            <line
              key={i}
              x1={CX - Math.cos(angle) * inner}
              y1={CY - Math.sin(angle) * inner}
              x2={CX - Math.cos(angle) * outer}
              y2={CY - Math.sin(angle) * outer}
              stroke="url(#sunrise-ray)"
              strokeWidth={i % 2 ? 6 : 9}
              strokeLinecap="round"
            />
          );
        })}
        <path
          d={`M ${CX - 100} ${CY} A 100 100 0 0 1 ${CX + 100} ${CY}`}
          fill="none"
          stroke="#ff6600"
          strokeWidth="15"
          strokeLinecap="round"
        />
      </svg>

      {/* Closes the composition with the same 4px orange rule that marks every
          section heading on the site. */}
      <span className="absolute inset-x-0 bottom-0 block h-1 bg-sun" />
    </div>
  );
}
