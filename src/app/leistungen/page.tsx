import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader, CtaBand, Breadcrumbs } from '@/components/Blocks';
import { IconArrow } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { payerGroups, servicesFor } from '@/content/services';

export const metadata: Metadata = pageMeta({
  title: 'Leistungen — ambulante Pflege zu Hause',
  description:
    'Grundpflege, Behandlungspflege, Betreuung, Hauswirtschaft und Verhinderungspflege '
    + 'in München und Pfaffenhofen a.d. Ilm. Wer zahlt was, und ab welchem Pflegegrad.',
  path: '/leistungen',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Leistungen', path: '/leistungen' },
];

export default function LeistungenPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Leistungen"
        title="Was wir zu Hause übernehmen"
        intro="Fünf Leistungen, zwei Kostenträger. Welcher greift, hängt nicht davon ab, wie aufwendig etwas ist, sondern wer es angeordnet hat — und das entscheidet, was Ihnen zusteht."
      />

      {/* No photograph on this page, deliberately. The approved set has one
          frame per service and this is the overview above them; a picture here
          would have to be one of those seven shown a second time, and repeating
          a frame is the exact thing that made the previous image set look like
          a single shoot. The five service pages each carry their own. */}

      {/* The page is organised by payer, because that is the distinction that
          actually changes what a visitor can have. The old version listed five
          near-identical cards and explained the distinction in four paragraphs
          at the bottom — where the people it matters most to, those without a
          Pflegegrad, had already stopped reading. */}
      <section className="section">
        <div className="shell space-y-16">
          {payerGroups.map((group) => (
            <section key={group.id} aria-labelledby={`payer-${group.id}`}>
              <div className="border-t-2 border-brand pt-6">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h2 id={`payer-${group.id}`} className="text-3xl">{group.label}</h2>
                  <span className="text-sm font-bold uppercase tracking-[0.09em] text-ink-accent">
                    {group.law}
                  </span>
                </div>
                <p className="mt-3 max-w-[56ch] text-lg text-ink">{group.condition}</p>
                <p className="mt-2 max-w-[62ch] text-ink-muted">{group.note}</p>
              </div>

              <ul className="m-0 mt-8 list-none border-t border-line p-0">
                {servicesFor(group).map((s) => (
                  <li key={s.slug} className="group relative border-b border-line">
                    <Link
                      href={`/leistungen/${s.slug}`}
                      className="grid items-baseline gap-x-8 gap-y-1.5 py-6 no-underline sm:grid-cols-[minmax(0,16rem)_minmax(0,1fr)_auto]"
                    >
                      <h3 className="text-xl text-brand-ink transition-colors group-hover:text-brand">
                        {s.name}
                      </h3>
                      <span className="block text-ink-muted">
                        {s.promise}
                        <span className="mt-1.5 block text-sm">{s.legalBasis}</span>
                      </span>
                      <IconArrow className="hidden flex-none self-center text-brand transition-transform group-hover:translate-x-1 sm:block" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell">
          <div className="max-w-[62ch]">
            <span className="horizont" aria-hidden="true" />
            <h2 className="text-3xl">Meistens ist es beides</h2>
            <p className="mt-4 text-lg text-ink-muted">
              Die meisten unserer Klientinnen und Klienten beziehen Leistungen aus beiden
              Systemen gleichzeitig. Sie müssen das nicht auseinanderhalten — wir stellen
              die Kombination zusammen, beantragen, was zu beantragen ist, und sagen Ihnen
              vorher, was dabei gegebenenfalls privat bliebe.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/pflegegrade-und-kosten" className="btn btn--primary">
                Was Ihr Pflegegrad abdeckt <IconArrow />
              </Link>
              <Link href="/ablauf" className="btn btn--secondary">
                So fängt es an <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Sie sind nicht sicher, welche Leistung Sie brauchen?"
        body="Das müssen Sie auch nicht sein. Sagen Sie uns, was im Alltag nicht mehr geht — die Zuordnung zu Paragrafen und Kostenträgern ist unsere Aufgabe, nicht Ihre."
      />
    </>
  );
}
