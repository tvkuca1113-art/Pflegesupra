import { Suspense } from 'react';
import type { Metadata } from 'next';
import InquiryForm from '@/components/InquiryForm';
import { PageHeader, Breadcrumbs, SectionHead } from '@/components/Blocks';
import { IconPin, IconClock } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { business } from '@/content/business';
import ContactLinks from '@/components/ContactLinks';

export const metadata: Metadata = pageMeta({
  title: 'Kontakt — Beratung anfragen',
  description:
    'Kostenlose Beratung zur ambulanten Pflege in München und Pfaffenhofen a.d. Ilm. '
    + 'Telefon 089 189 39 716, WhatsApp oder Formular. Ein Erstgespräch kostet Sie nichts.',
  path: '/kontakt',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Kontakt', path: '/kontakt' },
];

export default function KontaktPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Kontakt"
        title="Sagen Sie uns, worum es geht"
        intro="Ein Erstgespräch kostet nichts und verpflichtet zu nichts. Wenn wir nicht helfen können, sagen wir Ihnen, wer es kann."
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div>
            <SectionHead
              title="Anfrage senden"
              intro="Zwei Pflichtangaben, damit wir antworten können. Alles Weitere klären wir im Gespräch."
            />
            {/* useSearchParams needs a boundary so the rest of the page can
                still be prerendered as static HTML.

                The fallback reserves the form's height rather than being a
                single line of text. On a phone the layout is one column, so the
                "Rufen Sie einfach an" panel sits underneath: a one-line
                placeholder swapping for a 1237px form shoved that panel down
                the page, which is what CLS measures. Measured heights are
                1237px at 390px wide and 933px from the tablet breakpoint up.
                Reserving them costs nothing — the space is about to be filled
                by the form anyway — and takes /kontakt to zero shift. */}
            <Suspense
              fallback={(
                <div className="min-h-[1237px] sm:min-h-[933px]" aria-hidden="true">
                  <p className="text-ink-muted">Formular wird geladen …</p>
                </div>
              )}
            >
              <InquiryForm kind="beratung" />
            </Suspense>
          </div>

          <aside className="self-start">
            <div className="rounded-lg border-2 border-brand p-6">
              <p className="eyebrow">Schneller als jedes Formular</p>
              <span className="horizont" aria-hidden="true" />
              <h2 className="text-2xl">Rufen Sie einfach an</h2>
              <p className="mt-2 text-ink-muted">
                Bei einer Entlassung aus dem Krankenhaus oder einer akuten Verschlechterung
                ist das Telefon immer der richtige Weg.
              </p>
              <ContactLinks />
              <p className="mt-5 flex items-start gap-2.5 text-ink-muted">
                <IconClock className="mt-1 flex-none" />
                <span>
                  Büro {business.officeHours.days}, {business.officeHours.from}–{business.officeHours.to} Uhr.
                  Pflegeeinsätze finden auch außerhalb dieser Zeiten statt.
                </span>
              </p>
            </div>

            <div className="mt-6 rounded-lg bg-paper p-6">
              <h2 className="text-xl">Standorte</h2>
              <span className="horizont mt-3" aria-hidden="true" />
              <ul className="m-0 list-none space-y-5 p-0">
                {business.locations.map((l) => (
                  <li key={l.id} className="flex items-start gap-2.5">
                    <IconPin className="mt-1 flex-none text-brand" />
                    <span>
                      <span className="block font-bold text-brand-ink">
                        {l.role} {l.city}
                      </span>
                      <address className="not-italic text-ink-muted">
                        {l.street}
                        <br />
                        {l.postalCode} {l.city}
                      </address>
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-ink-muted">
                Die Büros sind Verwaltungsstandorte. Beratungsgespräche führen wir bei Ihnen
                zu Hause — dort, wo die Pflege später stattfindet.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
