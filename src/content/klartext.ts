/**
 * KLARTEXT — the four questions families arrive with, and the answers.
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
 * The section went through two versions, and the second one matters.
 *
 * The first phrased each item as an accusation — "Auf der Rechnung stehen
 * Leistungen, die nie erbracht wurden." Every sentence was accurate and
 * sourced, and the section still read as an attack on the rest of the sector.
 * A family choosing a care provider under pressure does not need to be made
 * more afraid; making the fear vivid and then offering yourself as the cure is
 * a sales technique, and a visitor can feel it even when the facts are true.
 *
 * So the items are now the QUESTIONS people actually ask, phrased neutrally,
 * each answered with something specific and checkable that Supra does. Same
 * research, same specificity, no accusation. "Woher weiß ich, dass wirklich
 * geleistet wurde, was auf der Rechnung steht?" carries every bit of the
 * original's usefulness and none of its aggression.
 *
 * Every answer below is a commitment the client can actually keep with the
 * staff and systems they have. Nothing here asserts a certificate, a rating,
 * a response time or a client count.
 */

export type Klartext = {
  /** The question, phrased the way a family member would ask it. */
  fear: string;
  /** What is actually done about it. Concrete, checkable, no adjectives. */
  answer: string;
};

export const klartext: Klartext[] = [
  {
    fear: 'Woher weiß ich, dass wirklich geleistet wurde, was auf der Rechnung steht?',
    answer:
      'Sie unterschreiben den Leistungsnachweis nach dem Einsatz, nicht vorher. So können '
      + 'Sie jederzeit nachvollziehen, was erbracht und was abgerechnet wurde.',
  },
  {
    fear: 'Was kostet uns das am Ende wirklich?',
    answer:
      'Nach dem Erstgespräch bekommen Sie schriftlich, welche Leistungen Ihr Pflegegrad '
      + 'deckt und was — falls überhaupt etwas — privat bliebe. Vor der Unterschrift, '
      + 'nicht mit der ersten Rechnung.',
  },
  {
    fear: 'An wen wende ich mich, wenn etwas ist?',
    answer:
      'Während der Bürozeiten erreichen Sie jemanden, der Ihre Versorgung kennt. Wie Sie '
      + 'uns außerhalb dieser Zeiten erreichen, besprechen wir im Erstgespräch.',
  },
  {
    fear: 'Steht jede Woche jemand anderes vor der Tür?',
    answer:
      'Wir planen auf möglichst verlässliche Bezugspersonen hin und sagen Ihnen Bescheid, '
      + 'wenn sich etwas ändert. Urlaub und Krankheit gibt es überall — jede Pflegekraft, '
      + 'die zu Ihnen kommt, kennt Ihre Situation aus der Pflegeplanung.',
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
