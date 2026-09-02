/**
 * The photograph as the hero's background on phones and tablets.
 *
 * It is bounded to the TEXT BLOCK, not to the whole hero section. That
 * distinction is the entire trick. The "Was passiert, wenn Sie anrufen" card
 * also lives inside the hero, which on a phone stacked it underneath and made
 * the section ~1,290px tall — so a background covering the section had to be
 * cropped to roughly a 0.28 aspect, i.e. a 17%-wide vertical slice of the
 * photograph. That is what kept rendering as an unrecognisable smudge.
 *
 * Bounded to the text block the ratio is about 0.7, which a real crop can fill,
 * so the hands read. The card below then sits on solid brand ink.
 *
 * Full-bleed inside a padded container via the standard
 * `left-1/2 -translate-x-1/2 w-screen` trick, because the text column it
 * belongs to is inside `.shell`.
 *
 * The image is the BRIGHT treatment. Earlier passes used a darkened duotone and
 * then also put a heavy scrim on top, which is why nothing survived; the scrim
 * alone does the contrast work now, and its values come from
 * `npm run check:hero`, which measures text against the lightest pixel beneath
 * it rather than trusting the eye.
 *
 * Decorative: it illustrates the idea of care, it does not depict Supra's staff
 * or clients. Credited in the Impressum, hidden from assistive technology.
 */
const PHONE = '(max-width: 63.999rem)';

export default function HeroPhotoBackdrop() {
  const srcSet = (ext: string) =>
    [480, 760, 1040].map((w) => `/img/hero-hands-mob-${w}.${ext} ${w}w`).join(', ');

  return (
    <div
      className="pointer-events-none absolute -top-10 bottom-[-3rem] left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden lg:hidden"
      aria-hidden="true"
    >
      <picture>
        <source media={PHONE} type="image/avif" srcSet={srcSet('avif')} sizes="100vw" />
        <source media={PHONE} type="image/webp" srcSet={srcSet('webp')} sizes="100vw" />
        <img
          /* A 1x1 transparent GIF, not the real file. From `lg` up neither
             <source> matches and the browser would otherwise fall back to
             downloading the phone crop for a backdrop that is not displayed. */
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt=""
          /* The LCP element on a phone, so eager and high priority. */
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[52%_30%]"
        />
      </picture>

      {/* The scrim. Strongest across the headline, easing off towards the
          bottom where the buttons carry their own solid backgrounds and the
          photograph can come through. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,19,68,0.76) 0%, rgba(0,20,72,0.73) 52%, rgba(0,20,72,0.68) 76%, rgba(0,20,72,0.66) 100%)',
        }}
      />
      {/* No rule at the bottom edge: this backdrop ends in the middle of the
          hero, above the card, so a section-boundary rule there would read as a
          stray line rather than as a boundary. */}
    </div>
  );
}
