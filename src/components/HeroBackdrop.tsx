/**
 * The hero backdrop: a photograph under a brand-blue duotone.
 *
 * On the photograph. The client's own site uses AI-generated images of people
 * who do not exist, which its Impressum states outright — that is corrosive on
 * a care provider's site and none of it was carried over. This is the opposite
 * case: a real photograph by a named photographer, licensed for commercial use
 * (Unsplash), credited in the Impressum, and used as ATMOSPHERE ONLY. It is
 * never captioned or framed as Supra's team, staff, clients or premises,
 * because it is not. `alt=""` keeps it decorative for assistive technology.
 *
 * Art direction is real, not a crop of convenience. `wide` keeps the hands
 * right of centre so the headline column stays clear on a laptop. `tall` is a
 * TRUE PORTRAIT crop for phones — the first attempt used a landscape crop,
 * which object-cover then scaled to fill a 1,389px-tall box, showing only
 * ~17% of its width: a vertical slice of background bokeh that read as a
 * smudge rather than as hands. <picture> switches between the two by media
 * query, which a single responsive image cannot do.
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
  const wide = (ext: string) =>
    [1200, 1800, 2400].map((w) => `/img/hero-hands-wide-${w}.${ext} ${w}w`).join(', ');
  const tall = (ext: string) =>
    [420, 640, 860].map((w) => `/img/hero-hands-tall-${w}.${ext} ${w}w`).join(', ');

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

          `tall` is a portrait crop matched to the phone hero's proportions;
          `wide` keeps the hands right of centre so the headline column stays
          clear on a laptop. */}
      <picture>
        <source media="(min-width: 64rem)" type="image/avif" srcSet={wide('avif')} sizes="100vw" />
        <source media="(min-width: 64rem)" type="image/webp" srcSet={wide('webp')} sizes="100vw" />
        <source type="image/avif" srcSet={tall('avif')} sizes="100vw" />
        <source type="image/webp" srcSet={tall('webp')} sizes="100vw" />
        <img
          src="/img/hero-hands-tall-640.webp"
          alt=""
          /* The LCP element, so eager and high priority rather than lazy. */
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[50%_52%] lg:object-[64%_46%]"
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
            'linear-gradient(to bottom, rgba(0,19,68,0.62) 0%, rgba(0,20,72,0.60) 34%, rgba(0,20,72,0.70) 72%, rgba(0,20,72,0.84) 100%)',
        }}
      />
      <div
        className="absolute inset-0 hidden lg:block"
        style={{
          background:
            'linear-gradient(100deg, rgba(0,19,68,0.95) 0%, rgba(0,20,72,0.86) 32%, rgba(0,22,80,0.50) 60%, rgba(0,24,86,0.30) 100%)',
        }}
      />

      {/* Closes the composition with the same 4px orange rule that marks every
          section heading on the site. */}
      <span className="absolute inset-x-0 bottom-0 block h-1 bg-sun" />
    </div>
  );
}
