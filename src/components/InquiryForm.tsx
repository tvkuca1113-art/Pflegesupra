'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  validateInquiry, hasErrors, LIMITS, TOPICS, POSITIONS,
  type FieldErrors, type InquiryInput, type InquiryKind,
} from '@/lib/inquiry';
import { IconAlert, IconCheck, IconPhone } from './Icons';
import { business } from '@/content/business';
import { track } from '@/lib/analytics';

/**
 * The form the whole site exists to fill.
 *
 * Accessibility decisions worth keeping:
 *  - Errors are announced through a single role="alert" summary that lists every
 *    problem as a link to the field, and each field also carries its own message
 *    via aria-describedby. A screen-reader user hears what is wrong and can jump
 *    straight to it (WCAG 3.3.1, 3.3.3).
 *  - Validation runs on submit, not on blur. Being told a field is wrong before
 *    you have finished typing it is hostile, especially to slower typists.
 *  - Nothing is validated with colour alone: every error has an icon and text.
 *  - On success, focus moves to the confirmation so it is not silently missed.
 */
export default function InquiryForm({ kind = 'beratung' }: { kind?: InquiryKind }) {
  const uid = useId();
  const pathname = usePathname();
  const params = useSearchParams();

  const [values, setValues] = useState<Partial<InquiryInput>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [failure, setFailure] = useState<string | null>(null);
  const [started, setStarted] = useState(false);

  const mountedAt = useRef(Date.now());
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const isJob = kind === 'bewerbung';

  // Answers from the Pflege-Kompass arrive as query parameters so nobody has to
  // type them a second time. They are shown back, not hidden, so the visitor can
  // see exactly what is being sent.
  const kompass = {
    grad: params.get('grad') ?? undefined,
    bedarf: params.get('bedarf') ?? undefined,
    ort: params.get('ort') ?? undefined,
  };
  const hasKompass = Boolean(kompass.grad || kompass.bedarf || kompass.ort);

  useEffect(() => {
    if (state === 'done') doneRef.current?.focus();
  }, [state]);

  const set = (k: keyof InquiryInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (!started) {
      setStarted(true);
      track(isJob ? 'application_form_start' : 'contact_form_start');
    }
    const v = e.target.type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : e.target.value;
    setValues((cur) => ({ ...cur, [k]: v }));
    // Once a field has been corrected, drop its error immediately.
    setErrors((cur) => (cur[k] ? { ...cur, [k]: undefined } : cur));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateInquiry(values);
    if (hasErrors(found)) {
      setErrors(found);
      setState('idle');
      track(isJob ? 'application_form_error' : 'contact_form_error', { reason: 'validation' });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setState('sending');
    setFailure(null);
    try {
      const res = await fetch('/api/anfrage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          kind,
          kompassGrad: kompass.grad,
          kompassBedarf: kompass.bedarf,
          kompassOrt: kompass.ort,
          sourcePath: pathname,
          elapsedMs: Date.now() - mountedAt.current,
        } satisfies Partial<InquiryInput> & { elapsedMs: number }),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        if (res.status === 422 && json.errors) {
          setErrors(json.errors);
          setState('idle');
          requestAnimationFrame(() => summaryRef.current?.focus());
          track(isJob ? 'application_form_error' : 'contact_form_error', { reason: 'validation_server' });
          return;
        }
        setFailure(
          res.status === 429
            ? 'Es wurden gerade sehr viele Anfragen gesendet. Bitte versuchen Sie es in ein paar Minuten noch einmal — oder rufen Sie uns direkt an.'
            : 'Ihre Anfrage konnte nicht gespeichert werden. Das liegt an uns, nicht an Ihnen. Bitte rufen Sie uns an oder versuchen Sie es später erneut.',
        );
        setState('failed');
        track(isJob ? 'application_form_error' : 'contact_form_error', { reason: json.error ?? 'server' });
        return;
      }

      setState('done');
      formRef.current?.reset();
      track(
        isJob ? 'application_form_submit' : 'contact_form_submit',
        isJob ? { position: values.position } : { topic: values.topic },
      );
    } catch {
      setFailure('Die Verbindung ist abgebrochen. Bitte prüfen Sie Ihre Internetverbindung oder rufen Sie uns an.');
      setState('failed');
      track(isJob ? 'application_form_error' : 'contact_form_error', { reason: 'network' });
    }
  };

  if (state === 'done') {
    return (
      <div
        ref={doneRef}
        tabIndex={-1}
        className="notice notice--ok outline-none"
        role="status"
      >
        <h2 className="flex items-center gap-2.5 text-[var(--text-2xl)] text-[var(--color-ok)]">
          <IconCheck />
          {isJob ? 'Ihre Bewerbung ist angekommen.' : 'Ihre Anfrage ist angekommen.'}
        </h2>
        <p className="measure mt-3 text-[var(--color-ink)]">
          Wir melden uns bei Ihnen. Wenn es dringend ist, rufen Sie bitte direkt an — das
          geht immer schneller als jedes Formular.
        </p>
        <a href={business.phone.href} className="btn btn--primary mt-5">
          <IconPhone />
          {business.phone.display}
        </a>
      </div>
    );
  }

  const errorList = (Object.entries(errors) as [keyof InquiryInput, string | undefined][])
    .filter(([, v]) => Boolean(v));

  const describe = (field: keyof InquiryInput, hintId?: string) =>
    [errors[field] ? `${uid}-${field}-err` : null, hintId].filter(Boolean).join(' ') || undefined;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate>
      {/* Error summary. Focusable so it can receive focus after a failed submit. */}
      {errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="notice notice--err mb-7 outline-none"
        >
          <p className="m-0 flex items-center gap-2 font-bold">
            <IconAlert />
            {errorList.length === 1
              ? 'Eine Angabe fehlt noch:'
              : `${errorList.length} Angaben fehlen noch:`}
          </p>
          <ul className="m-0 mt-2 list-disc space-y-1 pl-5">
            {errorList.map(([field, msg]) => (
              <li key={field}>
                <a href={`#${uid}-${field}`} className="underline">{msg}</a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state === 'failed' && failure && (
        <div role="alert" className="notice notice--err mb-7">
          <p className="m-0 flex items-start gap-2 font-bold">
            <IconAlert className="mt-1 flex-none" />
            {failure}
          </p>
          <a href={business.phone.href} className="btn btn--primary mt-4">
            <IconPhone />
            {business.phone.display}
          </a>
        </div>
      )}

      {hasKompass && (
        <div className="mb-7 rounded-[var(--radius-md)] border-l-4 border-[var(--color-brand)] bg-[var(--color-paper)] p-4">
          <p className="m-0 font-bold text-[var(--color-brand-ink)]">Aus dem Pflege-Kompass übernommen</p>
          <ul className="m-0 mt-2 list-none space-y-1 p-0 text-[var(--color-ink-muted)]">
            {kompass.grad ? <li>Pflegegrad: {kompass.grad}</li> : null}
            {kompass.bedarf ? <li>Bedarf: {kompass.bedarf.split(',').join(', ')}</li> : null}
            {kompass.ort ? <li>Ort: {kompass.ort}</li> : null}
          </ul>
          <p className="m-0 mt-2 text-[var(--text-sm)] text-[var(--color-ink-muted)]">
            Diese Angaben werden mitgeschickt, damit wir vorbereitet zurückrufen.
          </p>
        </div>
      )}

      <div className="grid gap-x-6 sm:grid-cols-2">
        <div className="field">
          <label className="field__label" htmlFor={`${uid}-firstName`}>Vorname</label>
          <span className="field__hint" id={`${uid}-firstName-hint`}>Optional</span>
          <input
            id={`${uid}-firstName`}
            name="firstName"
            type="text"
            autoComplete="given-name"
            maxLength={LIMITS.firstName}
            className="field__control"
            aria-describedby={`${uid}-firstName-hint`}
            onChange={set('firstName')}
          />
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${uid}-lastName`}>
            Nachname <span className="text-[var(--color-err)]" aria-hidden="true">*</span>
            <span className="sr-only">(Pflichtfeld)</span>
          </label>
          <input
            id={`${uid}-lastName`}
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            maxLength={LIMITS.lastName}
            className="field__control"
            aria-invalid={errors.lastName ? true : undefined}
            aria-describedby={describe('lastName')}
            onChange={set('lastName')}
          />
          {errors.lastName && (
            <p className="field__error" id={`${uid}-lastName-err`}>
              <IconAlert className="flex-none" />{errors.lastName}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${uid}-email`}>
            E-Mail-Adresse <span className="text-[var(--color-err)]" aria-hidden="true">*</span>
            <span className="sr-only">(Pflichtfeld)</span>
          </label>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email}
            className="field__control"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe('email')}
            onChange={set('email')}
          />
          {errors.email && (
            <p className="field__error" id={`${uid}-email-err`}>
              <IconAlert className="flex-none" />{errors.email}
            </p>
          )}
        </div>

        <div className="field">
          <label className="field__label" htmlFor={`${uid}-phone`}>Telefonnummer</label>
          <span className="field__hint" id={`${uid}-phone-hint`}>
            Optional — aber ein Rückruf klärt meist mehr als eine E-Mail.
          </span>
          <input
            id={`${uid}-phone`}
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={LIMITS.phone}
            className="field__control"
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describe('phone', `${uid}-phone-hint`)}
            onChange={set('phone')}
          />
          {errors.phone && (
            <p className="field__error" id={`${uid}-phone-err`}>
              <IconAlert className="flex-none" />{errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${uid}-${isJob ? 'position' : 'topic'}`}>
          {isJob ? 'Worauf bewerben Sie sich?' : 'Worum geht es?'}
        </label>
        <select
          id={`${uid}-${isJob ? 'position' : 'topic'}`}
          name={isJob ? 'position' : 'topic'}
          className="field__control"
          defaultValue=""
          onChange={set(isJob ? 'position' : 'topic')}
        >
          <option value="">Bitte auswählen</option>
          {(isJob ? POSITIONS : TOPICS).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label className="field__label" htmlFor={`${uid}-message`}>
          {isJob ? 'Ihre Nachricht' : 'Was brauchen Sie?'}{' '}
          <span className="text-[var(--color-err)]" aria-hidden="true">*</span>
          <span className="sr-only">(Pflichtfeld)</span>
        </label>
        <span className="field__hint" id={`${uid}-message-hint`}>
          {isJob
            ? 'Qualifikation, gewünschter Umfang, ab wann. Zeugnisse brauchen wir jetzt noch nicht.'
            : 'Ein oder zwei Sätze genügen. Zum Beispiel: „Meine Mutter, 84, kommt Freitag aus der Klinik und braucht morgens Hilfe beim Waschen.“'}
        </span>
        <textarea
          id={`${uid}-message`}
          name="message"
          required
          maxLength={LIMITS.message}
          className="field__control"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe('message', `${uid}-message-hint`)}
          onChange={set('message')}
        />
        {errors.message && (
          <p className="field__error" id={`${uid}-message-err`}>
            <IconAlert className="flex-none" />{errors.message}
          </p>
        )}
      </div>

      {/* Honeypot. Hidden from sight and from assistive technology, and left out
          of the tab order, so no real user can reach it. */}
      <div aria-hidden="true" className="absolute h-px w-px overflow-hidden opacity-0">
        <label htmlFor={`${uid}-website`}>Bitte nicht ausfüllen</label>
        <input
          id={`${uid}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          onChange={set('website')}
        />
      </div>

      <div className="field field--check">
        <input
          id={`${uid}-consent`}
          name="consent"
          type="checkbox"
          required
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={describe('consent')}
          onChange={set('consent')}
        />
        <label htmlFor={`${uid}-consent`}>
          Ich habe die <Link href="/datenschutz" className="linkish">Datenschutzerklärung</Link>{' '}
          gelesen und bin damit einverstanden, dass meine Angaben zur Bearbeitung dieser
          Anfrage gespeichert werden.{' '}
          <span className="text-[var(--color-err)]" aria-hidden="true">*</span>
          <span className="sr-only">(Pflichtfeld)</span>
          {errors.consent && (
            <span className="field__error" id={`${uid}-consent-err`}>
              <IconAlert className="flex-none" />{errors.consent}
            </span>
          )}
        </label>
      </div>

      <button type="submit" className="btn btn--primary mt-3 w-full sm:w-auto" disabled={state === 'sending'}>
        {state === 'sending' ? 'Wird gesendet …' : isJob ? 'Bewerbung senden' : 'Anfrage senden'}
      </button>
      <p aria-live="polite" className="sr-only">
        {state === 'sending' ? 'Ihre Anfrage wird gesendet.' : ''}
      </p>

      <p className="mt-4 text-[var(--text-sm)] text-[var(--color-ink-muted)]">
        Mit <span aria-hidden="true">*</span> markierte Felder sind Pflichtfelder. Ihre Angaben
        gehen ausschließlich an uns und werden nicht für Werbung verwendet.
      </p>
    </form>
  );
}
