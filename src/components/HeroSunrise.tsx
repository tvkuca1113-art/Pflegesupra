/**
 * The hero ground — the logo's sunrise, at full scale.
 *
 * Why this exists: the first screen on a phone was black type on white, which
 * reads as a document rather than as a business you would trust with your
 * mother. The obvious fix is a photograph, but the client has none that are
 * real — their current site's images are AI-generated, stated in their own
 * Impressum — and stock photography of strangers pretending to be carers is
 * worse than nothing on a care provider's site.
 *
 * So the brand carries the first screen instead. Deep blue ground and an
 * orange sun are exactly the logo, and nothing here can misrepresent anyone.
 *
 * The sun is a fixed-size element positioned in the corner, NOT an SVG cropped
 * by `preserveAspectRatio="slice"`. Slicing cropped the disc differently at
 * every width and at 390px turned it into an orange smear across the headline.
 * A sized element is drawn whole at every breakpoint.
 *
 * The glow is kept low and tight. Orange over navy turns violet as it spreads,
 * which looks like a rendering fault rather than light.
 *
 * Contrast: white text over the lightest point of this ground is verified by
 * sampling rendered pixels, not by eye. Nothing here may be lightened without
 * re-running that check.
 *
 * Decorative, so it is hidden from assistive technology and from print.
 */
export default function HeroSunrise() {
  const CX = 200;
  const CY = 200;

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden print:hidden"
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(120% 90% at 88% 8%, #123a86 0%, #0a2668 34%, #001a52 68%, #001344 100%)',
      }}
    >
      {/* Warm light, held close to the sun so it never washes across the text. */}
      <div
        className="absolute right-[-14%] top-[-24%] h-[70%] w-[130%] sm:right-[-6%] sm:w-[70%]"
        style={{
          background:
            'radial-gradient(circle at 72% 34%, rgba(255,138,43,0.30) 0%, rgba(255,102,0,0.12) 38%, rgba(255,102,0,0) 68%)',
        }}
      />

      {/* The sun itself: the logo's eleven rays over a half-disc, whole and
          uncropped, tucked into the top-right corner.
          Hidden from `lg` up, where the "Was passiert" card moves into the
          right column and carries its own sunrise band. Two suns in one
          composition, one of them half-covered by the card, read as a mistake
          rather than a motif — so each breakpoint gets exactly one. */}
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
