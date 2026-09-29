import { PHOTO_CREDIT } from '@/content/photos';

/** One full-bleed scene. CSS changes the focal point on small screens. */
export default function HeroPhoto() {
  const widths = [960, 1600, 1774];
  const set = (ext: string) => widths.map((w) => `/img/supra-home-hero-${w}.${ext} ${w}w`).join(', ');
  return (
    <picture className="home-hero__picture">
      <source type="image/avif" srcSet={set('avif')} sizes="(max-width: 47.999rem) 190vw, 100vw" />
      <source type="image/webp" srcSet={set('webp')} sizes="(max-width: 47.999rem) 190vw, 100vw" />
      <img
        src="/img/supra-home-hero-1600.webp"
        alt={`Eine Pflegekraft im Supra-Polo und eine Seniorin im vertrauten Gespräch zu Hause. ${PHOTO_CREDIT.short}`}
        width={1774}
        height={887}
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}
