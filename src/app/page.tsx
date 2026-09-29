import Link from 'next/link';
import type { Metadata } from 'next';
import PflegeKompass from '@/components/PflegeKompass';
import HeroPhoto from '@/components/HeroPhoto';
import Photo from '@/components/Photo';
import { CtaBand, SectionHead, EditorialImage } from '@/components/Blocks';
import { IconPhone, IconArrow, IconCheck, IconPin } from '@/components/Icons';
import { business } from '@/content/business';
import { services } from '@/content/services';
import { areas } from '@/content/areas';
import { klartext } from '@/content/klartext';
import { pageMeta } from '@/lib/seo';
import { trackAttrs } from '@/lib/analytics';

export const metadata: Metadata = pageMeta({
  title: 'Ambulanter Pflegedienst München & Pfaffenhofen a.d. Ilm',
  description: 'Ambulanter Pflegedienst für München und Pfaffenhofen a.d. Ilm: Grundpflege, Behandlungspflege, Betreuung und Hauswirtschaft. Kostenloses Erstgespräch bei Ihnen zu Hause — 089 189 39 716.',
  path: '/',
});

const trustPoints = [
  { label: 'Zugelassen nach SGB XI', sub: 'Direkte Abrechnung mit Ihrer Kasse' },
  { label: 'Persönlich vor Ort', sub: 'München & Pfaffenhofen a. d. Ilm' },
  { label: 'Kostenloses Erstgespräch', sub: 'In Ruhe, bei Ihnen zu Hause' },
];
const steps = [
  { n: '01', t: 'Wir hören zu.', b: 'Sie erzählen uns, was Sie gerade beschäftigt. Gemeinsam klären wir den Bedarf und unser Einsatzgebiet.' },
  { n: '02', t: 'Wir lernen Sie kennen.', b: 'Beim kostenlosen Hausbesuch besprechen wir Ihren Alltag, Ihre Wünsche und die passende Unterstützung.' },
  { n: '03', t: 'Wir klären die Kosten.', b: 'Sie erfahren vorab, welche Leistungen die Kasse übernimmt und welche Kosten für Sie bleiben.' },
  { n: '04', t: 'Wir sind für Sie da.', b: 'Wir stimmen Besuchszeiten und Leistungen mit Ihnen ab. Dann beginnt die Pflege bei Ihnen zu Hause.' },
];
const serviceIntros: Record<string, string> = {
  grundpflege: 'Hilfe beim Waschen, Anziehen und Aufstehen. So viel Unterstützung, wie Sie brauchen.',
  behandlungspflege: 'Medikamente, Verbände und ärztlich verordnete Pflege. Fachgerecht bei Ihnen zu Hause.',
  'betreuung-und-entlastung': 'Ein Gespräch. Ein Spaziergang. Jemand, der da ist — und Angehörige entlastet.',
  hauswirtschaft: 'Unterstützung beim Einkaufen, Kochen und im Haushalt. Damit Ihr Alltag weiterläuft.',
};

