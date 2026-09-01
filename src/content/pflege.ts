/**
 * Statutory care-insurance amounts.
 *
 * PRIMARY SOURCE: Bundesministerium für Gesundheit,
 * "Leistungsansprüche der Versicherten im Jahr 2026 an die Pflegeversicherung
 * im Kurzüberblick", Stand 04.11.2025.
 * https://www.bundesgesundheitsministerium.de/fileadmin/Dateien/3_Downloads/P/Pflegeversicherung_Leistungsbeitraege/Uebersicht_Leistungsbetraege_2026.pdf
 * Retrieved 2026-09-01.
 *
 * These are legal entitlements, not Supra's prices. Do not edit without
 * checking the current BMG document — the values change on Dynamisierung
 * (next one expected 01.01.2028).
 */

export const BENEFIT_SOURCE = {
  label: 'Bundesministerium für Gesundheit, Leistungsbeträge 2026 (Stand 04.11.2025)',
  url: 'https://www.bundesgesundheitsministerium.de/themen/pflege/online-ratgeber-pflege/leistungen-der-pflegeversicherung',
  validFor: 2026,
  checked: '2026-09-01',
} as const;

export type Pflegegrad = 1 | 2 | 3 | 4 | 5;

export interface GradBenefits {
  grad: Pflegegrad;
  /** Short description of the impairment level, per SGB XI. */
  summary: string;
  /** §36 SGB XI – care provided by a service like Supra. €/month. */
  sachleistung: number;
  /** §37 SGB XI – cash paid to the insured person who organises care privately. €/month. */
  pflegegeld: number;
  /** §45b SGB XI – €/month, usable for Betreuung and Hauswirtschaft. */
  entlastungsbetrag: number;
  /** §39 SGB XI – combined annual budget for Verhinderungs- + Kurzzeitpflege. €/year. */
  jahresbetrag: number | null;
}

export const grades: GradBenefits[] = [
  {
    grad: 1,
    summary: 'Geringe Beeinträchtigungen der Selbständigkeit oder der Fähigkeiten',
    sachleistung: 0,
    pflegegeld: 0,
    entlastungsbetrag: 131,
    jahresbetrag: null,
  },
  {
    grad: 2,
    summary: 'Erhebliche Beeinträchtigungen der Selbständigkeit oder der Fähigkeiten',
    sachleistung: 796,
    pflegegeld: 347,
    entlastungsbetrag: 131,
    jahresbetrag: 3539,
  },
  {
    grad: 3,
    summary: 'Schwere Beeinträchtigungen der Selbständigkeit oder der Fähigkeiten',
    sachleistung: 1497,
    pflegegeld: 599,
    entlastungsbetrag: 131,
    jahresbetrag: 3539,
  },
  {
    grad: 4,
    summary: 'Schwerste Beeinträchtigungen der Selbständigkeit oder der Fähigkeiten',
    sachleistung: 1859,
    pflegegeld: 800,
    entlastungsbetrag: 131,
    jahresbetrag: 3539,
  },
  {
    grad: 5,
    summary:
      'Schwerste Beeinträchtigungen mit besonderen Anforderungen an die pflegerische Versorgung',
    sachleistung: 2299,
    pflegegeld: 990,
    entlastungsbetrag: 131,
    jahresbetrag: 3539,
  },
];

/** Additional entitlements from the same BMG source, useful in the FAQ. */
export const extraBenefits = [
  { label: 'Pflegehilfsmittel zum Verbrauch', amount: 42, unit: 'monatlich', note: 'z. B. Handschuhe, Desinfektion' },
  { label: 'Maßnahmen zur Verbesserung des Wohnumfelds', amount: 4180, unit: 'je Maßnahme', note: 'z. B. barrierefreies Bad' },
  { label: 'Digitale Pflegeanwendungen (DiPA)', amount: 40, unit: 'monatlich', note: null },
  { label: 'Zusätzliche Leistungen in Wohngruppen', amount: 224, unit: 'monatlich', note: null },
] as const;

export const euro = (n: number) =>
  new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export const gradeByNumber = (g: Pflegegrad) => grades.find((x) => x.grad === g)!;
