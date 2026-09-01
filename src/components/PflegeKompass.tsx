'use client';

import { useId, useRef, useState } from 'react';
import Link from 'next/link';
import { grades, euro, type Pflegegrad } from '@/content/pflege';
import { services } from '@/content/services';
import { areas } from '@/content/areas';
import { business } from '@/content/business';
import { IconArrow, IconCheck, IconPhone, IconAlert } from './Icons';
import { track } from '@/lib/analytics';

/**
 * PFLEGE-KOMPASS — the signature element of this site.
 *
 * Why it exists: the question every family actually arrives with is not "what
 * services do you offer", it is "what am I entitled to, and what does it cost
 * me". Every competitor answers that with a wall of paragraphs. This answers it
 * in three questions with the real statutory figures.
 *
 * It is progressive enhancement, not a gate: the same numbers are rendered as a
 * complete static table further down /pflegegrade-und-kosten, so a visitor
 * without JavaScript loses convenience and nothing else.
 *
 * Accessibility: each step is a fieldset with a legend, choices are real radio
 * and checkbox inputs (so keyboard and screen-reader behaviour is the platform's,
 * not ours), the result is announced via aria-live, and focus moves to the new
 * step heading on every transition.
 */

type Need = 'koerper' | 'medizin' | 'betreuung' | 'haushalt' | 'vertretung';

const NEEDS: { id: Need; label: string; hint: string; serviceSlug: string }[] = [
  { id: 'koerper',    label: 'Hilfe bei der Körperpflege',      hint: 'Waschen, Anziehen, Aufstehen, Toilettengang', serviceSlug: 'grundpflege' },
  { id: 'medizin',    label: 'Ärztlich verordnete Maßnahmen',   hint: 'Medikamente, Spritzen, Verbände, Blutzucker', serviceSlug: 'behandlungspflege' },
  { id: 'betreuung',  label: 'Begleitung und Gesellschaft',     hint: 'Gespräche, Spaziergänge, Beschäftigung',      serviceSlug: 'betreuung-und-entlastung' },
  { id: 'haushalt',   label: 'Unterstützung im Haushalt',       hint: 'Einkaufen, Kochen, Reinigen, Wäsche',         serviceSlug: 'hauswirtschaft' },
  { id: 'vertretung', label: 'Vertretung für Angehörige',       hint: 'Bei Urlaub oder Krankheit der Pflegeperson',  serviceSlug: 'verhinderungspflege' },
];

type GradChoice = Pflegegrad | 'unbekannt' | 'keiner';

const GRAD_CHOICES: { value: GradChoice; label: string; sub: string }[] = [
  ...grades.map((g) => ({
    value: g.grad as GradChoice,
    label: `Pflegegrad ${g.grad}`,
    sub: g.summary,
  })),
  { value: 'keiner',    label: 'Kein Pflegegrad', sub: 'Es wurde noch keiner beantragt oder er wurde abgelehnt' },
  { value: 'unbekannt', label: 'Weiß ich nicht',  sub: 'Wir klären das gemeinsam im Gespräch' },
];

