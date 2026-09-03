import { PHOTO_CREDIT } from '@/content/photos';

const PHONE = '(max-width: 63.999rem)';
const DESK = '(min-width: 64rem)';

/**
 * The opening photograph, art-directed.
 *
 * Two crops of the same frame: 1.36:1 on phones, which is the measured aspect
 * of the hero container at 360, 390 and 430px, and 0.95:1 from the laptop
 * breakpoint up, which is a deliberate compromise because that panel has no
 * fixed aspect at all. `scripts/build-images.mjs` carries the measurements.
 *
 * The frame itself was replaced once. The previous one was a tight close-up of
 * two heads with no room in it — a fine portrait and a poor hero, because a
 * hero has to establish a place before it establishes a mood. This one has a
 * window, a wall and a sofa in it, so a visitor can see where the care happens.
 *
 * They are served from ONE <picture> with media-scoped <source> elements
 * rather than two <img> tags in `hidden`/`lg:block` wrappers, because an <img>
 * inside a display:none container is still downloaded — measured on this site,
 * twice. A media attribute on <source> is evaluated before the fetch; a CSS
 * class is not.
 *
 * `priority` is deliberate and singular: this is the LCP element on the home
 * page and the only image in the project that is eager.
 */
export default function HeroPhoto() {
  const set = (name: string, ext: string, widths: number[]) =>
    widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ');

  return (
    <picture className="block h-full w-full">
      <source media={DESK} type="image/avif" srcSet={set('hero-wide', 'avif', [900, 1300, 1800])} sizes="54vw" />
      <source media={DESK} type="image/webp" srcSet={set('hero-wide', 'webp', [900, 1300, 1800])} sizes="54vw" />
      <source media={PHONE} type="image/avif" srcSet={set('hero-tall', 'avif', [480, 760, 1040])} sizes="100vw" />
      <source media={PHONE} type="image/webp" srcSet={set('hero-tall', 'webp', [480, 760, 1040])} sizes="100vw" />
      <img
        src="/img/hero-tall-760.webp"
        // The alt text describes what is in the frame and stops there. It does
        // not say "Pflegerin" or "Klient", because we cannot know that about
        // people in a licensed photograph — and this site does not assert
        // things it cannot know.
        alt={`Eine jüngere und eine ältere Person sitzen nebeneinander auf einem Sofa am Fenster und sehen sich lachend ein Fotoalbum an. ${PHOTO_CREDIT.short}`}
        width={1040}
        height={765}
        fetchPriority="high"
        decoding="async"
        className="block h-full w-full object-cover"
      />
    </picture>
  );
}
