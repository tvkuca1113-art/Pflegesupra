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
  /**
   * The legal reference in plain German, shown directly under it.
   *
   * A page that writes "§37 SGB V" and moves on has told a worried relative
   * nothing. Every paragraph on this site is followed by what it actually
   * covers, in a sentence someone can read once — that is what "transparent"
   * has to mean in practice, rather than as an adjective.
   */
  plainLaw: string;
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
    plainLaw:
      'Damit ist die Hilfe am Körper gemeint: Waschen, Anziehen, Aufstehen, Essen und Trinken. Die Pflegekasse zahlt sie aus dem monatlichen Budget Ihres Pflegegrades.',
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
    plainLaw:
      'Das sind ärztlich verordnete Leistungen zu Hause — zum Beispiel Medikamentengabe, Injektionen oder Verbandwechsel. Sie laufen über die Krankenkasse und setzen keinen Pflegegrad voraus.',
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
    plainLaw:
      'Zeit für Gespräch, Begleitung und Beschäftigung. Dafür gibt es einen eigenen Betrag von 131 € im Monat, unabhängig vom Sachleistungsbudget — er gilt ab Pflegegrad 1.',
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
    plainLaw:
      'Unterstützung im Haushalt: Einkaufen, Kochen, Reinigen, Wäsche. Sie kann aus dem Sachleistungsbudget oder aus dem Entlastungsbetrag bezahlt werden.',
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
    plainLaw:
      'Wenn die Person, die sonst pflegt, ausfällt oder Urlaub braucht, übernehmen wir vorübergehend. Dafür gibt es einen gemeinsamen Jahresbetrag mit der Kurzzeitpflege.',
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

/**
 * The two payers, and which services sit under each.
 *
 * This is the single most useful thing a visitor can learn on the services
 * page, and it used to be four paragraphs of prose at the bottom of it. The
 * distinction is not a footnote: it decides whether somebody without a
 * Pflegegrad can get help at all. So it becomes the page's structure instead
 * of its afterword.
 */
export interface PayerGroup {
  id: string;
  label: string;
  law: string;
  /** The one thing that decides whether this branch is open to you. */
  condition: string;
  note: string;
  slugs: string[];
}

export const payerGroups: PayerGroup[] = [
  {
    id: 'pflegekasse',
    label: 'Die Pflegekasse zahlt',
    law: 'SGB XI',
    condition: 'Voraussetzung ist ein Pflegegrad.',
    note:
      'Körperbezogene Pflege, Betreuung und hauswirtschaftliche Leistungen laufen über '
      + 'die Pflegekasse. Wie viel Ihnen im Monat zusteht, hängt vom Pflegegrad ab.',
    slugs: ['grundpflege', 'betreuung-und-entlastung', 'hauswirtschaft', 'verhinderungspflege'],
  },
  {
    id: 'krankenkasse',
    label: 'Die Krankenkasse zahlt',
    law: 'SGB V',
    condition: 'Unabhängig vom Pflegegrad.',
    note:
      'Alles ärztlich Verordnete — Medikamentengabe, Injektionen, Verbandwechsel — läuft '
      + 'über die Krankenkasse. Wer keinen Pflegegrad hat, kann Behandlungspflege trotzdem '
      + 'bekommen.',
    slugs: ['behandlungspflege'],
  },
];

export const servicesFor = (group: PayerGroup) =>
  group.slugs.map((slug) => serviceBySlug(slug)!).filter(Boolean);