export default function PflegeKompass() {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [grad, setGrad] = useState<GradChoice | null>(null);
  const [needs, setNeeds] = useState<Need[]>([]);
  const [area, setArea] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const headingRef = useRef<HTMLParagraphElement>(null);

  const goto = (next: number) => {
    setStep(next);
    if (next < 3) track('kompass_step', { step: next + 1 });
    // Move focus to the new step so keyboard and screen-reader users are not
    // silently left at the bottom of the previous one.
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const begin = () => {
    if (started) return;
    setStarted(true);
    track('kompass_start');
  };

  const toggleNeed = (n: Need) => {
    begin();
    setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
  };

  const reset = () => { setStep(0); setGrad(null); setNeeds([]); setArea(null); };

  const gradData = typeof grad === 'number' ? grades.find((g) => g.grad === grad)! : null;
  const matched = services.filter((s) => needs.some((n) => NEEDS.find((x) => x.id === n)?.serviceSlug === s.slug));

  const stepLabels = ['Pflegegrad', 'Bedarf', 'Ort', 'Ergebnis'];

  return (
    <div className="overflow-hidden rounded-lg border-2 border-brand bg-white shadow-lifted">
      <div className="on-dark bg-brand px-5 py-4 text-white sm:px-7">
        <p className="m-0 text-sm font-bold uppercase tracking-[0.09em] text-sun-soft">
          Pflege-Kompass
        </p>
        <p className="m-0 text-xl font-bold">
          Drei Fragen — dann wissen Sie, was Ihnen zusteht.
        </p>
      </div>

      {/* Progress. Presented as an ordered list so it is meaningful without the
          visual styling, with the current step marked via aria-current. */}
      <ol className="m-0 flex list-none gap-0 border-b border-line p-0">
        {stepLabels.map((label, i) => (
          <li key={label} className="flex-1">
            <span
              aria-current={i === step ? 'step' : undefined}
              className={`flex h-full flex-col items-center justify-center gap-0.5 border-b-4 px-1 py-2.5 text-center text-xs font-bold sm:text-sm ${
                i === step
                  ? 'border-sun text-brand-ink'
                  : i < step
                    ? 'border-brand text-brand'
                    : 'border-line text-ink-muted'
              }`}
            >
              <span className="tabular-nums">{i + 1}</span>
              <span>{label}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="px-5 py-6 sm:px-7">
        <p
          ref={headingRef}
          tabIndex={-1}
          className="m-0 mb-4 text-2xl font-bold leading-tight text-brand-ink outline-none"
        >
          {step === 0 && 'Welcher Pflegegrad liegt vor?'}
          {step === 1 && 'Wobei wird Unterstützung gebraucht?'}
          {step === 2 && 'Wo soll gepflegt werden?'}
          {step === 3 && 'Das gilt für Ihre Situation'}
        </p>

        {/* ---------------------------------------------- Step 1: Pflegegrad */}
        {step === 0 && (
          <fieldset className="m-0 border-0 p-0">
            <legend className="sr-only">Pflegegrad auswählen</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {GRAD_CHOICES.map((c) => (
                <label
                  key={String(c.value)}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border-2 p-3.5 ${
                    grad === c.value
                      ? 'border-brand bg-[#eef2fb]'
                      : 'border-line hover:border-brand'
                  }`}
                >
                  <input
                    type="radio"
                    name={`${uid}-grad`}
                    className="mt-1 h-6 w-6 flex-none accent-brand"
                    checked={grad === c.value}
                    onChange={() => { begin(); setGrad(c.value); }}
                  />
                  <span>
                    <span className="block font-bold text-brand-ink">{c.label}</span>
                    <span className="block text-sm text-ink-muted">{c.sub}</span>
                  </span>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="btn btn--primary mt-5 w-full sm:w-auto"
              disabled={grad === null}
              onClick={() => goto(1)}
            >
              Weiter <IconArrow />
            </button>
          </fieldset>
        )}

        {/* -------------------------------------------------- Step 2: Bedarf */}
        {step === 1 && (
          <fieldset className="m-0 border-0 p-0">
            <legend className="sr-only">Bedarf auswählen — Mehrfachauswahl möglich</legend>
            <p className="mb-3 text-ink-muted">Mehrfachauswahl möglich.</p>
            <div className="grid gap-2.5">
              {NEEDS.map((n) => (
                <label
                  key={n.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border-2 p-3.5 ${
                    needs.includes(n.id)
                      ? 'border-brand bg-[#eef2fb]'
                      : 'border-line hover:border-brand'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-6 w-6 flex-none accent-brand"
                    checked={needs.includes(n.id)}
                    onChange={() => toggleNeed(n.id)}
                  />
                  <span>
                    <span className="block font-bold text-brand-ink">{n.label}</span>
                    <span className="block text-sm text-ink-muted">{n.hint}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn btn--secondary" onClick={() => goto(0)}>Zurück</button>
              <button
                type="button"
                className="btn btn--primary"
                disabled={needs.length === 0}
                onClick={() => goto(2)}
              >
                Weiter <IconArrow />
              </button>
            </div>
          </fieldset>
        )}

        {/* ----------------------------------------------------- Step 3: Ort */}
        {step === 2 && (
          <fieldset className="m-0 border-0 p-0">
            <legend className="sr-only">Ort auswählen</legend>
            <div className="grid gap-2.5">
              {[...areas.map((a) => ({ value: a.slug, label: a.city, sub: `${a.city} und Umgebung` })),
                { value: 'anderswo', label: 'Ein anderer Ort', sub: 'Wir sagen Ihnen ehrlich, ob wir hinkommen' }].map((c) => (
                <label
                  key={c.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-md border-2 p-3.5 ${
                    area === c.value
                      ? 'border-brand bg-[#eef2fb]'
                      : 'border-line hover:border-brand'
                  }`}
                >
                  <input
                    type="radio"
                    name={`${uid}-ort`}
                    className="mt-1 h-6 w-6 flex-none accent-brand"
                    checked={area === c.value}
                    onChange={() => setArea(c.value)}
                  />
                  <span>
                    <span className="block font-bold text-brand-ink">{c.label}</span>
                    <span className="block text-sm text-ink-muted">{c.sub}</span>
                  </span>
                </label>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn btn--secondary" onClick={() => goto(1)}>Zurück</button>
              <button
                type="button"
                className="btn btn--primary"
                disabled={area === null}
                onClick={() => {
                  goto(3);
                  track('kompass_result', { grad: String(grad), bedarf: needs.join('+') });
                }}
              >
                Ergebnis anzeigen <IconArrow />
              </button>
            </div>
          </fieldset>
        )}

        {/* -------------------------------------------------- Step 4: Result */}
        {step === 3 && (
          <div aria-live="polite">
            {gradData ? (
              <>
                <p className="measure m-0 text-lg">
                  Bei <strong>Pflegegrad {gradData.grad}</strong> übernimmt die Pflegekasse
                  monatlich bis zu{' '}
                  <strong className="whitespace-nowrap">{euro(gradData.sachleistung)}</strong>{' '}
                  {gradData.sachleistung === 0
                    ? '— Sachleistungen sind hier nicht vorgesehen.'
                    : 'für die Pflege durch einen Dienst wie uns.'}
                </p>
                <dl className="mt-5 grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3">
                  {[
                    { t: 'Pflegesachleistung', v: euro(gradData.sachleistung), s: 'pro Monat, §36 SGB XI' },
                    { t: 'Entlastungsbetrag', v: euro(gradData.entlastungsbetrag), s: 'pro Monat, §45b SGB XI' },
                    {
                      t: 'Verhinderungs- & Kurzzeitpflege',
                      v: gradData.jahresbetrag ? euro(gradData.jahresbetrag) : '—',
                      s: gradData.jahresbetrag ? 'pro Kalenderjahr, §39 SGB XI' : 'ab Pflegegrad 2',
                    },
                  ].map((x) => (
                    <div key={x.t} className="bg-white p-4">
                      <dt className="text-sm font-bold text-ink-muted">{x.t}</dt>
                      <dd className="m-0 text-2xl font-bold tabular-nums text-brand-ink">{x.v}</dd>
                      <p className="m-0 text-xs text-ink-muted">{x.s}</p>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <div className="notice notice--ok flex gap-3">
                <IconAlert className="mt-0.5 flex-none" />
                <p className="m-0">
                  {grad === 'keiner'
                    ? 'Ohne Pflegegrad zahlt die Pflegekasse keine Sachleistungen — ärztlich verordnete Behandlungspflege läuft aber unabhängig davon über die Krankenkasse. Und einen Pflegegrad zu beantragen ist einfacher, als die meisten denken. Wir zeigen Ihnen, wie.'
                    : 'Kein Problem — den Pflegegrad klären wir gemeinsam. Für ärztlich verordnete Behandlungspflege brauchen Sie ohnehin keinen.'}
                </p>
              </div>
            )}

            {matched.length > 0 && (
              <div className="mt-6">
                <p className="m-0 mb-2.5 font-bold text-brand-ink">
                  Diese Leistungen passen zu dem, was Sie angegeben haben:
                </p>
                <ul className="m-0 list-none space-y-2 p-0">
                  {matched.map((s) => (
                    <li key={s.slug} className="flex items-start gap-2.5">
                      <IconCheck className="mt-1 flex-none text-brand" />
                      <span>
                        <Link href={`/leistungen/${s.slug}`} className="linkish font-bold">{s.name}</Link>
                        <span className="block text-sm text-ink-muted">{s.payer}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {area === 'anderswo' && (
              <p className="measure mt-5 rounded-md bg-paper-warm p-4 text-ink">
                Ihr Ort liegt außerhalb unserer beiden Standorte. Ob wir Sie anfahren können,
                sagen wir Ihnen im Gespräch — und wenn nicht, sagen wir Ihnen, wen Sie
                stattdessen fragen sollten.
              </p>
            )}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {/* The answers travel into the contact form so nobody retypes them. */}
              <Link
                href={{
                  pathname: '/kontakt',
                  query: {
                    grad: String(grad),
                    bedarf: needs.join(','),
                    ort: area ?? '',
                  },
                }}
                className="btn btn--primary"
                onClick={() => track('primary_cta_click', { placement: 'kompass_result', label: 'Beratung' })}
              >
                Kostenlose Beratung anfragen
              </Link>
              <a
                href={business.phone.href}
                className="btn btn--secondary"
                onClick={() => track('phone_click', { placement: 'kompass_result' })}
              >
                <IconPhone />
                {business.phone.display}
              </a>
              <button type="button" className="btn btn--secondary sm:ml-auto" onClick={reset}>
                Neu starten
              </button>
            </div>

            <p className="mt-5 text-sm text-ink-muted">
              Angaben nach den Leistungsbeträgen der Pflegeversicherung für 2026. Sie sind
              eine Orientierung, keine verbindliche Zusage Ihrer Pflegekasse.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