export default function Home() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <HeroPhoto />
        <div className="home-hero__wash" aria-hidden="true" />
        <div className="shell home-hero__inner">
          <div className="home-hero__copy">
            <p className="home-hero__eyebrow"><span aria-hidden="true" /> Ambulante Pflege mit Supra</p>
            <h1 id="home-title"><span>Zuhause bleiben.</span><span>Gut begleitet.</span></h1>
            <p className="home-hero__location">In München &amp; Pfaffenhofen a. d. Ilm</p>
            <p className="home-hero__lead">Vertraute Räume. Ihr eigener Rhythmus. Wir unterstützen Sie mit der Pflege, die zu Ihrem Leben passt — und sind auch für Ihre Angehörigen da.</p>
            <div className="home-hero__actions">
              <Link href="/kontakt" className="btn btn--primary" {...trackAttrs('primary_cta_click', { placement: 'hero', label: 'Beratung' })}>
                Kostenlos beraten lassen <IconArrow />
              </Link>
              <a href={business.phone.href} className="home-hero__phone" {...trackAttrs('phone_click', { placement: 'hero' })}>
                <IconPhone /><span><small>Einfach anrufen</small>{business.phone.display}</span>
              </a>
            </div>
            <p className="home-hero__reassurance"><IconCheck /> Unverbindlich. Persönlich. Bei Ihnen zu Hause.</p>
            <span id="mobile-bar-sentinel" aria-hidden="true" />
          </div>
        </div>
        <div className="home-hero__foot">
          <div className="shell home-hero__foot-inner">
            <a href="#leistungen" className="home-hero__explore">Entdecken Sie unsere Leistungen <IconArrow /></a>
            <span className="home-hero__caption">Die kleinen Momente machen den Unterschied. <small>Symbolbild</small></span>
          </div>
        </div>
      </section>

      <section className="home-trust" aria-label="Gut zu wissen">
        <ul className="shell">
          {trustPoints.map((p) => <li key={p.label}><IconCheck /><span><strong>{p.label}</strong><small>{p.sub}</small></span></li>)}
        </ul>
      </section>

      <section id="leistungen" className="section home-services">
        <div className="shell">
          <div className="home-section-heading">
            <SectionHead eyebrow="Was wir für Sie tun" title="Ihr Alltag. Unsere Unterstützung." intro="Manchmal braucht es ein wenig Hilfe. Manchmal etwas mehr. Gemeinsam finden wir heraus, was Ihnen zu Hause guttut." />
            <Link href="/leistungen" className="home-text-link">Alle Leistungen <IconArrow /></Link>
          </div>
          <div className="home-service-grid">
            {services.filter((s) => s.photo).map((s, i) => (
              <article className="home-service" key={s.slug}>
                <Link href={`/leistungen/${s.slug}`} className="home-service__link">
                  <div className="home-service__image">
                    <Photo name={s.photo!.name} widths={[600, 900, 1400]} ratio={3 / 2} sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 50vw, 100vw" alt={`${s.photo!.alt}. Symbolbild.`} />
                    <span className="home-service__number" aria-hidden="true">0{i + 1}</span>
                  </div>
                  <div className="home-service__body">
                    <h3>{s.name}</h3>
                    <p>{serviceIntros[s.slug]}</p>
                    <span className="home-text-link">Mehr erfahren <IconArrow /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
          <div className="home-relief">
            <div><h3>Auch wer pflegt, braucht mal eine Pause.</h3><p>Mit Verhinderungspflege unterstützen wir Sie, wenn Ihre gewohnte Pflegeperson ausfällt.</p></div>
            <Link href="/leistungen/verhinderungspflege" className="home-text-link">Verhinderungspflege kennenlernen <IconArrow /></Link>
          </div>
        </div>
      </section>

      <section className="home-story" aria-labelledby="story-title">
        <div className="home-story__visual">
          <Photo name="beratung" widths={[600, 900, 1400]} ratio={3 / 2} sizes="(min-width: 64rem) 55vw, 100vw" alt="Pflegeberatung mit einer Seniorin und ihrer Angehörigen zu Hause. Symbolbild." />
          <span className="home-story__caption">Zuhören ist der Anfang guter Pflege. <small>Symbolbild</small></span>
        </div>
        <div className="home-story__copy">
          <p className="eyebrow">Was uns wichtig ist</p>
          <h2 id="story-title">Ihr Zuhause.<br />Ihr Leben.<br /><span>Unser offenes Ohr.</span></h2>
          <p>Pflege beginnt für uns mit einem Menschen und seiner Geschichte. Mit Gewohnheiten, die bleiben dürfen. Und mit dem Wunsch, den Alltag weiterhin selbst zu gestalten.</p>
          <p>Wir lernen Sie kennen, besprechen die Möglichkeiten und unterstützen dort, wo Sie uns brauchen. Was Sie selbst können, bleibt in Ihren Händen.</p>
          <Link href="/ueber-uns" className="home-text-link">Lernen Sie Supra kennen <IconArrow /></Link>
        </div>
      </section>

      <section id="pflege-kompass" className="section section--night on-dark home-compass">
        <div className="shell home-compass__grid">
          <div className="home-compass__intro">
            <p className="eyebrow text-sun">Ihr Pflege-Kompass</p>
            <h2>Ein bisschen Klarheit.<br />Ein guter Anfang.</h2>
            <p>Welcher Pflegegrad? Welche Unterstützung? An welchem Ort? Drei kurze Fragen helfen Ihnen, sich zu orientieren.</p>
            <ul><li><IconCheck /> Ohne Anmeldung</li><li><IconCheck /> In Ihrem eigenen Tempo</li><li><IconCheck /> Persönliche Beratung als nächster Schritt</li></ul>
            <p className="home-compass__note">Die Angaben dienen der Orientierung. Ihre persönliche Situation klären wir gemeinsam im Gespräch.</p>
          </div>
          <div className="home-compass__tool"><PflegeKompass /></div>
        </div>
      </section>

      <section className="section home-process">
        <div className="shell">
          <SectionHead eyebrow="So einfach beginnt es" title="Ein erster Anruf. Ein gemeinsamer Weg." intro="Sie müssen noch nicht auf alles eine Antwort haben. Wir gehen die nächsten Schritte mit Ihnen." />
          <ol className="home-steps">{steps.map((s) => <li key={s.n}><span className="home-steps__number">{s.n}</span><h3>{s.t}</h3><p>{s.b}</p></li>)}</ol>
          <Link href="/ablauf" className="home-text-link">Den Ablauf kennenlernen <IconArrow /></Link>
        </div>
      </section>

      <section className="section home-questions">
        <div className="shell home-questions__grid">
          <div>
            <SectionHead eyebrow="In Ruhe entscheiden" title="Gute Pflege beginnt mit guten Antworten." intro="Wer kommt zu uns? Was kostet die Unterstützung? Ihre Fragen verdienen klare Antworten." />
            <Link href="/fragen-und-antworten" className="home-text-link">Weitere Fragen &amp; Antworten <IconArrow /></Link>
          </div>
          <div className="home-faq">{klartext.map((k, i) => <details key={k.fear} open={i === 0}><summary>{k.fear}<span aria-hidden="true">+</span></summary><p>{k.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="section home-locations">
        <div className="shell">
          <SectionHead eyebrow="Persönlich in Ihrer Nähe" title="Zwei Standorte. Ein offenes Ohr." intro="Wir sind in München und Pfaffenhofen a. d. Ilm für Sie da. Ob wir Ihre Adresse anfahren können, klären wir gerne persönlich." />
          <ul className="home-location-grid">{areas.map((a) => {
            const loc = business.locations.find((l) => l.slug === a.slug)!;
            return <li key={a.slug}><IconPin /><span className="eyebrow">{loc.role}</span><h3>Pflege in {a.city}</h3><p>{loc.street}<br />{loc.postalCode} {loc.city}</p><Link href={`/einsatzgebiet/${a.slug}`} className="home-text-link">Standort kennenlernen <IconArrow /></Link></li>;
          })}</ul>
        </div>
      </section>

      <section className="home-career">
        <div className="home-career__image"><EditorialImage name="karriere" widths={[600, 900, 1400]} ratio={3 / 2} sizes="(min-width: 64rem) 50vw, 100vw" alt="Pflegekräfte im kollegialen Austausch" /></div>
        <div className="home-career__copy"><p className="eyebrow">Für Pflegekräfte</p><h2>Gute Pflege braucht Menschen wie Sie.</h2><p>Sie wünschen sich ein Team, das zuhört, und einen Alltag, in dem Ihre Erfahrung zählt? Lernen Sie uns kennen.</p><Link href="/karriere" className="btn btn--primary">Arbeiten bei Supra <IconArrow /></Link></div>
      </section>
      <CtaBand />
    </>
  );
}
