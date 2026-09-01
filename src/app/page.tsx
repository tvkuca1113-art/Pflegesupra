import Link from 'next/link';
import type { Metadata } from 'next';
import PflegeKompass from '@/components/PflegeKompass';
import SunriseMark from '@/components/SunriseMark';
import { CtaBand, LinkCard, SectionHead } from '@/components/Blocks';
import { IconPhone, IconArrow, IconCheck, IconPin } from '@/components/Icons';
import { business } from '@/content/business';
import { services } from '@/content/services';
import { areas } from '@/content/areas';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Ambulanter Pflegedienst München & Pfaffenhofen a.d. Ilm',
  description:
    'Ambulante Pflege zu Hause in München und Pfaffenhofen a.d. Ilm. Grundpflege, '
    + 'Behandlungspflege, Betreuung und Hauswirtschaft — direkt mit der Kasse abgerechnet. '
    + 'Beratung: 089 189 39 716.',
  path: '/',
});

/** Facts, each traceable to the client's own published information. */
const trustPoints = [
  { label: 'Zugelassen nach SGB XI', sub: 'Pflege- und Behandlungspflege abrechenbar' },
  { label: 'Seit 2022 eigenständig', sub: 'Gegründet aus Erfahrung in Klinik und ambulanter Pflege' },
  { label: 'Zwei Standorte', sub: 'München Sendling und Pfaffenhofen a.d. Ilm' },
  { label: 'Keine Vorleistung', sub: 'Gesetzlich Versicherte zahlen nichts vor' },
];

const steps = [
  { n: 1, t: 'Sie rufen an', b: 'Ein Gespräch, in dem wir zuhören statt zu verkaufen. Wir klären, was gebraucht wird und ob wir Ihre Adresse anfahren können.' },
  { n: 2, t: 'Wir kommen vorbei', b: 'Kostenloses Erstgespräch bei Ihnen zu Hause. Wir sehen die Wohnung, die Situation und die Menschen — das geht am Telefon nicht.' },
  { n: 3, t: 'Wir klären die Kasse', b: 'Wir sagen Ihnen, welche Leistungen Ihr Pflegegrad abdeckt, was die Verordnung enthalten muss und was privat bliebe. Schriftlich, vorher.' },
  { n: 4, t: 'Die Pflege beginnt', b: 'Feste Zeiten, möglichst wenige wechselnde Gesichter, und jede Pflegekraft kennt Ihre Situation, bevor sie klingelt.' },
];

