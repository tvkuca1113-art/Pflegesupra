/**
 * Service catalogue.
 *
 * Content is a rewrite of the descriptions the client publishes on
 * supra-pd.de/ambulante-pflege-muenchen-leistungen/ and .../faq/ (retrieved
 * 2026-09-01). Wording is improved for clarity and reader-first structure;
 * the legal and factual substance is unchanged. Statutory references were
 * checked against the paragraph the client already cites.
 */

export interface Service {
  slug: string;
  /** Menu / card label. */
  name: string;
  /** Used in <title> and H1 — carries the search intent. */
  seoTitle: string;
  metaDescription: string;
  /** One sentence a worried relative can understand on first read. */
  promise: string;
  legalBasis: string;
  payer: string;
  /** Answers "does this apply to me?" before anything else. */
  eligibility: string;
  includes: string[];
  /** Things people wrongly assume are included — prevents disappointment. */
  notIncluded?: string[];
  faqRefs: string[];
}

export const services: Service[] = [
  {
    slug: 'grundpflege',
    name: 'Grundpflege',
    seoTitle: 'Grundpflege zu Hause in München & Pfaffenhofen',
    metaDescription:
      'Körperbezogene Pflege zu Hause: Waschen, Ankleiden, Mobilität, Ernährung. Abrechnung über die Pflegekasse nach §36 SGB XI. Beratung: 089 189 39 716.',
    promise:
      'Hilfe bei allem, was den Körper betrifft — so viel wie nötig, so wenig wie möglich, damit Selbständigkeit erhalten bleibt.',
    legalBasis: 'Körperbezogene Pflegemaßnahmen nach §36 SGB XI',
    payer: 'Pflegekasse, im Rahmen des Sachleistungsbudgets Ihres Pflegegrades',
    eligibility: 'Ab Pflegegrad 2. Bei Pflegegrad 1 sind körperbezogene Maßnahmen über das Sachleistungsbudget nicht abgedeckt.',
    includes: [
      'Körperpflege: Waschen, Duschen, Baden, Zahn- und Mundpflege',
      'An- und Auskleiden',
      'Hilfe beim Aufstehen, Umlagern und bei der Mobilität in der Wohnung',
      'Unterstützung bei der Nahrungs- und Flüssigkeitsaufnahme',
      'Hilfe beim Toilettengang, Versorgung bei Inkontinenz',
      'Hautbeobachtung und Prophylaxen im Rahmen der Pflege',
    ],
    notIncluded: [
      'Ärztlich verordnete Maßnahmen — die laufen als Behandlungspflege über die Krankenkasse',
      'Putzen und Einkaufen — das sind hauswirtschaftliche Leistungen',
    ],
    faqRefs: ['budget-reicht-nicht', 'kombinationsleistung'],
  },
  {
    slug: 'behandlungspflege',
    name: 'Behandlungspflege',
    seoTitle: 'Behandlungspflege nach ärztlicher Verordnung (SGB V)',
    metaDescription:
      'Medikamentengabe, Injektionen, Blutzuckermessung und Verbandwechsel zu Hause — auf ärztliche Verordnung, abgerechnet mit der Krankenkasse.',
    promise:
      'Ärztlich verordnete Maßnahmen werden bei Ihnen zu Hause durchgeführt — Sie müssen dafür nicht in die Praxis.',
    legalBasis: 'Häusliche Krankenpflege nach §37 SGB V',
    payer: 'Krankenkasse, nach Genehmigung der ärztlichen Verordnung',
    eligibility:
      'Unabhängig vom Pflegegrad. Voraussetzung ist eine Verordnung häuslicher Krankenpflege (Muster 12) von Ihrer Ärztin oder Ihrem Arzt.',
    includes: [
      'Medikamentengabe und Stellen der Medikamente',
      'Injektionen, zum Beispiel Insulin oder Thrombosespritzen',
      'Blutzucker- und Blutdruckmessung',
      'Verbandwechsel und Wundversorgung',
      'Kompressionsstrümpfe an- und ausziehen',
      'Katheter- und Stomaversorgung',
    ],
    faqRefs: ['verordnung-bekommen'],
  },
  {
    slug: 'betreuung-und-entlastung',
    name: 'Betreuung & Entlastung',
    seoTitle: 'Betreuung und Entlastungsleistungen nach §45b SGB XI',
    metaDescription:
      'Begleitung im Alltag, Gespräche, Spaziergänge und Entlastung für Angehörige — finanzierbar über den Entlastungsbetrag von 131 € monatlich.',
    promise:
      'Zeit für den Menschen, nicht nur für die Pflege — und eine Atempause für die Angehörigen, die sonst alles allein tragen.',
    legalBasis: 'Entlastungsbetrag nach §45b SGB XI',
    payer: 'Pflegekasse, bis zu 131 € monatlich',
    eligibility:
      'Ab Pflegegrad 1. Ab Pflegegrad 2 gilt: über den Entlastungsbetrag sind keine körperbezogenen Pflegemaßnahmen abrechenbar.',
    includes: [
      'Gespräche und Gesellschaft',
      'Begleitung zu Spaziergängen und Terminen',
      'Beschäftigung und Aktivierung, auch bei Demenz',
      'Unterstützung bei Post, Formularen und Terminorganisation',
      'Entlastung pflegender Angehöriger für einige Stunden',
    ],
    faqRefs: ['entlastungsbetrag-verfallen'],
  },
  {
    slug: 'hauswirtschaft',
    name: 'Hauswirtschaftliche Versorgung',
    seoTitle: 'Hauswirtschaftliche Versorgung zu Hause',
    metaDescription:
      'Einkaufen, Kochen, Reinigen und Wäsche — hauswirtschaftliche Leistungen über Pflegesachleistung oder Entlastungsbetrag.',
    promise:
      'Ein Haushalt, der weiterläuft, auch wenn das Bücken, Tragen oder Stehen nicht mehr geht.',
    legalBasis: 'Hauswirtschaftliche Versorgung nach §36 SGB XI, alternativ über §45b SGB XI',
    payer: 'Pflegekasse — über das Sachleistungsbudget oder den Entlastungsbetrag',
    eligibility:
      'Über den Entlastungsbetrag ab Pflegegrad 1, über das Sachleistungsbudget ab Pflegegrad 2.',
    includes: [
      'Einkaufen und Besorgungen',
      'Zubereitung von Mahlzeiten',
      'Reinigung der genutzten Wohnräume',
      'Wäsche waschen, aufhängen und zusammenlegen',
      'Müll entsorgen und Ordnung halten',
    ],
    faqRefs: ['entlastungsbetrag-verfallen'],
  },
  {
    slug: 'verhinderungspflege',
    name: 'Verhinderungspflege',
    seoTitle: 'Verhinderungspflege — Vertretung für pflegende Angehörige',
    metaDescription:
      'Wenn pflegende Angehörige Urlaub brauchen oder krank werden: Verhinderungspflege aus dem gemeinsamen Jahresbetrag von bis zu 3.539 € pro Kalenderjahr.',
    promise:
      'Wenn die Person, die sonst pflegt, ausfällt oder Urlaub braucht, übernehmen wir — stunden- oder wochenweise.',
    legalBasis: 'Verhinderungspflege nach §39 SGB XI, seit 01.07.2025 aus dem gemeinsamen Jahresbetrag',
    payer:
      'Pflegekasse, aus dem gemeinsamen Jahresbetrag für Verhinderungs- und Kurzzeitpflege von bis zu 3.539 € pro Kalenderjahr',
    eligibility:
      'Ab Pflegegrad 2. Die frühere sechsmonatige Vorpflegezeit ist seit dem 01.07.2025 entfallen.',
    includes: [
      'Vertretung bei Urlaub der Pflegeperson',
      'Vertretung bei Krankheit der Pflegeperson',
      'Stundenweise Entlastung, auch regelmäßig',
      'Körperbezogene Pflege, Betreuung und Hauswirtschaft während der Vertretung',
    ],
    faqRefs: ['jahresbetrag'],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
