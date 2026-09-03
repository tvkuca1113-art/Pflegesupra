/**
 * FAQ.
 *
 * Questions come from what the client already answers on
 * supra-pd.de/ambulante-pflege-muenchen-faq/ plus the questions their existing
 * copy raises but never answers. Amounts are from src/content/pflege.ts
 * (BMG 2026). Nothing here promises a result the client cannot control.
 */

export interface FaqItem {
  id: string;
  question: string;
  /** Plain-text paragraphs. Kept free of markup so the same strings can feed
   *  both the rendered page and the FAQPage structured data. */
  answer: string[];
  category: 'Kosten & Abrechnung' | 'Leistungen' | 'Ablauf' | 'Über uns';
}

export const faq: FaqItem[] = [
  {
    id: 'erster-schritt',
    category: 'Ablauf',
    question: 'Wir brauchen Pflege — was ist der erste Schritt?',
    answer: [
      'Rufen Sie an oder schreiben Sie uns. Im ersten Gespräch klären wir zwei Dinge: was gebraucht wird und ob wir Ihre Adresse zuverlässig anfahren können. Wenn wir es nicht können, sagen wir das sofort, statt Sie hinzuhalten.',
      'Passt es, kommen wir zu einem kostenlosen Erstgespräch zu Ihnen nach Hause. Dort sehen wir die Wohnung, die Situation und die Menschen — das lässt sich am Telefon nicht ersetzen.',
    ],
  },
  {
    id: 'ohne-pflegegrad',
    category: 'Ablauf',
    question: 'Wir haben noch keinen Pflegegrad. Können wir uns trotzdem melden?',
    answer: [
      'Ja. Ein Pflegegrad ist keine Voraussetzung für ein Gespräch — und für Behandlungspflege auf ärztliche Verordnung brauchen Sie gar keinen.',
      'Für Leistungen der Pflegekasse braucht es einen Pflegegrad. Den Antrag stellen Sie formlos bei der Pflegekasse Ihrer Krankenkasse; danach meldet sich der Medizinische Dienst zur Begutachtung. Kostenlose und neutrale Hilfe beim Antrag bekommen Sie bei den Beratungsstellen der Stadt München oder beim Pflegestützpunkt im Landkreis Pfaffenhofen.',
    ],
  },
  {
    id: 'verordnung-bekommen',
    category: 'Leistungen',
    question: 'Wie bekomme ich eine Verordnung für Behandlungspflege?',
    answer: [
      'Von Ihrer Hausärztin oder Ihrem Hausarzt. Die Verordnung häuslicher Krankenpflege wird auf dem Formular Muster 12 ausgestellt und muss von der Krankenkasse genehmigt werden.',
      'Sagen Sie uns Bescheid, bevor Sie in die Praxis gehen — wir sagen Ihnen, was konkret auf der Verordnung stehen sollte, damit sie nicht wegen einer Formalie abgelehnt wird.',
    ],
  },
  {
    id: 'kosten-vorstrecken',
    category: 'Kosten & Abrechnung',
    question: 'Muss ich in Vorleistung gehen?',
    answer: [
      'Als gesetzlich versicherte Person nicht. Wir rechnen direkt mit Ihrer Pflege- und Krankenkasse ab.',
      'Bei privater Versicherung ist die Direktabrechnung in der Regel gesetzlich nicht möglich. Sie erhalten die Rechnung von uns, zahlen sie und reichen sie bei Ihrem Kostenträger ein, der Ihnen den Betrag nach Ihren Erstattungssätzen erstattet.',
    ],
  },
  {
    id: 'budget-reicht-nicht',
    category: 'Kosten & Abrechnung',
    question: 'Was passiert, wenn das Budget der Pflegekasse nicht reicht?',
    answer: [
      'Dann stellen wir die Differenz privat in Rechnung — auf der Grundlage dessen, was vorher vertraglich mit Ihnen vereinbart wurde. Es gibt keine Überraschung am Monatsende.',
      'Bevor es so weit kommt, prüfen wir mit Ihnen, ob sich der Bedarf anders finanzieren lässt: über den Entlastungsbetrag, über die Verhinderungspflege oder über eine Höherstufung des Pflegegrades, wenn sich der Zustand tatsächlich verändert hat.',
    ],
  },
  {
    id: 'zusatzgebuehren',
    category: 'Kosten & Abrechnung',
    question: 'Berechnen Sie Zuschläge oder Aufnahmegebühren?',
    answer: [
      'Nein. Unsere Preise richten sich nach den geltenden Vergütungsvereinbarungen mit den gesetzlichen Pflege- und Krankenkassen. Zusätzliche Gebühren erheben wir nicht.',
      'Darüber hinaus können Privatleistungen vereinbart werden — aber nur, wenn Sie sie ausdrücklich wollen, und immer mit dem Preis vorab schriftlich.',
    ],
  },
  {
    id: 'kombinationsleistung',
    category: 'Kosten & Abrechnung',
    question: 'Verliere ich das Pflegegeld, wenn ein Pflegedienst kommt?',
    answer: [
      'Nein, nicht vollständig. Wenn Sie das Sachleistungsbudget nicht ausschöpfen, erhalten Sie anteilig weiter Pflegegeld. Das nennt sich Kombinationsleistung.',
      'Beispiel: Nutzen Sie die Hälfte Ihres Sachleistungsbudgets, bleibt Ihnen etwa die Hälfte des Pflegegeldes. Wie hoch der Anteil genau ausfällt, rechnet Ihre Pflegekasse aus.',
    ],
  },
  {
    id: 'entlastungsbetrag-verfallen',
    category: 'Kosten & Abrechnung',
    question: 'Verfällt der Entlastungsbetrag von 131 € im Monat?',
    answer: [
      'Nicht sofort. Nicht genutzte Beträge können ins Folgejahr übertragen werden und stehen dort bis zum 30. Juni zur Verfügung. Danach verfallen sie.',
      'Viele Familien lassen diesen Betrag ungenutzt liegen, weil sie nicht wissen, wofür er einsetzbar ist: Betreuung, Begleitung und hauswirtschaftliche Leistungen gehören dazu. Fragen Sie uns danach.',
    ],
  },
  {
    id: 'jahresbetrag',
    category: 'Kosten & Abrechnung',
    question: 'Was hat sich bei der Verhinderungspflege geändert?',
    answer: [
      'Seit dem 1. Juli 2025 gibt es einen gemeinsamen Jahresbetrag für Verhinderungspflege und Kurzzeitpflege von bis zu 3.539 € pro Kalenderjahr, den Sie flexibel auf beide Leistungen verteilen können.',
      'Außerdem ist die frühere sechsmonatige Vorpflegezeit entfallen, und beide Leistungen können jeweils bis zu acht Wochen im Kalenderjahr genutzt werden. Der Entlastungsbetrag von 131 € monatlich kommt zusätzlich obendrauf und wird davon nicht abgezogen.',
    ],
  },
  {
    id: 'wer-kommt',
    category: 'Über uns',
    question: 'Kommt immer dieselbe Pflegekraft?',
    answer: [
      'Wir planen so, dass Sie es mit möglichst wenigen, festen Gesichtern zu tun haben — das ist der Punkt, an dem ambulante Pflege für die meisten Menschen steht oder fällt.',
      'Eine Garantie auf eine einzige Person kann kein Pflegedienst ehrlich geben: Es gibt Urlaub, Krankheit und Schichtwechsel. Was wir zusagen können, ist, dass jede Person, die zu Ihnen kommt, Ihre Situation kennt, bevor sie klingelt.',
    ],
  },
  {
    id: 'zeitdruck',
    category: 'Über uns',
    question: 'Ist bei Ihnen mehr Zeit als bei anderen Diensten?',
    answer: [
      'Wir planen Einsätze nach unserer realen Erfahrung, wie lange etwas dauert — nicht nach der Minutenliste, die auf dem Papier am günstigsten aussieht. Das ist die bewusste Entscheidung, mit der dieser Dienst 2022 gegründet wurde.',
      'Das heißt nicht, dass wir unbegrenzt Zeit haben. Es heißt, dass eingeplante Zeit auch eingehalten wird und Platz für einen individuellen Wunsch bleibt.',
    ],
  },
  {
    id: 'sprachen',
    category: 'Über uns',
    question: 'Sprechen Ihre Pflegekräfte andere Sprachen?',
    answer: [
      'Unser Team ist sprachlich gemischt. Welche Sprachen aktuell abgedeckt sind, hängt vom Dienstplan ab — sagen Sie uns, welche Sprache gebraucht wird, dann bekommen Sie eine klare Auskunft, ob wir sie im konkreten Fall leisten können.',
    ],
  },
];

export const faqCategories = [
  'Ablauf',
  'Leistungen',
  'Kosten & Abrechnung',
  'Über uns',
] as const;
