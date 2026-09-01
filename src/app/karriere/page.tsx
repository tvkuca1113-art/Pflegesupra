import { Suspense } from 'react';
import type { Metadata } from 'next';
import InquiryForm from '@/components/InquiryForm';
import { PageHeader, Breadcrumbs, SectionHead } from '@/components/Blocks';
import { IconCheck, IconAlert } from '@/components/Icons';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { business } from '@/content/business';

export const metadata: Metadata = pageMeta({
  title: 'Karriere — Pflegekraft werden bei Supra',
  description:
    'Arbeiten in der ambulanten Pflege in München und Pfaffenhofen a.d. Ilm: Touren nach '
    + 'realer Erfahrung geplant statt nach Minutenliste. Jetzt initiativ bewerben.',
  path: '/karriere',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Karriere', path: '/karriere' },
];

/** Claims about working conditions must be ones the client can actually keep. */
const promises = [
  {
    t: 'Touren nach Erfahrung geplant',
    b: 'Die Zeiten in Ihrer Tour entstehen aus dem, was ein Einsatz tatsächlich braucht — nicht aus dem, was rechnerisch gerade noch geht. Das ist der Gründungsgrund dieses Dienstes und gilt für Sie genauso wie für die Klienten.',
  },
  {
    t: 'Sie kennen Ihre Klienten',
    b: 'Wir planen so, dass Sie nicht jeden Tag bei fremden Menschen klingeln. Kontinuität ist für Pflegekräfte genauso entlastend wie für die Menschen, die gepflegt werden.',
  },
  {
    t: 'Erfahrung trifft frische Ausbildung',
    b: 'Im Team arbeiten frisch examinierte Kolleginnen und Kollegen mit Menschen zusammen, die seit Jahren in Klinik und ambulanter Pflege unterwegs sind. Fragen zu stellen ist hier keine Schwäche.',
  },
  {
    t: 'Zwei Standorte, kurze Wege',
    b: `München-Sendling und Pfaffenhofen a.d. Ilm. Sie fahren in dem Gebiet, das zu Ihrem Wohnort passt, statt quer durch Oberbayern.`,
  },
];

export default function KarrierePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow="Für Pflegekräfte"
        title="Pflege, bei der die eingeplante Zeit auch die echte Zeit ist"
        intro="Wenn Sie den Beruf gelernt haben, um Menschen zu versorgen, und ihn ausüben, um eine Liste abzuarbeiten, dann liegt das nicht an Ihnen. Es liegt an der Planung."
      />

      <section className="section">
        <div className="shell grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <SectionHead title="Was wir zusagen können" />
            <dl className="m-0 space-y-8">
              {promises.map((p) => (
                <div key={p.t} className="border-t-4 border-[var(--color-sun)] pt-4">
                  <dt className="text-[var(--text-xl)] font-bold text-[var(--color-brand-ink)]">{p.t}</dt>
                  <dd className="m-0 mt-2 text-[var(--color-ink-muted)]">{p.b}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <SectionHead
              title="Wen wir suchen"
              intro="Die fachliche Qualifikation ist die Voraussetzung. Entschieden wird über die Haltung."
            />
            <ul className="checklist text-[var(--text-lg)]">
              <li>Pflegefachkräfte (examiniert), Vollzeit oder Teilzeit</li>
              <li>Pflegehelferinnen und Pflegehelfer</li>
              <li>Betreuungskräfte nach §43b SGB XI</li>
              <li>Hauswirtschaftliche Kräfte</li>
              <li>Auszubildende und Praktikantinnen und Praktikanten</li>
            </ul>

            <div className="mt-8 flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--color-paper-warm)] p-5">
              <IconAlert className="mt-1 flex-none text-[var(--color-ink-accent)]" />
              <p className="m-0 text-[var(--color-ink)]">
                <strong>Wir nennen hier bewusst keine Gehaltsspanne und keine
                Zuschlagsliste.</strong> Beides hängt von Qualifikation, Umfang und Erfahrung ab,
                und eine Zahl auf einer Website, die im Gespräch dann doch anders aussieht,
                hilft niemandem. Fragen Sie im ersten Telefonat direkt danach — Sie bekommen
                eine konkrete Antwort.
              </p>
            </div>

            <ul className="m-0 mt-8 list-none space-y-3 p-0">
              {[
                'Kein Zeugnis-Paket für die erste Kontaktaufnahme nötig.',
                'Auch Initiativbewerbungen sind willkommen.',
                'Rückmeldung bekommen Sie in jedem Fall — auch bei einer Absage.',
              ].map((x) => (
                <li key={x} className="flex items-start gap-2.5">
                  <IconCheck className="mt-1 flex-none text-[var(--color-brand)]" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell mx-auto max-w-[46rem]">
          <SectionHead
            eyebrow="Bewerbung"
            title="Schreiben Sie uns"
            intro="Kurz genügt. Wer Sie sind, was Sie können, ab wann und in welchem Umfang."
          />
          <Suspense fallback={<p className="text-[var(--color-ink-muted)]">Formular wird geladen …</p>}>
            <InquiryForm kind="bewerbung" />
          </Suspense>
          <p className="mt-8 text-[var(--color-ink-muted)]">
            Lieber telefonisch? {business.officeHours.days}, {business.officeHours.from}–{business.officeHours.to} Uhr
            unter{' '}
            <a href={business.phone.href} className="linkish font-bold">{business.phone.display}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
