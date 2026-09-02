/**
 * The hero backdrop — the photograph as a full-bleed ground, FROM `lg` UP ONLY.
 *
 * On phones the photograph is a band in the flow instead (HeroPhotoBand): the
 * mobile hero's text covers the whole section, so a backdrop there has to be
 * darkened until it is no longer recognisable. A laptop has a free right-hand
 * column beside the headline, so the image can sit behind the layout and still
 * read as a photograph.
 *
 * On the photograph. The client's own site uses AI-generated images of people
 * who do not exist, which its Impressum states outright — that is corrosive on
 * a care provider's site and none of it was carried over. This is the opposite
 * case: a real photograph by a named photographer, licensed for commercial use
 * (Unsplash), credited in the Impressum, and used as ATMOSPHERE ONLY. It is
 * never captioned or framed as Supra's team, staff, clients or premises,
 * because it is not. `alt=""` keeps it decorative for assistive technology.
 *
 * The crop keeps the hands right of centre so the headline column stays clear.
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
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden bg-brand-ink print:hidden lg:block"
      aria-hidden="true"
    >
      <div className="hero-backdrop-image absolute inset-0" />

      {/* Contrast overlay: horizontal, so the headline column is dark and the
          hands stay visible on the right. Its opacities are the output of
          `npm run check:hero`, which measures text against the lightest pixel
          it actually sits on — not a taste judgement. */}
      <div
        className="absolute inset-0"
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
