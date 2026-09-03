import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader, CtaBand, Breadcrumbs, SectionHead, Callout } from '@/components/Blocks';
import { IconCheck, IconArrow } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { business } from '@/content/business';

export const metadata: Metadata = pageMeta({
  title: 'Ablauf — vom ersten Anruf bis zum ersten Einsatz',
  description:
    'Wie ambulante Pflege bei uns startet: Erstgespräch, Hausbesuch, Kostenklärung, '
    + 'Pflegevertrag und erster Einsatz. Was Sie vorbereiten sollten und was wir übernehmen.',
  path: '/ablauf',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Ablauf', path: '/ablauf' },
];

/**
 * Each phase carries a one-line `summary` as well as its full text.
 *
 * The summaries exist so the page can be understood in the twenty seconds a
 * worried reader actually gives it: they run as a compact strip above the
 * detail, and again as the lead line of each step. Somebody who reads only the
 * four short lines has the whole process; somebody who needs the detail scrolls
 * on. Neither is made to read the other's version.
 */
const phases = [
  {
    n: 1,
    t: 'Das erste Telefonat',
    when: 'Meist 10 bis 15 Minuten',
    summary: 'Sie schildern die Lage, wir sagen sofort, ob wir Ihre Adresse anfahren können.',
    body: [
      'Sie schildern die Situation, wir hören zu und stellen Rückfragen. Am Ende wissen Sie zwei Dinge: welche Leistungen für Ihren Fall infrage kommen, und ob wir Ihre Adresse in unsere Tourenplanung aufnehmen können.',
      'Wenn wir es nicht können, sagen wir das sofort. Sie sollen keine Woche warten, um dann eine Absage zu bekommen.',
    ],
    you: ['Namen und Adresse der pflegebedürftigen Person', 'Pflegegrad, falls vorhanden', 'Was im Alltag konkret nicht mehr geht'],
  },
  {
    n: 2,
    t: 'Der Hausbesuch',
    when: 'Kostenlos und unverbindlich',
    summary: 'Wir kommen zu Ihnen und sehen die Wohnung, den Tag und die Menschen, die schon helfen.',
    body: [
      'Wir kommen zu Ihnen. Nicht, um einen Vertrag mitzubringen, sondern um zu sehen, worüber wir sprechen: die Wohnung, die Treppe, das Bad, die Tagesstruktur und die Menschen, die schon jetzt helfen.',
      'Daraus entsteht der Vorschlag, welche Einsätze zu welchen Zeiten sinnvoll sind — und was Sie und Ihre Angehörigen weiterhin selbst machen wollen.',
    ],
    you: ['Pflegegradbescheid, falls vorhanden', 'Aktuelle Medikamentenliste', 'Ärztliche Verordnungen', 'Angehörige, die mitentscheiden'],
  },
  {
    n: 3,
    t: 'Kosten und Kassenklärung',
    when: 'Bevor irgendetwas unterschrieben wird',
    summary: 'Sie bekommen schriftlich, was die Kassen tragen und was gegebenenfalls privat bliebe.',
    body: [
      'Wir rechnen durch, was Ihr Pflegegrad abdeckt, welche Leistungen über die Krankenkasse laufen und ob am Monatsende ein Eigenanteil bliebe. Sie bekommen das schriftlich, bevor Sie sich entscheiden.',
      'Fehlt eine ärztliche Verordnung, sagen wir Ihnen, was darauf stehen muss, damit die Krankenkasse sie genehmigt. Das erspart in der Praxis die häufigste Verzögerung.',
    ],
    you: ['Name Ihrer Pflege- und Krankenkasse', 'Versichertennummer'],
  },
  {
    n: 4,
    t: 'Pflegevertrag und Start',
    when: 'Startdatum stimmen wir gemeinsam ab',
    summary: 'Der Vertrag hält Leistungen, Zeiten und Kosten fest — danach beginnt die Versorgung.',
    body: [
      'Der Pflegevertrag hält fest, welche Leistungen zu welchen Zeiten erbracht werden und was sie kosten. Erst danach beginnt die Versorgung.',
      'Vor dem ersten Einsatz kennt die Pflegekraft Ihre Situation aus der Pflegeplanung. Sie stehen niemandem gegenüber, dem Sie alles noch einmal erklären müssen.',
    ],
    you: ['Ein Türschlüssel oder eine Schlüsselregelung, wenn niemand öffnen kann'],
  },
];

export default function AblaufPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Ablauf"
        title="Vom ersten Anruf bis zum ersten Einsatz"
        intro="Die meisten Familien rufen an, wenn die Situation schon eskaliert ist — nach einem Sturz, einer Entlassung, einer Diagnose. Deshalb steht hier genau, was passiert und wann."
      />

      {/* The twenty-second version. Four lines, no detail, and it repeats
          nothing the detail below has to say differently — the summaries are
          the same sentences that lead each step. */}
      <section className="section--tight pt-12">
        <div className="shell">
          <ol className="m-0 grid list-none gap-x-8 gap-y-5 p-0 border-t-2 border-line-strong pt-7 sm:grid-cols-2 lg:grid-cols-4">
            {phases.map((p) => (
              <li key={p.n}>
                <span className="figure-xl block text-2xl text-brand">
                  {String(p.n).padStart(2, '0')}
                </span>
                <h2 className="mt-2 text-lg">{p.t}</h2>
                <p className="mt-1.5 text-sm text-ink-muted">{p.summary}</p>
              </li>
            ))}
          </ol>
          <p className="mt-7 text-sm text-ink-muted">
            Unten steht dasselbe ausführlich — mit dem, was Sie jeweils bereithalten sollten.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <ol className="timeline space-y-14">
            {phases.map((p) => (
              <li key={p.n}>
                <span className="timeline__marker" aria-hidden="true">
                  {String(p.n).padStart(2, '0')}
                </span>
                <div className="grid gap-x-10 gap-y-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]">
                  <div>
                    <h2 className="text-2xl">
                      <span className="sr-only">Schritt {p.n}: </span>
                      {p.t}
                    </h2>
                    <p className="mt-1.5 text-sm font-bold uppercase tracking-[0.07em] text-ink-accent">
                      {p.when}
                    </p>
                    <div className="prose mt-4 text-ink-muted">
                      {p.body.map((b) => <p key={b}>{b}</p>)}
                    </div>
                  </div>
                  <Callout label="Was Sie bereithalten sollten">
                    <ul className="checklist">
                      {p.you.map((y) => <li key={y}>{y}</li>)}
                    </ul>
                  </Callout>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Two arguments that belong at the end of the process, not inside it:
          what to do when there is no time for four steps, and what you are
          still free to do after step four. */}
      <section className="section section--paper">
        <div className="shell grid gap-x-14 gap-y-12 lg:grid-cols-2">
          <div>
            <SectionHead title="Wenn es schnell gehen muss" />
            <div className="prose text-ink-muted">
              <p>
                Nach einer Krankenhausentlassung ist oft keine Zeit für vier ruhige Schritte.
                Sagen Sie das gleich im ersten Anruf — dann ziehen wir den Hausbesuch vor und
                klären die Kassenfragen parallel statt vorher.
              </p>
              <p>
                Das Krankenhaus hat außerdem einen eigenen Sozialdienst, der das
                Entlassmanagement übernimmt und Verordnungen ausstellen kann. Ihn
                einzuschalten ist fast immer der schnellste Weg, und wir arbeiten mit ihm
                zusammen.
              </p>
            </div>
            <a href={business.phone.href} className="btn btn--primary mt-7">
              {business.phone.display}
            </a>
          </div>

          <div>
            <SectionHead title="Sie müssen sich nicht sofort entscheiden" />
            <ul className="m-0 list-none space-y-4 p-0">
              {[
                'Erstgespräch und Hausbesuch sind kostenlos und verpflichten zu nichts.',
                'Sie bekommen die Kostenaufstellung schriftlich, bevor Sie unterschreiben.',
                'Ein Pflegevertrag ist kündbar — Sie binden sich nicht auf Jahre.',
                'Passt ein anderer Dienst oder eine andere Versorgungsform besser, sagen wir Ihnen das.',
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-lg">
                  <IconCheck className="mt-1 flex-none text-brand" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Callout label="Unabhängige Beratung">
                <p className="m-0">
                  Kostenlose Beratung, die nichts mit uns zu tun hat, bekommen Sie bei der{' '}
                  <Link href="/einsatzgebiet/muenchen" className="linkish">Stadt München</Link>{' '}
                  beziehungsweise beim{' '}
                  <Link href="/einsatzgebiet/pfaffenhofen-an-der-ilm" className="linkish">
                    Pflegestützpunkt Pfaffenhofen
                  </Link>. Wir empfehlen sie ausdrücklich.
                </p>
              </Callout>
            </div>
            <Link href="/pflegegrade-und-kosten" className="btn btn--secondary mt-7">
              Was die Kasse trägt <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      <CtaBand
        title="Fangen wir mit dem Telefonat an."
        body={`Zehn Minuten, in denen Sie erfahren, was möglich ist. Büro ${business.officeHours.days}, ${business.officeHours.from}–${business.officeHours.to} Uhr.`}
      />
    </>
  );
}
