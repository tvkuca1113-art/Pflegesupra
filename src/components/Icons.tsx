/**
 * Icon set — drawn, not imported, and never emoji.
 *
 * All icons share one grid (24px), one stroke weight (1.75) and round joins,
 * so they read as one family. Decorative by default (aria-hidden); pass a
 * `title` only when the icon is the sole label for a control.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Svg({ title, children, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.25em"
      height="1.25em"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const IconPhone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5.2 3.5h3.1l1.5 3.9-2 1.4a11.6 11.6 0 0 0 5.4 5.4l1.4-2 3.9 1.5v3.1a1.8 1.8 0 0 1-2 1.8A16.2 16.2 0 0 1 3.4 5.5a1.8 1.8 0 0 1 1.8-2Z" />
  </Svg>
);

export const IconMail = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.75" y="5" width="18.5" height="14" rx="1.5" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </Svg>
);

export const IconWhatsapp = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.4 20.6 4.7 16a8.2 8.2 0 1 1 3.3 3.2l-4.6 1.4Z" />
    <path d="M9 8.6c.3-.1.6 0 .8.4l.6 1.3a.7.7 0 0 1-.1.8l-.5.5a5.6 5.6 0 0 0 2.6 2.6l.5-.5a.7.7 0 0 1 .8-.1l1.3.6c.4.2.5.5.4.8a2 2 0 0 1-2.4 1.2 8.3 8.3 0 0 1-5.2-5.2A2 2 0 0 1 9 8.6Z" />
  </Svg>
);

export const IconPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21.2s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const IconClock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.75" />
    <path d="M12 7v5.3l3.2 2" />
  </Svg>
);

export const IconCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4.5 12.5 4.8 4.8L19.5 7" />
  </Svg>
);

export const IconAlert = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.75" />
    <path d="M12 7.4v5.2" />
    <circle cx="12" cy="16.3" r=".9" fill="currentColor" stroke="none" />
  </Svg>
);

export const IconArrow = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h15" />
    <path d="m13.2 5.7 6.3 6.3-6.3 6.3" />
  </Svg>
);

export const IconChevron = (p: IconProps) => (
  <Svg {...p}>
    <path d="m7.5 10 4.5 4.5L16.5 10" />
  </Svg>
);

export const IconMenu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const IconClose = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6.5 6.5 11 11M17.5 6.5l-11 11" />
  </Svg>
);

export const IconDocument = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 2.9h7.4L18.5 8v13.1H6z" />
    <path d="M13.2 3v5.2h5.2" />
    <path d="M9 13h6.5M9 16.5h4.5" />
  </Svg>
);

export const IconHome = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 10.5 12 4l8 6.5" />
    <path d="M6 9.7v10.5h12V9.7" />
    <path d="M10 20.2v-5.4h4v5.4" />
  </Svg>
);

export const IconHeart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20.2C6.8 16.6 3.8 13.6 3.8 10.2A4.2 4.2 0 0 1 12 8.3a4.2 4.2 0 0 1 8.2 1.9c0 3.4-3 6.4-8.2 10Z" />
  </Svg>
);

export const IconExternal = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4.5h5.5V10" />
    <path d="M19.5 4.5 11 13" />
    <path d="M18 14.5v4A1.5 1.5 0 0 1 16.5 20h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6h4" />
  </Svg>
);
