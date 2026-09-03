import Link from 'next/link';
import type { Metadata } from 'next';
import PflegeKompass from '@/components/PflegeKompass';
import HeroPhoto from '@/components/HeroPhoto';
import { CtaBand, SectionHead, EditorialImage } from '@/components/Blocks';
import { IconPhone, IconArrow, IconCheck, IconPin } from '@/components/Icons';
import { business } from '@/content/business';
import { services } from '@/content/services';
import { areas } from '@/content/areas';
import { klartext, KLARTEXT_SOURCE, einsatz } from '@/content/klartext';
import { pageMeta } from '@/lib/seo';
import { trackAttrs } from '@/lib/analytics';

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
  { n: 4, t: 'Die Pflege beginnt', b: 'Besuchszeiten stimmen wir mit Ihnen ab, damit Sie wissen, womit Sie rechnen können. Jede Pflegekraft kennt Ihre Situation, bevor sie klingelt.' },
];

export default function Home() {
  return (
    <>
      {/* ================================================================ HERO
          The photograph is the ground and the copy sits on an opaque paper
          panel over it. That arrangement is not a style choice — it is the
          resolution of a fight this page lost four times.

          Text laid directly over a photograph has to be defended with a scrim,
          and a scrim dark enough for WCAG 1.4.3 is dark enough to bury the
          faces that were the reason for using a photograph at all. Measured
          repeatedly: every scrim that passed contrast made the image a smudge.

          An opaque panel ends the trade-off. The photograph is shown at full
          strength with nothing over the faces, the copy has 16.68:1 against
          real paper, and the picture is still the first thing on screen. On a
          phone the panel is pulled up over the photograph's lower edge, so the
          overlap is visible rather than merely structural.

          Section is NOT overflow-hidden: clipping would hide an oversized
          headline instead of exposing it, which is how a Safari text-wrap bug
          went unnoticed here once. */}
      <section className="relative isolate bg-page">
        {/* The phone height is capped in viewport units rather than left to
            the crop's own aspect. A full-width square on a 390px screen is
            390px tall, which pushed the headline and both buttons past the
            fold — the photograph would have been the whole first screen and
            the call button would have been a scroll away. 44vh keeps both
            faces and still leaves room to act. */}
        <div className="h-[34vh] min-h-[12rem] max-h-[20rem] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[54%]">
          <HeroPhoto />
        </div>

        <div className="shell relative">
          <div className="lg:pr-[52%]">
            <div className="-mt-12 border-t-4 border-sun bg-page px-5 pb-8 pt-5 sm:-mt-20 sm:px-8 sm:pb-12 sm:pt-9 lg:mt-0 lg:border-0 lg:px-0 lg:py-20 xl:py-24">
              <p className="eyebrow">Ambulanter Pflegedienst</p>
              {/* No non-breaking spaces anywhere in this headline: they glued
                  "Pfaffenhofen a.d. Ilm." into one unbreakable 22-character
                  token that clipped on a 320px screen. */}
              {/* Two steps down on phones, not one. The display size only
                  earns its keep where a line holds more than three words, and
                  every pixel it takes on a 390px screen pushes the primary
                  button under the sticky action bar — which is the one place a
                  call to action must never be.

                  The headline also drops "a.d. Ilm", which cost a whole fourth
                  line on a 360px screen for a suffix nobody searches. The full
                  official name stays in the lead sentence directly below, in
                  the page title, in the meta description and on every location
                  page, so nothing is lost for local search.

                  On a 360px screen the button still falls just under the fold.
                  That is where the tuning stops: the sticky bar at the bottom
                  of the screen carries the same two actions at all times, and
                  shrinking the headline and the photograph any further to win
                  one button on the smallest handset costs the design more than
                  it gains. Page content clears the bar via the footer's bottom
                  padding, so nothing is ever permanently hidden behind it. */}
              <h1 className="text-3xl sm:text-5xl xl:text-6xl">
                Pflege zu Hause, auf die Sie sich verlassen können.
              </h1>
              {/* Says WHAT before it says why. The previous lead opened on the
                  differentiator and closed with "Das ist seltener, als es sein
                  sollte" — a swipe at the rest of the sector in the second
                  sentence a visitor reads, and four lines on a phone. This one
                  names the services first, keeps the differentiator, and fits
                  in three. */}
              {/* The cities moved out of the H1 and into this line. That is a
                  deliberate trade with one cost worth naming: "Pflegedienst
                  München" is the primary local query and an H1 is the strongest
                  on-page signal for it. The signal is not lost — the cities are
                  in the first line of body copy, the <title>, the meta
                  description, the top utility strip, the trust row, the footer
                  and both location pages, whose own H1s carry them fully. What
                  is gained is a first line that speaks to a worried reader
                  rather than to a crawler. */}
              <p className="measure mt-3 text-lg text-ink sm:mt-5 sm:text-xl">
                Ambulante Pflege, Behandlungspflege und Betreuung in München und
                Pfaffenhofen. Wir klären mit Ihnen, welche Unterstützung benötigt wird,
                wie die Versorgung organisiert werden kann und welche Kosten übernommen
                werden.
              </p>

              {/* One primary action, and it is the consultation rather than the
                  phone number. Two filled buttons of equal weight make the
                  visitor choose before they have decided anything; a single
                  filled button decides for them. The number keeps a strong
                  secondary treatment here and is the FILLED action in the
                  mobile bar at the bottom of the screen, so a high-intent
                  caller on a phone is still one tap away. */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/kontakt"
                  className="btn btn--primary text-lg"
                  {...trackAttrs('primary_cta_click', { placement: 'hero', label: 'Beratung' })}
                >
                  Kostenlos beraten lassen <IconArrow />
                </Link>
                <a
                  href={business.phone.href}
                  className="btn btn--secondary text-lg"
                  {...trackAttrs('phone_click', { placement: 'hero' })}
                >
                  <IconPhone />
                  Jetzt anrufen
                </a>
              </div>
              {/* Reassurance next to the button, not three sections below it.
                  The two things that stop a family from making contact are
                  "will this commit me to something" and "do I need to know
                  what I am asking for first". Both are answered here. */}
              <ul className="mt-5 m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0 text-sm text-ink-muted">
                {[
                  'Unverbindliches Erstgespräch',
                  'Sie müssen noch nicht wissen, welche Leistung Sie benötigen',
                  `Büro ${business.officeHours.days}, ${business.officeHours.from}–${business.officeHours.to} Uhr`,
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 flex-none text-brand" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Trust row — only claims the client already publishes about itself.
          A rule-separated row rather than four boxes: these are four short
          facts, and four boxes would say they are four features. */}
      <section className="border-y border-line bg-paper">
        <ul className="shell m-0 grid list-none gap-x-10 gap-y-4 p-0 py-6 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ============================================================ KLARTEXT
          The four questions families actually arrive with, each answered with
          something specific and checkable.

          An earlier version phrased these as accusations against the sector —
          accurate, sourced, and still the wrong instrument. Making a fear vivid
          and then offering yourself as the cure is a sales technique, and a
          family choosing a care provider under pressure can feel it. The
          research is the same; the posture is calm authority rather than
          alarm. */}
      <section className="section">
        <div className="shell grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <SectionHead
              eyebrow="Klartext"
              title="Vier Fragen, die fast jede Familie stellt"
              intro="Vier Dinge, die in der ambulanten Pflege den Unterschied machen — und wie sie bei uns geregelt sind. Konkret genug, dass Sie es später überprüfen können."
            />
            <dl className="m-0">
              {klartext.map((k) => (
                <div key={k.fear} className="border-t border-line py-6 first:border-t-0 first:pt-0">
                  <dt className="text-lg font-bold text-brand-ink">{k.fear}</dt>
                  <dd className="m-0 mt-2.5 flex items-start gap-3 text-ink-muted">
                    <IconCheck className="mt-1 flex-none text-brand" />
                    <span>{k.answer}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 text-sm text-ink-muted">
              Grundlage:{' '}
              <a href={KLARTEXT_SOURCE.href} className="linkish" rel="noopener noreferrer" target="_blank">
                {KLARTEXT_SOURCE.label}
                <span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>
            </p>
          </div>

          <EditorialImage
            className="self-start lg:sticky lg:top-28"
            name="beratung"
            widths={[600, 900, 1400]}
            ratio={3 / 2}
            plate
            sizes="(min-width: 64rem) 34vw, 100vw"
            alt="Zwei ältere Frauen sitzen an einem Tisch bei Kaffee und sprechen miteinander."
          />
        </div>
      </section>

      {/* ====================================================== PFLEGE-KOMPASS
          On the night ground. The site has exactly two dark bands and this is
          the first, so arriving here reads as a change of gear rather than as
          another striped section. */}
      <section className="section section--night on-dark">
        <div className="shell">
          <div className="mb-9 max-w-[46rem]">
            <p className="eyebrow text-sun">Orientierung in drei Fragen</p>
            <span className="horizont" aria-hidden="true" />
            <h2 className="text-4xl">Was steht uns eigentlich zu?</h2>
            <p className="mt-4 text-lg text-white/85">
              Die Frage, mit der fast jede Familie anruft — und auf die die meisten
              Pflegeseiten mit vier Absätzen Gesetzestext antworten. Hier bekommen Sie
              die Zahl, mit den Beträgen, die ab 2026 gelten.
            </p>
          </div>
          <div className="mx-auto max-w-[52rem]">
            <PflegeKompass />
          </div>
        </div>
      </section>

      {/* ================================================================ EINSATZ
          What half an hour actually contains. Competitors answer this with a
          catalogue of nouns; a timed sequence is a different kind of
          information, and it is the only way to show a claim about planning by
          real duration rather than by the minute list. */}
      <section className="section">
        {/* Held to a reading measure. When this section lost its photograph the
            grid was left spanning the whole shell and the body text ran past
            1,280px — a line nobody finishes. A section without an image needs a
            width of its own, not the full page. */}
        <div className="shell">
          <div className="max-w-[54rem]">
            <SectionHead
              eyebrow="Ein Einsatz"
              title="Was in einer halben Stunde tatsächlich passiert."
              intro="Ein typischer Morgeneinsatz. Keine Zusage über die Dauer — wie lange es wirklich braucht, hängt an dem Menschen, nicht an der Uhr. Genau deshalb steht die Uhr hier trotzdem."
            />
            <ol className="m-0 list-none p-0">
              {einsatz.map((e) => (
                <li key={e.at} className="grid grid-cols-[4.5rem_1fr] gap-x-4 border-t border-line py-5 first:border-t-0 first:pt-0 sm:grid-cols-[6rem_1fr] sm:gap-x-6">
                  <span className="figure-xl pt-0.5 text-lg text-ink-accent sm:text-xl">{e.at}</span>
                  <span>
                    <span className="block font-bold text-brand-ink">{e.title}</span>
                    <span className="mt-1.5 block text-ink-muted">{e.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ============================================================= SERVICES
          A rule-separated editorial list, not a card grid. The old version
          rendered five near-identical boxes; five boxes say "five products",
          and these are not products — they are five different legal
          entitlements with five different payers, which is the actual
          information a visitor needs. */}
      <section className="section section--paper">
        <div className="shell">
          <SectionHead
            eyebrow="Leistungen"
            title="Was wir zu Hause übernehmen"
            intro="Jede Leistung hat ihren eigenen Kostenträger und ihre eigenen Voraussetzungen. Auf den Detailseiten steht, wer zahlt und ab welchem Pflegegrad."
          />
          <ul className="m-0 list-none border-t border-line-strong p-0">
            {services.map((s) => (
              <li key={s.slug} className="group relative border-b border-line">
                <Link
                  href={`/leistungen/${s.slug}`}
                  className="grid items-baseline gap-x-8 gap-y-1 py-6 no-underline sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto]"
                >
                  <h3 className="text-xl text-brand-ink transition-colors group-hover:text-brand">
                    {s.name}
                  </h3>
                  <span className="block text-ink-muted">
                    {s.promise}
                    <span className="mt-1 block text-sm">{s.payer}</span>
                  </span>
                  <IconArrow className="hidden flex-none self-center text-brand transition-transform group-hover:translate-x-1 sm:block" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* =============================================================== HALTUNG */}
      <section className="section">
        <div className="shell grid items-center gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <SectionHead
              eyebrow="Weshalb Supra"
              title="Pflege lässt sich nicht immer auf Minuten reduzieren."
            />
            {/* Rewritten to describe how Supra plans, not how anyone else
                does. The previous version opened on "In vielen Diensten steht
                vor jedem Einsatz eine Liste..." — a claim about the sector that
                the business cannot evidence and does not need to make. */}
            <div className="prose text-ink-muted">
              <p>
                Jede Versorgungssituation ist unterschiedlich. Deshalb betrachten wir
                nicht nur einzelne Tätigkeiten, sondern den tatsächlichen
                Unterstützungsbedarf im Alltag: die Wohnung, die Tagesstruktur und die
                Menschen, die schon jetzt helfen.
              </p>
              <p>
                Welche Leistungen möglich sind und wie viel Zeit dafür eingeplant werden
                kann, besprechen wir vorher mit Ihnen. Wenn eine Tour das nicht hergibt,
                sagen wir das — das ist der Grundsatz, mit dem dieser Dienst 2022
                gegründet wurde.
              </p>
              <p>
                Dazu gehört auch, nicht alles zu übernehmen, nur weil es schneller geht.
                Wir schauen, was jemand noch selbst kann, und unterstützen so, dass es
                erhalten bleibt.
              </p>
            </div>
            <Link href="/ueber-uns" className="btn btn--secondary mt-7">
              Mehr über uns <IconArrow />
            </Link>
          </div>

          {/* The same kitchen as the services page, cut portrait. One sitting,
              two frames — a commissioned shoot works exactly this way, and it
              is what stopped the set reading as five unrelated stock pictures. */}
          <EditorialImage
            name="haltung"
            widths={[480, 720, 1000]}
            ratio={4 / 5}
            plate
            sizes="(min-width: 64rem) 32vw, 100vw"
            alt="Eine Pflegekraft nimmt sich in einer Küche Zeit für eine ältere Frau am Tisch."
          />

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
          <ol className="m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <li key={s.n} className="border-t-2 border-line-strong pt-4">
                <span className="figure-xl block text-4xl text-brand">
                  {String(s.n).padStart(2, '0')}
                </span>
                <h3 className="mt-2 text-xl">{s.t}</h3>
                <p className="mt-2 text-ink-muted">{s.b}</p>
              </li>
            ))}
          </ol>
          <Link href="/ablauf" className="btn btn--secondary mt-10">
            Ablauf im Detail <IconArrow />
          </Link>
        </div>
      </section>

      {/* =========================================================== EINSATZGEBIET */}
      <section className="section">
        <div className="shell">
          <SectionHead
            eyebrow="Einsatzgebiet"
            title="Wo wir hinkommen"
            intro="Zwei Standorte, zwei sehr unterschiedliche Gebiete — in der Stadt entscheidet der Verkehr, auf dem Land die Entfernung. Sagen Sie uns Ihre Adresse, dann bekommen Sie eine klare Antwort."
          />
          <ul className="m-0 grid list-none gap-x-10 gap-y-8 p-0 sm:grid-cols-2">
            {areas.map((a) => {
              const loc = business.locations.find((l) => l.slug === a.slug)!;
              return (
                <li key={a.slug} className="group relative border-t-2 border-line-strong pt-5 transition-colors hover:border-sun">
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

      {/* ================================================================ KARRIERE
          What the research says nurses actually weigh when they change jobs:
          control over the roster first, pay second, being taken seriously
          third. So the roster is the headline, not "werden Sie Teil unseres
          Teams". */}
      <section className="section section--paper">
        <div className="shell grid items-center gap-8 border-2 border-brand bg-page p-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:p-12">
          <div>
            <p className="eyebrow">Für Pflegekräfte</p>
            <span className="horizont" aria-hidden="true" />
            <h2 className="max-w-[26ch] text-3xl">
              Sie sind Pflegekraft und suchen einen Dienstplan, der stimmt?
            </h2>
            <p className="measure mt-4 text-lg text-ink-muted">
              Touren, die nach realer Erfahrung geplant sind statt nach dem, was
              rechnerisch gerade noch geht. Derselbe Grundsatz, der unseren Klientinnen
              und Klienten zugutekommt.
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
