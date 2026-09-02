/**
 * Event layer.
 *
 * Design rules, all enforced below rather than by convention:
 *
 * 1. NOTHING FIRES WITHOUT CONSENT. Events raised before the visitor has
 *    accepted statistics cookies are queued in memory, never persisted, and
 *    are flushed only if consent is later granted. Decline and the queue is
 *    dropped.
 * 2. NO PERSONAL DATA, EVER. Payloads are whitelisted to primitives and the
 *    sanitiser strips anything that looks like an address, e-mail or phone
 *    number. A form event may report *that* a form was submitted, never what
 *    was typed into it.
 * 3. The layer works with no analytics provider connected: events land in
 *    window.dataLayer so GTM/GA4 can consume them the moment the client
 *    supplies a measurement ID.
 */

export type EventName =
  // Primary conversions
  | 'phone_click'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'contact_form_error'
  | 'application_form_start'
  | 'application_form_submit'
  | 'application_form_error'
  // Secondary conversions
  | 'email_click'
  | 'whatsapp_click'
  | 'primary_cta_click'
  // Engagement — tells us whether the signature tool actually helps
  | 'kompass_start'
  | 'kompass_step'
  | 'kompass_result'
  | 'faq_open'
  | 'consent_decision';

/**
 * Business question each event answers, and the parameters it may carry.
 * Anything not listed here is dropped by `sanitise`.
 */
export const EVENT_SPEC: Record<EventName, { question: string; params: string[] }> = {
  phone_click:            { question: 'Wie viele Anrufe erzeugt die Seite, und von welcher Position aus?', params: ['placement'] },
  contact_form_start:     { question: 'Wie viele Menschen beginnen das Formular, ohne es abzusenden?', params: [] },
  contact_form_submit:    { question: 'Wie viele Anfragen kommen tatsächlich an?', params: ['topic'] },
  contact_form_error:     { question: 'Woran scheitern Absendeversuche?', params: ['reason'] },
  application_form_start: { question: 'Erzeugt die Karriereseite Bewerbungen?', params: [] },
  application_form_submit:{ question: 'Wie viele Bewerbungen gehen ein?', params: ['position'] },
  application_form_error: { question: 'Woran scheitern Bewerbungen?', params: ['reason'] },
  email_click:            { question: 'Bevorzugen Besucher E-Mail statt Formular?', params: ['placement'] },
  whatsapp_click:         { question: 'Lohnt sich der WhatsApp-Kanal?', params: ['placement'] },
  primary_cta_click:      { question: 'Welche CTA-Position trägt die Konversion?', params: ['placement', 'label'] },
  kompass_start:          { question: 'Wird der Pflege-Kompass überhaupt benutzt?', params: [] },
  kompass_step:           { question: 'An welchem Schritt brechen Nutzer ab?', params: ['step'] },
  kompass_result:         { question: 'Führt der Kompass zu einer Anfrage?', params: ['grad', 'bedarf'] },
  faq_open:               { question: 'Welche Fragen beschäftigen Besucher wirklich?', params: ['id'] },
  consent_decision:       { question: 'Wie viele Besucher stimmen der Messung zu (Bias-Korrektur)?', params: ['choice'] },
};

const PII = /(@|\+?\d[\d\s/-]{6,}|stra(ß|ss)e|\bstr\.|\bweg\b|\bplatz\b)/i;

function sanitise(name: EventName, params: Record<string, unknown> = {}) {
  const allowed = EVENT_SPEC[name]?.params ?? [];
  const out: Record<string, string | number> = {};
  for (const key of allowed) {
    const v = params[key];
    if (v === undefined || v === null) continue;
    if (typeof v === 'number') { out[key] = v; continue; }
    const s = String(v).slice(0, 60);
    // A parameter that looks like contact data never leaves the browser.
    if (PII.test(s)) continue;
    out[key] = s;
  }
  return out;
}

type QueuedEvent = { event: EventName; params: Record<string, string | number> };
let queue: QueuedEvent[] = [];
let granted = false;

declare global {
  interface Window { dataLayer?: Record<string, unknown>[] }
}

function push(e: QueuedEvent) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event: e.event, ...e.params });
}

export function track(name: EventName, params?: Record<string, unknown>) {
  if (!EVENT_SPEC[name]) return;
  const e = { event: name, params: sanitise(name, params) };
  // The consent decision itself must be recordable without consent —
  // it carries no identifier and is the only exception.
  if (!granted && name !== 'consent_decision') { queue.push(e); return; }
  push(e);
}

/** Called by the consent banner. Flushes or discards the queue accordingly. */
export function setAnalyticsConsent(value: boolean) {
  granted = value;
  if (value) { queue.forEach(push); }
  queue = [];
}

export function hasAnalyticsConsent() { return granted; }

/* --------------------------------------------------------------------------
   Delegated click tracking.

   A link that needs an onClick handler drags its whole component into the
   client bundle. The footer and the contact block are large, entirely static
   trees; making them client components purely so three links could report a
   click cost every page a hydration pass it did not need — measured at
   ~55 ms of blocking time on the home page under a 4x CPU slowdown.

   So the intent is declared in the markup instead and one listener on the
   document reads it. The components stay on the server, the events stay
   identical, and the sanitiser above still governs every payload.
   -------------------------------------------------------------------------- */

/** Props that mark an element for delegated tracking. Typed, so a wrong event
 *  name or an unknown parameter is a compile error, not a silent no-op. */
export function trackAttrs<N extends EventName>(
  name: N,
  params?: Record<string, string | number>,
) {
  return {
    'data-track': name,
    ...(params && Object.keys(params).length
      ? { 'data-track-params': JSON.stringify(params) }
      : {}),
  } as const;
}

let listening = false;

/** Installs the single document-level listener. Safe to call more than once. */
export function initClickTracking() {
  if (typeof document === 'undefined' || listening) return;
  listening = true;
  document.addEventListener(
    'click',
    (ev) => {
      const el = (ev.target as Element | null)?.closest?.('[data-track]');
      if (!el) return;
      const name = el.getAttribute('data-track') as EventName;
      if (!EVENT_SPEC[name]) return;
      let params: Record<string, unknown> = {};
      const raw = el.getAttribute('data-track-params');
      if (raw) {
        // Malformed markup must never break a link the visitor just clicked.
        try { params = JSON.parse(raw) as Record<string, unknown>; } catch { params = {}; }
      }
      track(name, params);
    },
    // Capture, so the event is recorded even if something downstream stops
    // propagation before it reaches the document.
    true,
  );
}

