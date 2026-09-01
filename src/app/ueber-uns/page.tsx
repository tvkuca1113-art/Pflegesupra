import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader, CtaBand, Breadcrumbs, SectionHead } from '@/components/Blocks';
import { IconPin } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { business } from '@/content/business';

export const metadata: Metadata = pageMeta({
  title: 'Über uns — Supra ambulanter Pflegedienst',
  description:
    'Seit 2022 eigenständiger ambulanter Pflegedienst in München und Pfaffenhofen a.d. Ilm. '
    + 'Wie wir Touren planen, wie wir Personal auswählen und was wir bewusst nicht tun.',
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

const honesty = [
  'Wir garantieren nicht, dass immer dieselbe Person kommt. Urlaub, Krankheit und Schichtwechsel gibt es bei jedem Dienst — wer etwas anderes verspricht, hält es nicht.',
  'Wir nennen keine Reaktionszeit in Stunden. Ob wir kurzfristig übernehmen können, hängt von der Tour und der Auslastung ab, und das erfahren Sie im Gespräch, nicht aus einem Werbeversprechen.',
  'Wir zeigen keine Kundenstimmen und keine Sternebewertungen auf dieser Seite. Was Menschen über uns sagen, sollen sie dort sagen, wo wir es nicht redigieren können.',
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
            <div className="prose text-[var(--color-ink-muted)]">
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
                <div key={p.t} className="border-t-4 border-[var(--color-sun)] pt-4">
                  <dt className="text-[var(--text-xl)] font-bold text-[var(--color-brand-ink)]">{p.t}</dt>
                  <dd className="m-0 mt-2 text-[var(--color-ink-muted)]">{p.b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Saying what you will not claim is itself a trust signal — and it keeps
          the site honest as it grows. */}
      <section className="section section--paper">
        <div className="shell">
          <SectionHead
            eyebrow="Transparenz"
            title="Was Sie auf dieser Seite bewusst nicht finden"
            intro="Weil wir es nicht belegen können — und weil eine Pflegeseite der letzte Ort ist, an dem geraten werden sollte."
          />
          <ul className="m-0 grid list-none gap-6 p-0 lg:grid-cols-3">
            {honesty.map((h) => (
              <li key={h} className="border-l-4 border-[var(--color-line-strong)] bg-white p-5 text-[var(--color-ink-muted)]">
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHead title="Wo Sie uns finden" />
          <ul className="m-0 grid list-none gap-8 p-0 sm:grid-cols-2">
            {business.locations.map((l) => (
              <li key={l.id} className="border-t-4 border-[var(--color-brand)] pt-4">
                <h3 className="flex items-center gap-2 text-[var(--text-xl)]">
                  <IconPin className="text-[var(--color-brand)]" />
                  {l.role} {l.city}
                </h3>
                <address className="mt-2 not-italic text-[var(--color-ink-muted)]">
                  {l.street}
                  <br />
                  {l.postalCode} {l.city}
                  {l.district ? <><br />Stadtbezirk {l.district}</> : null}
                </address>
                <Link href={`/einsatzgebiet/${l.slug}`} className="linkish mt-3 inline-block font-bold">
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
