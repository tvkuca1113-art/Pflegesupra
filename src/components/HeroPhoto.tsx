import { PHOTO_CREDIT } from '@/content/photos';

const PHONE = '(max-width: 63.999rem)';
const DESK = '(min-width: 64rem)';

/**
 * The opening photograph, art-directed.
 *
 * Two different crops of the same frame: a square on phones, 6:5 from the
 * laptop breakpoint up — both chosen to match the box they land in. They are served from ONE <picture> with media-scoped
 * <source> elements rather than two <img> tags in `hidden`/`lg:block`
 * wrappers, because an <img> inside a display:none container is still
 * downloaded — measured on this site, twice. A media attribute on <source> is
 * evaluated before the fetch; a CSS class is not.
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
      <source media={PHONE} type="image/avif" srcSet={set('hero-tall', 'avif', [560, 840, 1120])} sizes="100vw" />
      <source media={PHONE} type="image/webp" srcSet={set('hero-tall', 'webp', [560, 840, 1120])} sizes="100vw" />
      <img
        src="/img/hero-tall-840.webp"
        // The alt text describes the two people, because that is the whole
        // content of the picture. It does not say "Pflegerin", because we
        // cannot know that about someone in a licensed photograph — and this
        // site does not assert things it cannot know.
        alt={`Zwei Frauen lachen miteinander in einem Wohnzimmer, eine jüngere in blauer Arbeitskleidung beugt sich zu einer älteren hinunter. ${PHOTO_CREDIT.short}`}
        width={1120}
        height={1120}
        fetchPriority="high"
        decoding="async"
        className="block h-full w-full object-cover"
      />
    </picture>
  );
}
