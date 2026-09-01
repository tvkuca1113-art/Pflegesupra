/**
 * The Horizont mark — the site's one piece of original artwork.
 *
 * Deliberately not a photograph. The client's current site uses AI-generated
 * images of people who do not exist (stated in their own Impressum), which on a
 * care provider's website undermines exactly the trust the site needs to build.
 * Until real photographs of the real team exist, this abstraction from the
 * logo's rising sun carries the brand instead — it cannot mislead anyone.
 *
 * Purely decorative, so it is hidden from assistive technology.
 */
export default function SunriseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 300"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fdf0e2" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="100%" r="72%">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="0.30" />
          <stop offset="55%" stopColor="#ff6600" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
        </radialGradient>
        <clipPath id="above">
          <rect x="0" y="0" width="480" height="212" />
        </clipPath>
      </defs>

      <rect width="480" height="300" fill="url(#sky)" />
      <g clipPath="url(#above)">
        <circle cx="240" cy="212" r="190" fill="url(#glow)" />
        {/* The sun's rays, taken from the logo's geometry: 11 rays over a
            half-disc, thickest at the crown. */}
        {Array.from({ length: 11 }, (_, i) => {
          const angle = (Math.PI / 10) * i;
          const x1 = 240 - Math.cos(angle) * 96;
          const y1 = 212 - Math.sin(angle) * 96;
          const x2 = 240 - Math.cos(angle) * (128 + (i % 2 ? 0 : 16));
          const y2 = 212 - Math.sin(angle) * (128 + (i % 2 ? 0 : 16));
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#ff6600"
              strokeWidth={i % 2 ? 5 : 7}
              strokeLinecap="round"
              opacity={0.9}
            />
          );
        })}
        <path
          d="M 158 212 A 82 82 0 0 1 322 212"
          fill="none"
          stroke="#ff6600"
          strokeWidth="13"
          strokeLinecap="round"
        />
      </g>
      {/* The horizon itself — the same 4px rule that marks every section. */}
      <rect x="0" y="208" width="480" height="8" fill="#003399" />
      <rect x="0" y="216" width="480" height="84" fill="#002270" />
    </svg>
  );
}