export default function Home() {
  return (
    <>
      {/* ================================================================ HERO
          Answers all four questions in the first screen: who we help, what we
          do, where, and what to do next. No text over a photograph, so contrast
          is never at the mercy of an image. */}
      <section className="relative overflow-hidden border-b border-[var(--color-line)] bg-white">
        <div className="shell grid items-center gap-10 py-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:py-16">
          <div>
            <p className="eyebrow">Ambulante Pflege zu Hause</p>
            <span className="horizont" aria-hidden="true" />
            <h1 className="text-[var(--text-4xl)] sm:text-[var(--text-5xl)]">
              Pflege in den eigenen vier Wänden — in München und Pfaffenhofen&nbsp;a.d.&nbsp;Ilm.
            </h1>
            <p className="measure mt-5 text-[var(--text-lg)] text-[var(--color-ink-muted)]">
              Grundpflege, ärztlich verordnete Behandlungspflege, Betreuung und Hauswirtschaft
              — geplant nach dem, was eine Aufgabe wirklich dauert, nicht nach der
              Minutenliste. Für gesetzlich Versicherte rechnen wir direkt mit der Kasse ab.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={business.phone.href} className="btn btn--primary text-[var(--text-lg)]">
                <IconPhone />
                {business.phone.display}
              </a>
              <Link href="/kontakt" className="btn btn--secondary">
                Rückruf anfordern <IconArrow />
              </Link>
            </div>
            <p className="mt-3 text-[var(--text-sm)] text-[var(--color-ink-muted)]">
              Büro {business.officeHours.days}, {business.officeHours.from}–{business.officeHours.to} Uhr.
              Ein Erstgespräch kostet Sie nichts.
            </p>
          </div>

          <div className="hidden lg:block">
            <SunriseMark className="w-full rounded-[var(--radius-lg)]" />
          </div>
        </div>

        {/* Trust row — only claims the client already publishes about itself. */}
        <div className="border-t border-[var(--color-line)] bg-[var(--color-paper)]">
          <ul className="shell m-0 grid list-none gap-x-8 gap-y-4 p-0 py-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPoints.map((p) => (
              <li key={p.label} className="flex items-start gap-2.5">
                <IconCheck className="mt-1 flex-none text-[var(--color-brand)]" />
                <span>
                  <span className="block font-bold text-[var(--color-brand-ink)]">{p.label}</span>
                  <span className="block text-[var(--text-sm)] text-[var(--color-ink-muted)]">{p.sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ====================================================== PFLEGE-KOMPASS */}
      <section className="section section--warm">
        <div className="shell">
          <SectionHead
            eyebrow="Orientierung in drei Fragen"
            title="Was steht uns eigentlich zu?"
            intro="Die Frage, mit der fast jede Familie anruft — und auf die die meisten Pflegeseiten mit vier Absätzen Gesetzestext antworten. Hier bekommen Sie die Zahl."
          />
          <div className="mx-auto max-w-[52rem]">
            <PflegeKompass />
          </div>
        </div>
      </section>

      {/* ============================================================= SERVICES */}
      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="Leistungen"
            title="Was wir zu Hause übernehmen"
            intro="Jede Leistung hat ihren eigenen Kostenträger und ihre eigenen Voraussetzungen. Auf den Detailseiten steht, wer zahlt und ab welchem Pflegegrad."
          />
          <ul className="m-0 grid list-none gap-x-8 gap-y-9 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <LinkCard
                key={s.slug}
                href={`/leistungen/${s.slug}`}
                title={s.name}
                body={s.promise}
                meta={s.payer}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* ================================================================ ABLAUF */}
      <section className="section section--paper">
        <div className="shell">
          <SectionHead
            eyebrow="Ablauf"
            title="Vom ersten Anruf bis zum ersten Einsatz"
            intro="Vier Schritte. Sie gehen keinen davon allein, und Sie unterschreiben nichts, bevor Sie wissen, was es kostet."
          />
          <ol className="m-0 grid list-none gap-x-8 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="border-t-4 border-[var(--color-sun)] pt-4">
                <span className="block text-[var(--text-3xl)] font-bold tabular-nums text-[var(--color-brand)]">
                  {String(s.n).padStart(2, '0')}
                </span>
                <h3 className="mt-1 text-[var(--text-xl)]">{s.t}</h3>
                <p className="mt-2 text-[var(--color-ink-muted)]">{s.b}</p>
              </li>
            ))}
          </ol>
          <Link href="/ablauf" className="btn btn--secondary mt-9">
            Ablauf im Detail <IconArrow />
          </Link>
        </div>
      </section>

      {/* =============================================================== HALTUNG
          The client's real differentiator, in their own substance: they refuse
          to plan by the minute list. Rewritten to be concrete instead of
          slogan-shaped. */}
      <section className="section">
        <div className="shell grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHead
              eyebrow="Weshalb Supra"
              title="Wir planen nach Erfahrung, nicht nach der Minutenliste."
            />
            <div className="prose text-[var(--color-ink-muted)]">
              <p>
                In vielen Diensten steht vor jedem Einsatz eine Liste: welche Tätigkeit
                bringt wie viel Geld in welcher Zeit. Was dabei herauskommt, kennen
                Angehörige — jemand kommt, arbeitet im Laufschritt und ist wieder weg.
              </p>
              <p>
                Wir planen die Zeiten nach dem, was eine Aufgabe bei diesem Menschen in
                dieser Wohnung tatsächlich braucht. Das ist der Grund, aus dem dieser
                Dienst 2022 gegründet wurde, und es ist auch der Grund, warum wir eine
                Tour lieber ablehnen, als sie nur auf dem Papier zu schaffen.
              </p>
              <p>
                Der zweite Grundsatz ist unbequemer: Wir übernehmen nicht alles, nur weil
                es schneller geht. Wir schauen, was jemand noch selbst kann, und
                unterstützen so, dass es erhalten bleibt.
              </p>
            </div>
            <Link href="/ueber-uns" className="btn btn--secondary mt-7">
              Mehr über uns <IconArrow />
            </Link>
          </div>

          <figure className="m-0 self-start border-l-4 border-[var(--color-sun)] bg-[var(--color-paper-warm)] p-7">
            <blockquote className="m-0 text-[var(--text-2xl)] font-bold leading-snug text-[var(--color-brand-ink)]">
              „Krankenpflege ist eine Kunst, die wie jede andere vor allen Dingen eine
              Reihe angeborener Eigenschaften und Anlagen bedingt, ohne die auch die beste
              technische Schulung keinen Wert hat.“
            </blockquote>
            <figcaption className="mt-4 text-[var(--color-ink-muted)]">
              — Agnes Karll, Begründerin der deutschen Krankenpflegeorganisation.
              Das Zitat steht seit der Gründung über der Arbeit dieses Dienstes.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* =========================================================== EINSATZGEBIET */}
      <section className="section section--paper">
        <div className="shell">
          <SectionHead
            eyebrow="Einsatzgebiet"
            title="Wo wir hinkommen"
            intro="Zwei Standorte, zwei sehr unterschiedliche Gebiete — in der Stadt entscheidet der Verkehr, auf dem Land die Entfernung. Sagen Sie uns Ihre Adresse, dann bekommen Sie eine klare Antwort."
          />
          <ul className="m-0 grid list-none gap-x-8 gap-y-9 p-0 sm:grid-cols-2">
            {areas.map((a) => {
              const loc = business.locations.find((l) => l.slug === a.slug)!;
              return (
                <li key={a.slug} className="group relative border-t-4 border-[var(--color-line)] bg-white pt-4 transition-colors hover:border-[var(--color-sun)]">
                  <h3 className="text-[var(--text-xl)]">
                    <Link href={`/einsatzgebiet/${a.slug}`} className="no-underline after:absolute after:inset-0 after:content-['']">
                      Pflege in {a.city}
                    </Link>
                  </h3>
                  <p className="mt-2 flex items-start gap-2 text-[var(--color-ink-muted)]">
                    <IconPin className="mt-1 flex-none" />
                    <span>{loc.role} · {loc.street}, {loc.postalCode} {loc.city}</span>
                  </p>
                  <p className="mt-3 text-[var(--color-ink-muted)]">{a.coverage}</p>
                  <p className="mt-4 flex items-center gap-2 font-bold text-[var(--color-brand)]">
                    Zur Seite
                    <IconArrow className="transition-transform group-hover:translate-x-1" />
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ================================================================ KARRIERE */}
      <section className="section">
        <div className="shell grid items-center gap-8 rounded-[var(--radius-lg)] border-2 border-[var(--color-brand)] p-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:p-10">
          <div>
            <p className="eyebrow">Für Pflegekräfte</p>
            <span className="horizont" aria-hidden="true" />
            <h2 className="max-w-[24ch] text-[var(--text-3xl)]">
              Sie sind Pflegekraft und haben genug von der Minutenliste?
            </h2>
            <p className="measure mt-4 text-[var(--text-lg)] text-[var(--color-ink-muted)]">
              Derselbe Grundsatz, der unseren Klienten zugutekommt, gilt für die Touren
              unserer Mitarbeiterinnen und Mitarbeiter: geplant nach realer Erfahrung, nicht
              nach dem, was rechnerisch gerade noch geht.
            </p>
          </div>
          <Link href="/karriere" className="btn btn--primary">
            Offene Stellen ansehen <IconArrow />
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
