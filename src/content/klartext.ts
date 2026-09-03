/**
 * KLARTEXT — what families rely on, and what Supra does about each.
 *
 * This is not copywriting. Every fear below is a documented, recurring
 * complaint about ambulante Pflegedienste, taken from the Verbraucherzentrale's
 * standing call for reports on the sector and from the family-carer forums
 * where people describe the same experiences to each other.
 *
 * The finding that shaped the whole section is this one, in the
 * Verbraucherzentrale's own framing: people stay silent about problems with
 * their care service because they are afraid of losing the arrangement
 * altogether. That is what makes a care website different from every other
 * kind of website. The visitor is not comparing features. They are trying to
 * work out whether they are about to be taken advantage of at the worst
 * moment of their family's life, and they have no way to check.
 *
 * The section went through three versions, and the distance between the first
 * and the third is the whole lesson.
 *
 * V1 phrased each item as an accusation: "Auf der Rechnung stehen Leistungen,
 * die nie erbracht wurden." Sourced, accurate, and an attack on the sector.
 * V2 softened it into the questions people ask — "Woher weiß ich, dass...?" —
 * which removed the accusation but kept the visitor in the register of worry.
 *
 * V3, this one, asks the question a family member would actually ask out loud
 * — "Wer kommt zu uns nach Hause?" — and answers it with what is done about
 * it. It says the same thing to a reader who already distrusts the sector,
 * and nothing alarming to one who does not.
 *
 * The research underneath is unchanged through all three. Only the posture
 * moved: from "look what others do", through "here is what you fear", to
 * "here is your question, and here is our answer".
 *
 * Every answer below is a commitment the client can actually keep with the
 * staff and systems they have. Nothing here asserts a certificate, a rating,
 * a response time or a client count.
 */

export type Klartext = {
  /** The question, in the words a family member would use. */
  fear: string;
  /** What Supra does about it. Concrete, checkable, no adjectives. */
  answer: string;
};

export const klartext: Klartext[] = [
  {
    fear: 'Wer kommt zu uns nach Hause?',
    answer:
      'Wir achten auf möglichst verlässliche Bezugspersonen und stimmen Änderungen '
      + 'transparent mit Ihnen ab. Jede Pflegekraft, die zu Ihnen kommt, kennt Ihre '
      + 'Situation aus der Pflegeplanung.',
  },
  {
    fear: 'Was wird eigentlich abgerechnet?',
    answer:
      'Wir erklären Ihnen nachvollziehbar, welche Leistungen vereinbart wurden und '
      + 'welche Kosten über Pflege- oder Krankenkasse abgerechnet werden können. Den '
      + 'Leistungsnachweis unterschreiben Sie nach dem Einsatz, nicht vorher.',
  },
  {
    fear: 'An wen wenden wir uns bei Fragen?',
    answer:
      'Sie wissen, an wen Sie sich bei organisatorischen Fragen zur Versorgung wenden '
      + 'können. Während der Bürozeiten erreichen Sie jemanden, der Ihre Versorgung '
      + 'kennt.',
  },
  {
    fear: 'Wie passt die Pflege in unseren Alltag?',
    answer:
      'Einsatzzeiten und benötigte Unterstützung werden anhand Ihrer individuellen '
      + 'Versorgungssituation besprochen — beim kostenlosen Hausbesuch, dort, wo die '
      + 'Pflege später stattfindet.',
  },
];

/**
 * The source for the fears. Named on the page, because a claim about what
 * people fear is itself a claim and needs to be checkable.
 */
export const KLARTEXT_SOURCE = {
  label: 'Verbraucherzentrale — Sammlung von Verbrauchererfahrungen mit ambulanten Pflegediensten',
  href: 'https://www.verbraucherzentrale.de/probleme-mit-pflegediensten-melden-sie-uns-ihre-erfahrungen-118551',
};

/**
 * EIN EINSATZ — what half an hour actually contains.
 *
 * The second thing the research turned up: nobody outside the profession knows
 * what a Pflegedienst physically does in a visit. Families picture either a
 * doctor's appointment or a cleaner, and both are wrong. Competitor sites
 * answer with a bulleted service catalogue, which is a list of nouns.
 *
 * A timed sequence is a different kind of information. It is also the client's
 * actual differentiator made visible: they plan by what a task takes rather
 * than by the minute list, and the only way to show that is to show the
 * minutes.
 *
 * These are a typical morning visit at a middle Pflegegrad, not a promise of
 * duration — the copy on the page says so, because the length of a real visit
 * depends on the person.
 */
export const einsatz: { at: string; title: string; body: string }[] = [
  {
    at: '0 Min.',
    title: 'Ankommen, nicht hereinplatzen',
    body:
      'Klingeln, begrüßen, kurz schauen, wie die Nacht war. Wer direkt zur Aufgabe '
      + 'übergeht, übersieht die Hälfte dessen, weshalb er da ist.',
  },
  {
    at: '5 Min.',
    title: 'Was heute ansteht, gemeinsam klären',
    body:
      'Manches ist jeden Tag gleich, manches nicht. Ob heute geduscht oder gewaschen '
      + 'wird, entscheidet nicht der Plan allein.',
  },
  {
    at: '10 Min.',
    title: 'Körperpflege — so viel Hilfe wie nötig',
    body:
      'Was jemand noch selbst kann, macht er selbst. Das dauert länger und ist der '
      + 'Grund, warum es dafür überhaupt Zeit gibt.',
  },
  {
    at: '20 Min.',
    title: 'Medikamente, Verbände, Blutzucker',
    body:
      'Alles ärztlich Verordnete wird dokumentiert. Auffälligkeiten gehen noch am '
      + 'selben Tag an die Praxis, nicht in die nächste Woche.',
  },
  {
    at: '28 Min.',
    title: 'Dokumentation — im Haus, nicht im Auto',
    body:
      'Der Nachweis wird dort geschrieben, wo der Einsatz stattfand, und dort '
      + 'unterschrieben. Danach wissen Sie, was passiert ist.',
  },
];
