/**
 * One photograph, in the formats and widths the build script produced.
 *
 * Why not next/image: every image on this site is a fixed editorial asset that
 * has already been cropped to a focal point and encoded to AVIF and WebP at
 * three widths by `scripts/build-images.mjs`. next/image would add a runtime
 * optimiser in front of files that are already optimal, and on a static export
 * it would either be disabled or serve the originals. A plain <picture> with
 * an explicit srcset is smaller, faster and easier to reason about.
 *
 * The width and height attributes are not optional here. Without them the
 * browser cannot reserve the box before the bytes arrive, and every image on
 * the page becomes a layout shift — the exact defect that measured 0.31 on
 * this site once already.
 */
type Props = {
  /** Base name from the build script, e.g. "hero-wide". */
  name: string;
  /** Widths that exist on disk for this name, smallest first. */
  widths: number[];
  /** Aspect ratio the crop was built at, used to derive the height attribute. */
  ratio: number;
  /** `sizes` for the responsive selection — always state it, never guess. */
  sizes: string;
  /**
   * Empty string marks the image as decorative. Anything else must describe
   * what a person who cannot see it would need to know — not "photo of".
   */
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

export default function Photo({
  name, widths, ratio, sizes, alt, className = '', imgClassName = '', priority = false,
}: Props) {
  const largest = widths[widths.length - 1];
  const srcSet = (ext: string) => widths.map((w) => `/img/${name}-${w}.${ext} ${w}w`).join(', ');

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet('webp')} sizes={sizes} />
      <img
        src={`/img/${name}-${largest}.webp`}
        alt={alt}
        width={largest}
        height={Math.round(largest / ratio)}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={`block h-full w-full object-cover ${imgClassName}`}
      />
    </picture>
  );
}
