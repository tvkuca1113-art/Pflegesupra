import type { Metadata } from 'next';
import { PageHeader, CtaBand, LinkCard, Breadcrumbs } from '@/components/Blocks';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { services } from '@/content/services';

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
        intro="Ambulante Pflege ist kein Paket, sondern eine Kombination aus Leistungen mit
        unterschiedlichen Kostenträgern und Voraussetzungen. Deshalb steht bei jeder hier,
        wer sie bezahlt und ab welchem Pflegegrad sie möglich ist."
      />

      <section className="section" aria-labelledby="leistungen-uebersicht">
        <div className="shell">
          <h2 id="leistungen-uebersicht" className="sr-only">Übersicht unserer Leistungen</h2>
          <ul className="m-0 grid list-none gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <LinkCard
                key={s.slug}
                href={`/leistungen/${s.slug}`}
                title={s.name}
                body={s.promise}
                meta={`${s.payer} · ${s.legalBasis}`}
              />
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell">
          <div className="prose">
            <h2 className="text-3xl">Zwei Kostenträger, nicht einer</h2>
            <p>
              Der häufigste Irrtum in der ambulanten Pflege ist die Annahme, dass alles aus
              einem Topf bezahlt wird. Tatsächlich gibt es zwei getrennte Systeme, und
              welches greift, hängt nicht davon ab, wie aufwendig etwas ist, sondern wer es
              angeordnet hat.
            </p>
            <h3>Die Pflegekasse zahlt nach SGB XI</h3>
            <p>
              Körperbezogene Pflege, Betreuung und hauswirtschaftliche Leistungen laufen über
              die Pflegekasse. Voraussetzung ist ein Pflegegrad, und die Höhe des Budgets
              hängt von diesem Pflegegrad ab.
            </p>
            <h3>Die Krankenkasse zahlt nach SGB V</h3>
            <p>
              Alles, was ärztlich verordnet ist — Medikamentengabe, Injektionen,
              Verbandwechsel — läuft über die Krankenkasse und ist{' '}
              <strong>unabhängig vom Pflegegrad</strong>. Wer keinen Pflegegrad hat, kann
              Behandlungspflege trotzdem bekommen.
            </p>
            <p>
              In der Praxis kombinieren die meisten unserer Klientinnen und Klienten beides.
              Wir stellen das für Sie zusammen und sagen Ihnen vorher, was dabei
              gegebenenfalls privat bliebe.
            </p>
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
