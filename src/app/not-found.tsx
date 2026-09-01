import Link from 'next/link';
import type { Metadata } from 'next';
import { IconArrow, IconPhone } from '@/components/Icons';
import { business } from '@/content/business';
import { primaryNav } from '@/content/nav';

export const metadata: Metadata = {
  title: 'Seite nicht gefunden',
  robots: { index: false, follow: true },
};

/**
 * 404. Never a dead end: someone who landed here from an old bookmark or a
 * search result should still be one click from what they wanted, and one tap
 * from the phone number.
 */
export default function NotFound() {
  return (
    <section className="section">
      <div className="shell">
        <p className="eyebrow">Fehler 404</p>
        <span className="horizont" aria-hidden="true" />
        <h1 className="text-4xl">Diese Seite gibt es nicht (mehr).</h1>
        <p className="measure mt-5 text-lg text-ink-muted">
          Möglicherweise stammt der Link aus einer älteren Fassung unserer Website. Hier
          kommen Sie weiter — oder rufen Sie einfach an, das ist ohnehin der kürzeste Weg.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={business.phone.href} className="btn btn--primary">
            <IconPhone />
            {business.phone.display}
          </a>
          <Link href="/" className="btn btn--secondary">
            Zur Startseite <IconArrow />
          </Link>
        </div>

        <nav aria-label="Alle Seiten" className="mt-12">
          <h2 className="text-xl">Alle Bereiche</h2>
          <span className="horizont mt-3" aria-hidden="true" />
          <ul className="m-0 grid list-none gap-x-8 gap-y-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {[...primaryNav, { href: '/kontakt', label: 'Kontakt', hint: 'Beratung anfragen' }].map((i) => (
              <li key={i.href} className="border-t-4 border-line pt-3">
                <Link href={i.href} className="inline-block py-1 font-bold text-brand no-underline">
                  {i.label}
                </Link>
                {i.hint ? (
                  <p className="mt-1 text-sm text-ink-muted">{i.hint}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
