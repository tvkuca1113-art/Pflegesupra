/**
 * The Horizont band — the site's one piece of original artwork.
 *
 * Deliberately not a photograph. The client's current site uses AI-generated
 * images of people who do not exist (stated in their own Impressum), which on a
 * care provider's website undermines exactly the trust the site needs to build.
 * Until real photographs of the real team exist, this abstraction of the logo's
 * rising sun carries the brand instead — it cannot mislead anyone.
 *
 * Drawn as a wide, shallow band so it works as a card header rather than as a
 * picture floating in a column: the geometry (an 11-ray half-disc over a flat
 * horizon) is lifted directly from the logo.
 *
 * Purely decorative, so it is hidden from assistive technology.
 */
export default function SunriseMark({ className }: { className?: string }) {
  const CX = 240;
  const HORIZON = 80;

  return (
    <svg
      viewBox="0 0 480 88"
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <defs>
        <linearGradient id="sunrise-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fdeede" />
        </linearGradient>
        <radialGradient id="sunrise-glow" cx="50%" cy="100%" r="70%">
          <stop offset="0%" stopColor="#ff6600" stopOpacity="0.26" />
          <stop offset="60%" stopColor="#ff6600" stopOpacity="0.07" />
          <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
        </radialGradient>
        <clipPath id="sunrise-above">
          <rect x="0" y="0" width="480" height={HORIZON} />
        </clipPath>
      </defs>

      <rect width="480" height="88" fill="url(#sunrise-sky)" />
      <g clipPath="url(#sunrise-above)">
        <ellipse cx={CX} cy={HORIZON} rx="230" ry="80" fill="url(#sunrise-glow)" />
        {Array.from({ length: 11 }, (_, i) => {
          const angle = (Math.PI / 10) * i;
          const inner = 40;
          const outer = 55 + (i % 2 ? 0 : 8);
          return (
            <line
              key={i}
              x1={CX - Math.cos(angle) * inner}
              y1={HORIZON - Math.sin(angle) * inner}
              x2={CX - Math.cos(angle) * outer}
              y2={HORIZON - Math.sin(angle) * outer}
              stroke="#ff6600"
              strokeWidth={i % 2 ? 3 : 4.5}
              strokeLinecap="round"
            />
          );
        })}
        <path
          d={`M ${CX - 33} ${HORIZON} A 33 33 0 0 1 ${CX + 33} ${HORIZON}`}
          fill="none"
          stroke="#ff6600"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </g>
      {/* The horizon itself — the same flat rule that marks every section. */}
      <rect x="0" y={HORIZON} width="480" height="8" fill="#003399" />
    </svg>
  );
}
