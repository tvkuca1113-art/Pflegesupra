import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader, CtaBand, Breadcrumbs, SectionHead } from '@/components/Blocks';
import { IconPin } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { business } from '@/content/business';

export const metadata: Metadata = pageMeta({
  title: 'Über uns — wie wir Touren und Personal planen',
  description:
    'Seit 2022 eigenständiger ambulanter Pflegedienst in München und Pfaffenhofen a.d. Ilm: '
    + 'wie Einsatzzeiten entstehen, wie Personal ausgewählt wird und wo unsere Standorte sind.',
  path: '/ueber-uns',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Über uns', path: '/ueber-uns' },
];

const principles = [
  {
    t: 'Zeiten nach Erfahrung, nicht nach Liste',
    b: 'Viele Dienste planen nach einer Tabelle: welche Tätigkeit bringt in welcher Zeit wie viel Geld. Wir planen nach dem, was eine Aufgabe bei diesem Menschen in dieser Wohnung tatsächlich braucht. Deshalb bleibt Platz für einen individuellen Wunsch — und deshalb lehnen wir eine Tour lieber ab, als sie nur auf dem Papier zu schaffen.',
  },
  {
    t: 'Ressourcen fördern statt übernehmen',
    b: 'Alles selbst zu machen geht schneller. Es kostet den Menschen aber genau die Selbständigkeit, die er noch hat. Wir prüfen, was jemand noch kann, und unterstützen so, dass es erhalten bleibt — auch wenn das im Einsatz länger dauert.',
  },
  {
    t: 'Personalauswahl nach Haltung, nicht nur nach Zeugnis',
    b: 'Fachliche Qualifikation ist die Voraussetzung, nicht das Kriterium. Wir suchen Menschen mit Verständnis, Geduld und der Bereitschaft, in eine fremde Wohnung zu gehen und sich dort wie ein Gast zu benehmen. Das kostet Zeit bei der Einstellung und zahlt sich in jeder einzelnen Versorgung aus.',
  },
  {
    t: 'Ein Team aus zwei Generationen',
    b: 'Frisch ausgelernte Pflegekräfte bringen den aktuellen Stand der Ausbildung mit, erfahrene Kolleginnen und Kollegen bringen das Urteilsvermögen mit, das keine Fortbildung ersetzt. Die Mischung ist Absicht.',
  },
];

/**
 * Three things this site does not claim.
 *
 * Kept, but cut back hard and moved out of its own headline section. The
 * previous version gave a full band, a heading about transparency and three
 * cards to the subject of its own honesty — which is itself a marketing move,
 * and the fourth time the word appeared on the page. Naming the three specific
 * claims is useful; framing them as a virtue is not. They now sit as a short
 * list under the principles they qualify.
 */
const notClaimed = [
  {
    t: 'Keine Zusage auf dieselbe Person',
    b: 'Urlaub, Krankheit und Schichtwechsel gibt es bei jedem Dienst. Wir planen auf wenige Gesichter hin, versprechen aber keins.',
  },
  {
    t: 'Keine Reaktionszeit in Stunden',
    b: 'Ob wir kurzfristig übernehmen können, hängt an der Tour und der Auslastung. Das erfahren Sie im Gespräch.',
  },
  {
    t: 'Keine Kundenstimmen auf dieser Seite',
    b: 'Was Menschen über uns sagen, sollen sie dort sagen, wo wir es nicht redigieren können.',
  },
];

export default function UeberUnsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow={`Eigenständig seit ${business.founded}`}
        title="Warum dieser Dienst so arbeitet, wie er arbeitet"
        intro={`${business.legalName} wurde ${business.founded} von ${business.owner} gegründet — aus Erfahrung in Klinik, spezialisierten Einrichtungen und ambulanter Pflege, und aus dem Unbehagen darüber, wie Pflege unter Zeitdruck aussieht.`}
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <SectionHead title="„Supra“ heißt „darüber“" />
            <div className="prose text-ink-muted">
              <p>
                Der Name kommt aus dem Lateinischen und bedeutet <em>über</em>. Er beschreibt
                das Ziel dieses Dienstes: das Wohlbefinden über die Probleme zu heben, so weit
                das im Einzelfall möglich ist.
              </p>
              <p>
                Das ist keine Metapher für Wunderheilung. Es ist die Entscheidung, in einer
                Versorgung nicht nur die Aufgaben abzuarbeiten, die abgerechnet werden können,
                sondern auch die Minuten einzuplanen, in denen ein Mensch etwas erzählen darf.
              </p>
            </div>
          </div>

          <div>
            <SectionHead title="Vier Grundsätze" />
            <dl className="m-0 space-y-8">
              {principles.map((p) => (
                <div key={p.t} className="border-t border-line pt-5 first:border-t-0 first:pt-0">
                  <dt className="text-xl font-bold text-brand-ink">{p.t}</dt>
                  <dd className="m-0 mt-2 text-ink-muted">{p.b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* No photograph on this page. The approved set is seven frames, each
          tied to a specific service or to the recruiting page, and none of them
          is about who runs this business — which is what this section is for.
          Repeating one of the seven here to fill the space would undo the point
          of the new set. This is the slot for a real photograph of the owner
          and the team, and until that exists the section runs on its argument,
          which is the stronger half of it anyway. */}
      <section className="section section--paper">
        <div className="shell max-w-[54rem]">
          <SectionHead title="Drei Dinge, die hier nicht stehen" />
          <dl className="m-0">
            {notClaimed.map((n) => (
              <div key={n.t} className="border-t border-line py-5 first:border-t-0 first:pt-0">
                <dt className="font-bold text-brand-ink">{n.t}</dt>
                <dd className="m-0 mt-1.5 text-ink-muted">{n.b}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead title="Wo Sie uns finden" />
          <ul className="m-0 grid list-none gap-8 p-0 sm:grid-cols-2">
            {business.locations.map((l) => (
              <li key={l.id} className="border-t-4 border-brand pt-4">
                <h3 className="flex items-center gap-2 text-xl">
                  <IconPin className="text-brand" />
                  {l.role} {l.city}
                </h3>
                <address className="mt-2 not-italic text-ink-muted">
                  {l.street}
                  <br />
                  {l.postalCode} {l.city}
                  {l.district ? <><br />Stadtbezirk {l.district}</> : null}
                </address>
                <Link href={`/einsatzgebiet/${l.slug}`} className="linkish mt-3 inline-block py-1 font-bold">
                  Pflege in {l.city}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
