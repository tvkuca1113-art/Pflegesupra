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
 * The frame is one of seven photographs supplied and approved by the client;
 * everything that stood here before came from a stock library and is gone.
 *
 * The two crops are not interchangeable and the mobile one is the fussier of
 * the pair: on a phone the picture is a 1.36:1 band, and a centred crop of a
 * 16:9 original pushes the client out of the right-hand edge, leaving a hero
 * that shows one person talking to nobody. The focal point in
 * `scripts/build-images.mjs` is set right of centre for exactly that reason,
 * and both crops are verified at 360, 390 and 430px.
 *
 * `priority` is deliberate and singular: this is the LCP element on the home
 * page and the only image in the project that is eager.
 */
export default function HeroPhoto() {
  const set = (name: string, ext: string, widths: number[]) =>
    widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ');

  return (
    <picture className="block h-full w-full">
      <source media={DESK} type="image/avif" srcSet={set('hero-wide', 'avif', [600, 860, 1032])} sizes="54vw" />
      <source media={DESK} type="image/webp" srcSet={set('hero-wide', 'webp', [600, 860, 1032])} sizes="54vw" />
      <source media={PHONE} type="image/avif" srcSet={set('hero-tall', 'avif', [480, 760, 1040, 1280, 1448])} sizes="100vw" />
      <source media={PHONE} type="image/webp" srcSet={set('hero-tall', 'webp', [480, 760, 1040, 1280, 1448])} sizes="100vw" />
      <img
        src="/img/hero-tall-760.webp"
        // The alt text describes what is in the frame and stops there. It does
        // not say "Pflegerin" or "Klient", because we cannot know that about
        // people in a licensed photograph — and this site does not assert
        // things it cannot know.
        alt={`Pflegekraft im Gespräch mit einer Seniorin am Esstisch ihrer Wohnung. ${PHOTO_CREDIT.short}`}
        width={1448}
        height={815}
        fetchPriority="high"
        decoding="async"
        className="block h-full w-full object-cover"
      />
    </picture>
  );
}
