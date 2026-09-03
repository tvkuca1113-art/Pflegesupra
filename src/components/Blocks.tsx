import Link from 'next/link';
import { business } from '@/content/business';
import { IconPhone, IconArrow, IconChevron } from './Icons';
import Photo from './Photo';
import { PHOTO_CREDIT } from '@/content/photos';

/** Page header. One H1 per page, always — the old site shipped two. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="section--tight border-b border-line bg-paper pt-8">
      <div className="shell">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <span className="horizont" aria-hidden="true" />
        <h1 className="max-w-[18ch] text-4xl sm:text-5xl">{title}</h1>
        {/* 62ch, not the 66ch used for body copy. An intro is read once, at
            speed, and a shorter line is what makes that possible. */}
        {intro ? (
          <p className="mt-5 max-w-[58ch] text-lg text-ink-muted sm:text-xl">{intro}</p>
        ) : null}
        {children}
      </div>
    </div>
  );
}

/**
 * A photograph with its caption, framed the way every photograph on this site
 * is framed. Exists so no page has to remember the frame classes or to credit
 * the series — forgetting either is how a set stops looking like a set.
 */
export function EditorialImage({
  name, widths, ratio, sizes, alt, plate = false, caption, className = '',
}: {
  name: string;
  widths: number[];
  ratio: number;
  sizes: string;
  alt: string;
  plate?: boolean;
  /** Overrides the standard symbolic-image note. Rarely needed. */
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={`figure m-0 ${className}`}>
      <div className={`frame ${plate ? 'frame--plate' : ''}`}>
        <Photo name={name} widths={widths} ratio={ratio} sizes={sizes} alt={alt} />
      </div>
      <figcaption>{caption ?? PHOTO_CREDIT.caption}</figcaption>
    </figure>
  );
}

/** A note beside the argument. `label` is what it is; children are the note. */
export function Callout({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="callout">
      <span className="callout__label">{label}</span>
      {children}
    </div>
  );
}

export function Breadcrumbs({ trail }: { trail: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Brotkrumennavigation" className="shell pt-5">
      <ol className="m-0 flex list-none flex-wrap items-center gap-1 p-0 text-sm">
        {trail.map((t, i) => (
          <li key={t.path} className="flex items-center gap-1">
            {i > 0 ? <IconChevron className="-rotate-90 text-line-strong" aria-hidden="true" /> : null}
            {i === trail.length - 1 ? (
              <span aria-current="page" className="text-ink-muted">{t.name}</span>
            ) : (
              <Link href={t.path} className="linkish">{t.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Section heading with the Horizont motif. Used everywhere, so hierarchy is consistent. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  as: As = 'h2',
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  as?: 'h2' | 'h3';
}) {
  return (
    <div className="mb-8">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <span className="horizont" aria-hidden="true" />
      <As className="max-w-[24ch] text-3xl">{title}</As>
      {intro ? <p className="mt-4 max-w-[56ch] text-lg text-ink-muted">{intro}</p> : null}
    </div>
  );
}

/** Closing call to action. One per page, never two competing ones. */
export function CtaBand({
  title = 'Sie wissen nicht, wo Sie anfangen sollen?',
  body = 'Rufen Sie an. Wir hören zu, ordnen die Situation ein und sagen Ihnen, ob wir helfen können — auch dann, wenn die Antwort nein lautet.',
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="on-dark bg-brand-deep py-14 text-white">
      <div className="shell grid items-center gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div>
          <span className="horizont" aria-hidden="true" />
          <h2 className="max-w-[24ch] text-3xl text-white">{title}</h2>
          <p className="measure mt-4 text-lg text-white/85">{body}</p>
        </div>
        <div className="flex flex-col gap-3">
          <a href={business.phone.href} className="btn btn--onDark text-lg">
            <IconPhone />
            {business.phone.display}
          </a>
          <Link href="/kontakt" className="btn btn--ghostDark">
            Rückruf anfordern <IconArrow />
          </Link>
          <p className="m-0 text-sm text-white/70">
            Büro {business.officeHours.days}, {business.officeHours.from}–{business.officeHours.to} Uhr
          </p>
        </div>
      </div>
    </section>
  );
}

/** Card link used for service and topic grids. */
export function LinkCard({
  href,
  title,
  body,
  meta,
}: {
  href: string;
  title: string;
  body: string;
  meta?: string;
}) {
  return (
    // No fill and no shadow: on warm paper a white box reads as a card that
    // has floated loose, and the anti-template rule this system is built on is
    // that a card must mean "this lifts off the page". These do not lift; they
    // are entries in a list, separated by a rule.
    <li className="group relative flex flex-col border-t-2 border-line-strong pt-4 transition-colors hover:border-sun">
      <h3 className="text-xl">
        <Link href={href} className="no-underline after:absolute after:inset-0 after:content-['']">
          {title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-ink-muted">{body}</p>
      {meta ? <p className="mt-3 text-sm text-ink-muted">{meta}</p> : null}
      <p className="mt-4 flex items-center gap-2 font-bold text-brand">
        Mehr erfahren
        <IconArrow className="transition-transform group-hover:translate-x-1" />
      </p>
    </li>
  );
}

/** Source citation. Every statutory figure on this site carries one. */
export function Source({ label, url }: { label: string; url: string }) {
  return (
    <p className="mt-6 text-sm text-ink-muted">
      Quelle:{' '}
      <a href={url} className="linkish" rel="noopener noreferrer" target="_blank">
        {label}
        <span className="sr-only"> (öffnet in neuem Tab)</span>
      </a>
    </p>
  );
}
