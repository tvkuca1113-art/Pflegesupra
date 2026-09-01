/**
 * Shared shape and validation for both forms.
 *
 * The same rules run in the browser (for immediate, useful error messages) and
 * on the server (because client-side validation is a convenience, never a
 * control). Keeping them in one module is what stops the two from drifting.
 */

export type InquiryKind = 'beratung' | 'bewerbung';

export interface InquiryInput {
  kind: InquiryKind;
  firstName?: string;
  lastName: string;
  email: string;
  phone?: string;
  topic?: string;
  message: string;
  consent: boolean;
  position?: string;
  kompassGrad?: string;
  kompassBedarf?: string;
  kompassOrt?: string;
  sourcePath?: string;
  /** Honeypot — must stay empty. Real users never see it. */
  website?: string;
  /** Milliseconds the form was on screen before submission. */
  elapsedMs?: number;
}

export type FieldErrors = Partial<Record<keyof InquiryInput, string>>;

const EMAIL = /^[^@\s]+@[^@\s]+\.[a-zA-Z]{2,}$/;

export const LIMITS = {
  lastName: 120,
  firstName: 120,
  email: 320,
  phone: 40,
  topic: 120,
  message: 5000,
  position: 120,
} as const;

/**
 * Error messages say what to do, not what went wrong — WCAG 3.3.3, and
 * plain German for a reader who may be filling this in at a difficult moment.
 */
export function validateInquiry(input: Partial<InquiryInput>): FieldErrors {
  const e: FieldErrors = {};

  if (!input.lastName?.trim()) {
    e.lastName = 'Bitte tragen Sie Ihren Nachnamen ein.';
  } else if (input.lastName.trim().length > LIMITS.lastName) {
    e.lastName = `Bitte höchstens ${LIMITS.lastName} Zeichen.`;
  }

  if (!input.email?.trim()) {
    e.email = 'Bitte tragen Sie Ihre E-Mail-Adresse ein, damit wir antworten können.';
  } else if (!EMAIL.test(input.email.trim())) {
    e.email = 'Diese E-Mail-Adresse sieht nicht vollständig aus. Beispiel: name@beispiel.de';
  } else if (input.email.trim().length > LIMITS.email) {
    e.email = 'Diese E-Mail-Adresse ist zu lang.';
  }

  if (input.phone && input.phone.trim().length > LIMITS.phone) {
    e.phone = 'Bitte höchstens 40 Zeichen.';
  }

  if (!input.message?.trim()) {
    e.message = 'Bitte beschreiben Sie kurz, worum es geht — ein oder zwei Sätze genügen.';
  } else if (input.message.trim().length > LIMITS.message) {
    e.message = `Bitte höchstens ${LIMITS.message} Zeichen.`;
  }

  if (input.consent !== true) {
    e.consent = 'Bitte bestätigen Sie die Datenschutzerklärung, damit wir Ihre Anfrage bearbeiten dürfen.';
  }

  return e;
}

export const hasErrors = (e: FieldErrors) => Object.keys(e).length > 0;

/** Topics offered on the care enquiry form. Free text stays possible. */
export const TOPICS = [
  'Pflege für ein Familienmitglied',
  'Pflege für mich selbst',
  'Behandlungspflege nach ärztlicher Verordnung',
  'Vertretung für pflegende Angehörige',
  'Frage zu Kosten und Abrechnung',
  'Etwas anderes',
] as const;

export const POSITIONS = [
  'Pflegefachkraft (examiniert)',
  'Pflegehelfer/in',
  'Betreuungskraft (§43b SGB XI)',
  'Hauswirtschaftliche Kraft',
  'Ausbildung oder Praktikum',
  'Initiativbewerbung',
] as const;
