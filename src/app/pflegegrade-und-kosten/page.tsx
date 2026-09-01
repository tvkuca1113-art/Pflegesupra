import type { Metadata } from 'next';
import Link from 'next/link';
import PflegeKompass from '@/components/PflegeKompass';
import { PageHeader, CtaBand, Breadcrumbs, SectionHead, Source } from '@/components/Blocks';
import { JsonLd, breadcrumbJsonLd, pageMeta } from '@/lib/seo';
import { grades, extraBenefits, euro, BENEFIT_SOURCE } from '@/content/pflege';

export const metadata: Metadata = pageMeta({
  title: 'Pflegegrade & Kosten 2026 — was die Kasse zahlt',
  description:
    'Pflegesachleistung, Pflegegeld, Entlastungsbetrag und der gemeinsame Jahresbetrag für '
    + '2026 — alle Beträge je Pflegegrad, mit Quelle. Und was davon Sie selbst tragen.',
  path: '/pflegegrade-und-kosten',
});

const trail = [
  { name: 'Start', path: '/' },
  { name: 'Pflegegrade & Kosten', path: '/pflegegrade-und-kosten' },
];

export default function KostenPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(trail)} />
      <Breadcrumbs trail={trail} />
      <PageHeader
        eyebrow={`Leistungsbeträge ${BENEFIT_SOURCE.validFor}`}
        title="Was Ihnen zusteht — und was am Ende Sie zahlen"
        intro="Die Beträge unten sind gesetzliche Ansprüche gegenüber Ihrer Pflegekasse, keine
        Preise von uns. Sie stammen unverändert aus der offiziellen Übersicht des
        Bundesgesundheitsministeriums."
      />

      <section className="section section--warm">
        <div className="shell mx-auto max-w-[52rem]">
          <PflegeKompass />
        </div>
      </section>

      {/* The complete table, server-rendered. This is what makes the Kompass a
          convenience rather than a gate: everything it can tell you is also
          here, without JavaScript. */}
      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="Vollständige Übersicht"
            title={`Alle Beträge je Pflegegrad, Stand ${BENEFIT_SOURCE.validFor}`}
            intro="Die Beträge sind gegenüber 2025 unverändert. Die nächste gesetzliche Anpassung ist für den 1. Januar 2028 vorgesehen."
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <caption className="sr-only">
                Leistungsbeträge der Pflegeversicherung {BENEFIT_SOURCE.validFor} je Pflegegrad
              </caption>
              <thead>
                <tr className="border-b-4 border-brand">
                  <th scope="col" className="py-3 pr-4 align-bottom">Pflegegrad</th>
                  <th scope="col" className="py-3 pr-4 align-bottom">
                    Pflegesachleistung<span className="block text-sm font-normal text-ink-muted">§36 SGB XI, monatlich</span>
                  </th>
                  <th scope="col" className="py-3 pr-4 align-bottom">
                    Pflegegeld<span className="block text-sm font-normal text-ink-muted">§37 SGB XI, monatlich</span>
                  </th>
                  <th scope="col" className="py-3 pr-4 align-bottom">
                    Entlastungsbetrag<span className="block text-sm font-normal text-ink-muted">§45b SGB XI, monatlich</span>
                  </th>
                  <th scope="col" className="py-3 align-bottom">
                    Gemeinsamer Jahresbetrag<span className="block text-sm font-normal text-ink-muted">§39 SGB XI, jährlich</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.grad} className="border-b border-line align-top">
                    <th scope="row" className="py-4 pr-4 font-bold text-brand-ink">
                      Pflegegrad {g.grad}
                      <span className="mt-1 block max-w-[22ch] text-sm font-normal text-ink-muted">
                        {g.summary}
                      </span>
                    </th>
                    <td className="py-4 pr-4 text-lg font-bold tabular-nums">
                      {g.sachleistung ? euro(g.sachleistung) : <span className="font-normal text-ink-muted">nicht vorgesehen</span>}
                    </td>
                    <td className="py-4 pr-4 text-lg font-bold tabular-nums">
                      {g.pflegegeld ? euro(g.pflegegeld) : <span className="font-normal text-ink-muted">nicht vorgesehen</span>}
                    </td>
                    <td className="py-4 pr-4 text-lg font-bold tabular-nums">{euro(g.entlastungsbetrag)}</td>
                    <td className="py-4 text-lg font-bold tabular-nums">
                      {g.jahresbetrag ? euro(g.jahresbetrag) : <span className="font-normal text-ink-muted">ab Pflegegrad 2</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Source label={BENEFIT_SOURCE.label} url={BENEFIT_SOURCE.url} />
        </div>
      </section>

      <section className="section section--paper">
        <div className="shell grid gap-12 lg:grid-cols-2">
          <div className="prose">
            <SectionHead title="Was Supra davon kostet" />
            <p>
              <strong>Wir rechnen direkt mit Ihrer Pflege- und Krankenkasse ab.</strong> Als
              gesetzlich versicherte Person gehen Sie nicht in Vorleistung, und wir erheben
              keine Aufnahmegebühren oder Zuschläge. Unsere Vergütung richtet sich nach den
              geltenden Vereinbarungen mit den Kassen.
            </p>
            <p>
              Selbst zahlen müssen Sie nur in zwei Fällen: wenn das Budget Ihres Pflegegrades
              für den vereinbarten Umfang nicht ausreicht — dann stellen wir die Differenz auf
              Grundlage des vorher unterschriebenen Vertrags in Rechnung — oder wenn Sie
              ausdrücklich Privatleistungen wünschen, die über den Leistungskatalog
              hinausgehen.
            </p>
            <p>
              Privat Versicherte erhalten die Rechnung von uns und reichen sie bei ihrem
              Kostenträger ein. Eine Direktabrechnung ist dort in der Regel gesetzlich nicht
              vorgesehen.
            </p>
            <Link href="/fragen-und-antworten" className="btn btn--secondary mt-2">
              Fragen zu Kosten &amp; Abrechnung
            </Link>
          </div>

          <div>
            <SectionHead
              title="Was viele übersehen"
              intro="Ansprüche, die häufig ungenutzt verfallen, obwohl sie zustehen."
            />
            <dl className="m-0 grid gap-px overflow-hidden rounded-md border border-line bg-line">
              {extraBenefits.map((b) => (
                <div key={b.label} className="flex items-baseline justify-between gap-4 bg-white p-4">
                  <dt>
                    <span className="block font-bold text-brand-ink">{b.label}</span>
                    {b.note ? (
                      <span className="block text-sm text-ink-muted">{b.note}</span>
                    ) : null}
                  </dt>
                  <dd className="m-0 whitespace-nowrap text-right">
                    <span className="block text-xl font-bold tabular-nums text-brand-ink">
                      {euro(b.amount)}
                    </span>
                    <span className="block text-sm text-ink-muted">{b.unit}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-ink-muted">
              Der Entlastungsbetrag von {euro(131)} monatlich verfällt nicht sofort: Reste
              lassen sich ins Folgejahr übertragen und dort bis zum 30. Juni nutzen.
            </p>
            <Source label={BENEFIT_SOURCE.label} url={BENEFIT_SOURCE.url} />
          </div>
        </div>
      </section>

      <CtaBand
        title="Rechnen wir es an Ihrem Fall durch?"
        body="Im kostenlosen Erstgespräch gehen wir Ihren Pflegegrad, den tatsächlichen Bedarf und die Budgets zusammen durch — und Sie bekommen vorher schriftlich, was gegebenenfalls privat bliebe."
      />
    </>
  );
}
