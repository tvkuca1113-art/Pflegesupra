import Link from 'next/link';
import type { Metadata } from 'next';
import PflegeKompass from '@/components/PflegeKompass';
import SunriseMark from '@/components/SunriseMark';
import HeroBackdrop from '@/components/HeroBackdrop';
import HeroPhotoBand from '@/components/HeroPhotoBand';
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

/** The hero card. Short on purpose — the full version lives on /ablauf. */
const firstSteps = [
  { n: 1, t: 'Zehn Minuten am Telefon', b: 'Wir klären, was gebraucht wird und ob wir Ihre Adresse anfahren können.' },
  { n: 2, t: 'Kostenloses Erstgespräch', b: 'Bei Ihnen zu Hause, unverbindlich — dort, wo die Pflege später stattfindet.' },
  { n: 3, t: 'Kosten schriftlich', b: 'Was die Kasse trägt und was gegebenenfalls privat bliebe, vor der Unterschrift.' },
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
          do, where, and what to do next.

          The section is NOT overflow-hidden: that would clip an oversized
          headline instead of showing it as a layout error, which is how a
          Safari text-wrap bug went unnoticed once. Only the decorative layer
          inside HeroBackdrop clips, and it contains no text.

          Text does sit over a photograph here, so contrast is no longer a
          property of the tokens — it is measured per pixel by
          `npm run check:hero`. */}
      <section className="on-dark relative isolate bg-brand-ink text-white">
        <HeroBackdrop />
        <HeroPhotoBand />
        {/* On phones the text sits on solid brand ink below the photo band,
            so contrast here is not a compromise with an image. */}
        <div className="shell grid items-center gap-10 pb-12 pt-10 sm:pt-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:py-16">
          <div>
            {/* On the dark ground the eyebrow uses the sun's light tint rather
                than --color-ink-accent, which is a dark orange built for white. */}
            <p className="eyebrow text-sun-soft">Ambulante Pflege zu Hause</p>
            <span className="horizont" aria-hidden="true" />
            {/* 55 characters, not 74. The longer version ran to four lines at
                display size on a phone and pushed everything below it off the
                screen. No non-breaking spaces: they glued "Pfaffenhofen a.d.
                Ilm." into one unbreakable 22-character token. */}
            <h1 className="text-4xl text-white sm:text-5xl">
              Pflege zu Hause in München und Pfaffenhofen a.d. Ilm.
            </h1>
            {/* Kept to two lines on a phone. Every line here pushes the call
                button further below the fold, and "in den eigenen vier Wänden"
                was already said by "zu Hause" in the headline. */}
            <p className="measure mt-4 text-lg text-white/90">
              Grundpflege, Behandlungspflege, Betreuung und Hauswirtschaft — geplant
              nach dem, was eine Aufgabe wirklich dauert.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href={business.phone.href} className="btn btn--onDark text-lg">
                <IconPhone />
                {business.phone.display}
              </a>
              <Link href="/kontakt" className="btn btn--ghostDark">
                Rückruf anfordern <IconArrow />
              </Link>
            </div>
            <p className="mt-3 text-sm text-white/85">
              Büro {business.officeHours.days}, {business.officeHours.from}–{business.officeHours.to} Uhr.
              Ein Erstgespräch kostet Sie nichts.
            </p>
          </div>

          {/* Right column answers the question the hero raises but does not
              settle: "what am I actually committing to if I call?" A decorative
              image here would occupy the same space and answer nothing. */}
          <aside className="overflow-hidden rounded-lg border-2 border-line bg-white shadow-raised">
            <SunriseMark className="block w-full" />
            <div className="p-6">
              <h2 className="text-xl">Was passiert, wenn Sie anrufen</h2>
              <ol className="m-0 mt-4 list-none space-y-4 p-0">
                {firstSteps.map((s) => (
                  <li key={s.t} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-sm bg-brand text-sm font-bold tabular-nums text-white"
                    >
                      {s.n}
                    </span>
                    <span>
                      <span className="block font-bold text-brand-ink">{s.t}</span>
                      <span className="block text-sm text-ink-muted">{s.b}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-5 border-t border-line pt-4 text-sm text-ink-muted">
                Sie unterschreiben nichts, bevor Sie schriftlich wissen, was es kostet.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* Trust row — only claims the client already publishes about itself.
          Its own section, so the sunrise ground stays with the hero and the
          horizon rule lands where the composition ends. */}
      <section className="border-b border-line bg-paper">
        <ul className="shell m-0 grid list-none gap-x-8 gap-y-4 p-0 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((p) => (
            <li key={p.label} className="flex items-start gap-2.5">
              <IconCheck className="mt-1 flex-none text-brand" />
              <span>
                <span className="block font-bold text-brand-ink">{p.label}</span>
                <span className="block text-sm text-ink-muted">{p.sub}</span>
              </span>
            </li>
          ))}
        </ul>
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
              <li key={s.n} className="border-t-4 border-sun pt-4">
                <span className="block text-3xl font-bold tabular-nums text-brand">
                  {String(s.n).padStart(2, '0')}
                </span>
                <h3 className="mt-1 text-xl">{s.t}</h3>
                <p className="mt-2 text-ink-muted">{s.b}</p>
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
            <div className="prose text-ink-muted">
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

          <figure className="m-0 self-start border-l-4 border-sun bg-paper-warm p-7">
            <blockquote className="m-0 text-2xl font-bold leading-snug text-brand-ink">
              „Krankenpflege ist eine Kunst, die wie jede andere vor allen Dingen eine
              Reihe angeborener Eigenschaften und Anlagen bedingt, ohne die auch die beste
              technische Schulung keinen Wert hat.“
            </blockquote>
            <figcaption className="mt-4 text-ink-muted">
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
                <li key={a.slug} className="group relative border-t-4 border-line bg-white pt-4 transition-colors hover:border-sun">
                  <h3 className="text-xl">
                    <Link href={`/einsatzgebiet/${a.slug}`} className="no-underline after:absolute after:inset-0 after:content-['']">
                      Pflege in {a.city}
                    </Link>
                  </h3>
                  <p className="mt-2 flex items-start gap-2 text-ink-muted">
                    <IconPin className="mt-1 flex-none" />
                    <span>{loc.role} · {loc.street}, {loc.postalCode} {loc.city}</span>
                  </p>
                  <p className="mt-3 text-ink-muted">{a.coverage}</p>
                  <p className="mt-4 flex items-center gap-2 font-bold text-brand">
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
        <div className="shell grid items-center gap-8 rounded-lg border-2 border-brand p-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:p-10">
          <div>
            <p className="eyebrow">Für Pflegekräfte</p>
            <span className="horizont" aria-hidden="true" />
            <h2 className="max-w-[24ch] text-3xl">
              Sie sind Pflegekraft und haben genug von der Minutenliste?
            </h2>
            <p className="measure mt-4 text-lg text-ink-muted">
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
