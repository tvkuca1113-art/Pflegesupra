import Link from 'next/link';
import type { Metadata } from 'next';
import PflegeKompass from '@/components/PflegeKompass';
import HeroPhoto from '@/components/HeroPhoto';
import Photo from '@/components/Photo';
import { CtaBand, SectionHead } from '@/components/Blocks';
import { IconPhone, IconArrow, IconCheck, IconPin } from '@/components/Icons';
import { business } from '@/content/business';
import { services } from '@/content/services';
import { areas } from '@/content/areas';
import { klartext, KLARTEXT_SOURCE, einsatz } from '@/content/klartext';
import { PHOTO_CREDIT } from '@/content/photos';
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
        <div className="h-[44vh] min-h-[15rem] max-h-[24rem] overflow-hidden lg:absolute lg:inset-y-0 lg:right-0 lg:h-auto lg:max-h-none lg:w-[54%]">
          <HeroPhoto />
        </div>

        <div className="shell relative">
          <div className="lg:pr-[52%]">
            <div className="-mt-12 border-t-4 border-sun bg-page px-5 pb-10 pt-6 sm:-mt-20 sm:px-8 sm:pb-12 sm:pt-9 lg:mt-0 lg:border-0 lg:px-0 lg:py-20 xl:py-24">
              <p className="eyebrow">Ambulanter Pflegedienst</p>
              {/* No non-breaking spaces anywhere in this headline: they glued
                  "Pfaffenhofen a.d. Ilm." into one unbreakable 22-character
                  token that clipped on a 320px screen. */}
              {/* Sized down a step on phones. At --text-5xl this 52-character
                  German string set four lines and buried the buttons; the
                  display size only earns its keep where the line can hold
                  more than three words. */}
              <h1 className="text-4xl sm:text-5xl xl:text-6xl">
                Pflege zu Hause in München und Pfaffenhofen a.d. Ilm.
              </h1>
              {/* The lead does the work the research says it has to do. The
                  fear families arrive with is not bad care — it is not
                  knowing. So the first sentence on the site is about knowing. */}
              <p className="measure mt-4 text-lg text-ink sm:mt-5 sm:text-xl">
                Sie wissen vorher, wer kommt, wann er kommt und was es kostet.
                Das ist seltener, als es sein sollte.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href={business.phone.href} className="btn btn--primary text-lg">
                  <IconPhone />
                  {business.phone.display}
                </a>
                <Link href="/kontakt" className="btn btn--secondary">
                  Rückruf anfordern <IconArrow />
                </Link>
              </div>
              <p className="mt-4 text-sm text-ink-muted">
                Büro {business.officeHours.days}, {business.officeHours.from}–{business.officeHours.to} Uhr.
                Ein Erstgespräch kostet Sie nichts.
              </p>
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
          The differentiating section, and the one that came straight out of
          the research rather than out of a brief.

          Every fear listed here is a documented, recurring complaint about the
          sector. Naming them costs nothing and is the only thing on the page a
          competitor would not dare to copy — which is exactly why it earns the
          space a stock-photo "Über uns" block would otherwise take. */}
      <section className="section">
        <div className="shell grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <SectionHead
              eyebrow="Klartext"
              title="Wovor Angehörige Angst haben — und was wir dagegen tun."
              intro="Diese vier Sätze stammen nicht von uns. Es sind die Beschwerden, die Verbraucherschützer über ambulante Dienste am häufigsten hören. Wir schreiben sie hier hin, weil man ein Misstrauen nicht auflöst, indem man es übergeht."
            />
            <dl className="m-0">
              {klartext.map((k) => (
                <div key={k.fear} className="border-t border-line py-6 first:border-t-0 first:pt-0">
                  <dt className="text-lg font-bold text-brand-ink">
                    {/* The quotation marks matter: this is reported speech,
                        not the client's own claim. */}
                    „{k.fear}“
                  </dt>
                  <dd className="m-0 mt-2.5 flex items-start gap-3 text-ink-muted">
                    <IconCheck className="mt-1 flex-none text-brand" />
                    <span>{k.answer}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 text-sm text-ink-muted">
              Quelle der Beschwerdelage:{' '}
              <a href={KLARTEXT_SOURCE.href} className="linkish" rel="noopener noreferrer" target="_blank">
                {KLARTEXT_SOURCE.label}
                <span className="sr-only"> (öffnet in neuem Tab)</span>
              </a>
            </p>
          </div>

          <figure className="figure m-0 self-start lg:sticky lg:top-28">
            <div className="frame frame--plate">
              <Photo
                name="beratung"
                widths={[600, 900, 1400]}
                ratio={3 / 2}
                sizes="(min-width: 64rem) 34vw, 100vw"
                alt="Zwei ältere Frauen sitzen an einem Tisch bei Kaffee und sprechen miteinander."
              />
            </div>
            <figcaption>{PHOTO_CREDIT.caption}</figcaption>
          </figure>
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
        <div className="shell grid gap-x-14 gap-y-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <figure className="figure m-0 self-start lg:sticky lg:top-28">
            <div className="frame frame--plate">
              <Photo
                name="betreuung"
                widths={[600, 900, 1400]}
                ratio={3 / 2}
                sizes="(min-width: 64rem) 30vw, 100vw"
                alt="Eine ältere Frau strickt in ihrem Sessel und blickt zu jemandem auf, der neben ihr sitzt."
              />
            </div>
            <figcaption>{PHOTO_CREDIT.caption}</figcaption>
          </figure>

          <div>
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

          <figure className="figure m-0">
            <div className="frame frame--plate">
              <Photo
                name="haltung"
                widths={[480, 720, 1000]}
                ratio={4 / 5}
                sizes="(min-width: 64rem) 32vw, 100vw"
                alt="Ein älterer Mann mit Brille sitzt am Fenster und blickt nach oben, während er spricht."
              />
            </div>
            <figcaption>{PHOTO_CREDIT.caption}</figcaption>
          </figure>
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
