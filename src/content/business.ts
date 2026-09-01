/**
 * Single source of truth for verified business facts.
 *
 * Every value here was taken from a source the client controls (the live site's
 * Impressum / Kontakt / FAQ pages, retrieved 2026-09-01) or from a primary
 * public authority. Nothing in this file is invented. Items the client still
 * has to confirm are marked UNVERIFIED and are NOT rendered anywhere.
 */

export const business = {
  legalName: 'Supra ambulanter Pflegedienst',
  owner: 'Izo Jasarevic',
  ownerShort: 'I. Jasarevic',
  // Source: supra-pd.de/impressum/ (2026-09-01)
  founded: 2022, // Source: supra-pd.de FAQ – "seit 2022 als eigenständiger Pflegedienst"

  phone: { display: '089 189 39 716', href: 'tel:+498918939716' },
  fax: '089 189 39 717',
  email: 'info@supra-pd.de',
  whatsapp: 'https://wa.me/498918939716',

  locations: [
    {
      id: 'muenchen',
      role: 'Hauptsitz',
      city: 'München',
      street: 'Zielstattstr. 10a',
      postalCode: '81379',
      district: 'Sendling-Westpark',
      slug: 'muenchen',
    },
    {
      id: 'pfaffenhofen',
      role: 'Zweigstelle',
      city: 'Pfaffenhofen a.d. Ilm',
      street: 'Türltorstr. 4',
      postalCode: '85276',
      district: null,
      slug: 'pfaffenhofen-an-der-ilm',
    },
  ],

  /**
   * Taken from the Organization schema the client publishes on supra-pd.de.
   * These are *office / telephone* hours, not care times — an ambulanter
   * Pflegedienst delivers care outside them. Labelled accordingly on the site.
   * FLAGGED FOR CLIENT CONFIRMATION.
   */
  officeHours: { days: 'Montag bis Sonntag', from: '09:00', to: '17:00' },

  /** Client's own wording, supra-pd.de/impressum/ (2026-09-01). */
  approval: 'Zugelassener Pflegedienst nach SGB XI',
} as const;

/**
 * Claims deliberately NOT made anywhere on this site, because no source the
 * client controls supports them yet. Listed so nobody "fills them in" later
 * without evidence.
 */
export const unverified = [
  'Anzahl der Mitarbeiterinnen und Mitarbeiter',
  'Anzahl betreuter Klientinnen und Klienten',
  'Kundenbewertungen, Sterne-Bewertungen und Testimonials',
  'Zertifikate, Auszeichnungen, MDK-/MD-Prüfnoten',
  'Konkrete Reaktionszeiten ("innerhalb von X Stunden")',
  'Pflegekassen-Vertragspartner im Einzelnen',
] as const;

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://supra-pd.de';

export function fullAddress(loc: (typeof business.locations)[number]) {
  return `${loc.street}, ${loc.postalCode} ${loc.city}`;
}
