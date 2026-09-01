import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader, CtaBand, Breadcrumbs, SectionHead } from '@/components/Blocks';
import { IconCheck, IconDocument, IconAlert } from '@/components/Icons';
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

const phases = [
  {
    n: 1,
    t: 'Das erste Telefonat',
    when: 'Dauert meist 10 bis 15 Minuten',
    body: [
      'Sie schildern die Situation, wir hören zu und stellen Rückfragen. Am Ende dieses Gesprächs wissen Sie zwei Dinge: welche Leistungen für Ihren Fall überhaupt infrage kommen, und ob wir Ihre Adresse in unsere Tourenplanung aufnehmen können.',
      'Wenn wir es nicht können, sagen wir das sofort. Sie sollen keine Woche warten, um dann eine Absage zu bekommen.',
    ],
    you: ['Namen und Adresse der pflegebedürftigen Person', 'Pflegegrad, falls vorhanden', 'Was im Alltag konkret nicht mehr geht'],
  },
  {
    n: 2,
    t: 'Der Hausbesuch',
    when: 'Kostenlos und unverbindlich',
    body: [
      'Wir kommen zu Ihnen. Nicht, um einen Vertrag mitzubringen, sondern um zu sehen, worüber wir sprechen: die Wohnung, die Treppe, das Bad, die Tagesstruktur und die Menschen, die schon jetzt helfen.',
      'Aus diesem Besuch entsteht der Vorschlag, welche Einsätze zu welchen Zeiten sinnvoll sind — und was Sie und Ihre Angehörigen weiterhin selbst machen wollen.',
    ],
    you: ['Pflegegradbescheid, falls vorhanden', 'Aktuelle Medikamentenliste', 'Ärztliche Verordnungen', 'Angehörige, die mitentscheiden'],
  },
  {
    n: 3,
    t: 'Kosten und Kassenklärung',
    when: 'Bevor irgendetwas unterschrieben wird',
    body: [
      'Wir rechnen durch, was Ihr Pflegegrad abdeckt, welche Leistungen über die Krankenkasse laufen und ob am Monatsende ein Eigenanteil bliebe. Sie bekommen das schriftlich, bevor Sie sich entscheiden.',
      'Wenn eine ärztliche Verordnung fehlt, sagen wir Ihnen, was darauf stehen muss, damit die Krankenkasse sie genehmigt. Das erspart in der Praxis die häufigste Verzögerung.',
    ],
    you: ['Name Ihrer Pflege- und Krankenkasse', 'Versichertennummer'],
  },
  {
    n: 4,
    t: 'Pflegevertrag und Start',
    when: 'Start meist innerhalb weniger Tage',
    body: [
      'Der Pflegevertrag hält fest, welche Leistungen zu welchen Zeiten erbracht werden und was sie kosten. Erst danach beginnt die Versorgung.',
      'Vor dem ersten Einsatz kennt die Pflegekraft, die zu Ihnen kommt, Ihre Situation aus der Pflegeplanung. Sie stehen niemandem gegenüber, dem Sie alles noch einmal erklären müssen.',
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

      <section className="section">
        <div className="shell">
          <ol className="m-0 list-none space-y-14 p-0">
            {phases.map((p) => (
              <li key={p.n} className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <div>
                  <p className="m-0 text-4xl font-bold leading-none tabular-nums text-sun">
                    {String(p.n).padStart(2, '0')}
                  </p>
                  <h2 className="mt-2 text-2xl">{p.t}</h2>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.07em] text-ink-accent">
                    {p.when}
                  </p>
                  <div className="prose mt-4 text-ink-muted">
                    {p.body.map((b) => <p key={b}>{b}</p>)}
                  </div>
                </div>
                <div className="self-start rounded-md border-l-4 border-brand bg-paper p-5">
                  <h3 className="flex items-center gap-2 text-lg">
                    <IconDocument className="text-brand" />
                    Was Sie bereithalten sollten
                  </h3>
                  <ul className="checklist mt-3">
                    {p.you.map((y) => <li key={y}>{y}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell grid gap-10 lg:grid-cols-2">
          <div className="prose">
            <SectionHead title="Wenn es schnell gehen muss" />
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
          <div>
            <SectionHead title="Sie müssen sich nicht sofort entscheiden" />
            <ul className="m-0 list-none space-y-4 p-0">
              {[
                'Erstgespräch und Hausbesuch sind kostenlos und verpflichten zu nichts.',
                'Sie bekommen die Kostenaufstellung schriftlich, bevor Sie unterschreiben.',
                'Ein Pflegevertrag ist kündbar — Sie binden sich nicht auf Jahre.',
                'Wir sagen Ihnen ehrlich, wenn ein anderer Dienst oder eine andere Versorgungsform besser passt.',
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5 text-lg">
                  <IconCheck className="mt-1 flex-none text-brand" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-start gap-2.5 rounded-md bg-paper-warm p-4 text-ink">
              <IconAlert className="mt-1 flex-none text-ink-accent" />
              <span>
                Unabhängige, kostenlose Beratung — die nichts mit uns zu tun hat — bekommen
                Sie bei der{' '}
                <Link href="/einsatzgebiet/muenchen" className="linkish">Stadt München</Link>{' '}
                beziehungsweise beim{' '}
                <Link href="/einsatzgebiet/pfaffenhofen-an-der-ilm" className="linkish">
                  Pflegestützpunkt Pfaffenhofen
                </Link>. Wir empfehlen sie ausdrücklich.
              </span>
            </p>
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
