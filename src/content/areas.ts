/**
 * Location pages.
 *
 * These are NOT interchangeable city templates. Each page carries information
 * that is only true for that place: the actual office, the official and
 * independent advice service for that area, and how the route into care
 * works there. Public-authority contacts were verified 2026-09-01 against
 * the sources listed in `officialAdvice.source`.
 *
 * The precise list of districts/municipalities Supra drives to is NOT stated
 * anywhere here — the client has not published it and it must not be invented.
 * Each page asks the reader to check their address instead.
 */

export interface Area {
  slug: string;
  city: string;
  /** H1 / <title> — matches how people actually search. */
  seoTitle: string;
  metaDescription: string;
  /** What is verifiably true about Supra's presence here. */
  presence: string;
  /** Honest framing of coverage — no invented radius. */
  coverage: string;
  /** Independent, free, official advice — genuinely useful, builds trust. */
  officialAdvice: {
    name: string;
    what: string;
    address?: string;
    phone?: string;
    email?: string;
    hours?: string;
    url: string;
    source: string;
  };
  /** Locally true context, not filler. */
  localNotes: { heading: string; body: string }[];
}

export const areas: Area[] = [
  {
    slug: 'muenchen',
    city: 'München',
    seoTitle: 'Ambulanter Pflegedienst München — Pflege zu Hause',
    metaDescription:
      'Ambulante Pflege zu Hause in München. Grundpflege, Behandlungspflege, Betreuung und Hauswirtschaft. Büro in Sendling-Westpark. Beratung: 089 189 39 716.',
    presence:
      'Unser Hauptsitz liegt in der Zielstattstraße 10a in 81379 München, im Stadtbezirk Sendling-Westpark. Von dort aus fahren wir unsere Klientinnen und Klienten in München und Umgebung an.',
    coverage:
      'Ob wir Ihre Adresse anfahren können, hängt von der Tourenplanung ab und ändert sich mit unserer Auslastung. Sagen Sie uns Ihre Straße und Ihren Stadtteil — Sie bekommen eine klare Antwort, kein Vielleicht.',
    officialAdvice: {
      name: 'Beratung der Landeshauptstadt München',
      what:
        'Die Landeshauptstadt München berät kostenlos und unabhängig zu Pflege und Unterstützung im Alter — über die Sozialbürgerhäuser, die Alten- und Service-Zentren (ASZ) in den Stadtvierteln und die Fachstellen für pflegende Angehörige. Diese Beratung ist neutral: Sie ist an keinen Pflegedienst gebunden, auch nicht an uns.',
      url: 'https://stadt.muenchen.de/infos/pflege-beratung-unterstuetzung.html',
      source: 'stadt.muenchen.de, abgerufen am 01.09.2026',
    },
    localNotes: [
      {
        heading: 'Warum die Wege in München zählen',
        body:
          'In einer Stadt mit dichtem Verkehr entscheidet die Tourenplanung darüber, ob eine Pflegekraft pünktlich und ohne Hetze bei Ihnen ankommt. Deshalb sagen wir lieber ehrlich ab, als eine Tour anzunehmen, die wir nur im Laufschritt schaffen würden.',
      },
      {
        heading: 'Zusammenspiel mit Hausarzt und Apotheke',
        body:
          'Behandlungspflege braucht eine ärztliche Verordnung. Wir stimmen uns direkt mit Ihrer Hausarztpraxis ab und klären, was auf der Verordnung stehen muss, damit die Krankenkasse sie genehmigt.',
      },
    ],
  },
  {
    slug: 'pfaffenhofen-an-der-ilm',
    city: 'Pfaffenhofen a.d. Ilm',
    seoTitle: 'Ambulanter Pflegedienst Pfaffenhofen a.d. Ilm',
    metaDescription:
      'Ambulante Pflege zu Hause in Pfaffenhofen a.d. Ilm und Umgebung. Zweigstelle in der Türltorstraße 4. Beratung: 089 189 39 716.',
    presence:
      'Unsere Zweigstelle liegt in der Türltorstraße 4 in 85276 Pfaffenhofen a.d. Ilm. Damit sind wir nicht nur ein Münchner Dienst, der gelegentlich in den Landkreis fährt — wir sind vor Ort.',
    coverage:
      'Im Landkreis Pfaffenhofen liegen die Adressen weiter auseinander als in der Stadt. Welche Gemeinden wir zu welchen Zeiten anfahren können, sagen wir Ihnen konkret, wenn wir Ihre Adresse kennen.',
    officialAdvice: {
      name: 'Pflegestützpunkt Pfaffenhofen a.d. Ilm',
      what:
        'Der Pflegestützpunkt am Landratsamt berät kostenlos, neutral und unabhängig zu Pflegeleistungen, Anträgen und der Organisation von Pflege — unabhängig davon, für welchen Pflegedienst Sie sich am Ende entscheiden.',
      address: 'Löwenstraße 2, 85276 Pfaffenhofen a.d. Ilm',
      phone: '+49 8441 27-3401',
      email: 'pflegestuetzpunkt@landratsamt-paf.de',
      hours: 'Mo, Mi, Do, Fr 8–12 Uhr, Mi zusätzlich 13–16 Uhr — Termin empfohlen',
      url: 'https://www.landkreis-pfaffenhofen.de/leben/senioren-und-pflege/pflegestuetzpunkt/',
      source: 'landkreis-pfaffenhofen.de, abgerufen am 01.09.2026',
    },
    localNotes: [
      {
        heading: 'Ländliche Wege, feste Zeiten',
        body:
          'Auf dem Land sind Fahrzeiten der eigentliche Engpass. Wir planen Touren geografisch, damit die Zeit bei Ihnen ankommt und nicht auf der Straße bleibt — und damit Sie wissen, wann jemand vor der Tür steht.',
      },
      {
        heading: 'Wenn Angehörige weiter weg wohnen',
        body:
          'Viele Familien im Landkreis pflegen über Entfernung. Wir sprechen auf Wunsch regelmäßig mit Angehörigen, die nicht im selben Ort wohnen, damit niemand aus dem Bild verschwindet.',
      },
    ],
  },
];

export const areaBySlug = (slug: string) => areas.find((a) => a.slug === slug);
