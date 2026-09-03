/**
 * Photographic credits and the shot list.
 *
 * WHAT IS HERE NOW. Two sources, both under the Unsplash Licence: Jon
 * Pountney's documentary series for Age Cymru — the national charity for older
 * people in Wales — which carries the home page and the service pages, and one
 * photograph by Dominik Lange on /ueber-uns.
 *
 * The opening frame took four attempts, and the three failures are the useful
 * part. A close-up of two heads showed no place. An honest photograph of a
 * cluttered front room showed a place and was not beautiful. A field at golden
 * hour was beautiful and contradicted the headline above it — you cannot
 * promise "Pflege zu Hause" over a meadow. A hero has to establish a place, be
 * beautiful, AND agree with the sentence next to it; none of the three is
 * optional and none substitutes for the others.
 *
 * WHAT IS NOT HERE, AND WHY. The art direction this site was briefed to hit —
 * a caregiver and client in a modern German apartment with negative space on
 * the left for the headline; a caregiver, a daughter and a mother around a
 * table with a care folder; a Pflegefachkraft with a care bag at an apartment
 * door — does not exist in the free stock libraries reachable from here. It
 * was searched for repeatedly, most recently across both charity libraries and
 * a dozen query formulations. What else comes back is elderly-lifestyle stock
 * (couples dancing, opening parcels) from a handful of prolific producers,
 * which is exactly the register the brief rejects, or day-centre and care-home
 * interiors, which are the one setting an ambulatory service must not show.
 * The few frames that do come close sit behind Unsplash+, a paid licence.
 *
 * That is not a gap to paper over with a nearly-right picture. It is a
 * commission, so the shot list below is written as a commission: each slot has
 * the scene, the framing and the reason, precise enough for a photographer to
 * shoot from or a picture editor to buy against. Filling any one of them is a
 * change to `scripts/build-images.mjs` and nothing else — no page markup moves.
 *
 * RECOMMENDATION, plainly: one day with a photographer in the client's real
 * working conditions, with two consenting clients and two staff, replaces
 * every image on this site and is the single largest remaining upgrade to its
 * credibility. Everything below is written to make that day efficient.
 */
export const PHOTO_CREDIT = {
  /** Appended to the alt text of the opening photograph. */
  short: 'Symbolbild.',
  /** Named in /impressum. One entry per library the set draws on. */
  sources: [
    {
      label: 'Jon Pountney für Age Cymru',
      note: 'nationale Organisation für ältere Menschen in Wales',
      href: 'https://unsplash.com/@agecymru',
      used: 'Startseite und Leistungen',
    },
    {
      label: 'Dominik Lange',
      note: 'dokumentarische Aufnahme, veröffentlicht über Unsplash',
      href: 'https://unsplash.com/@the_real_napster',
      used: 'Über uns',
    },
  ],
  licence: 'Unsplash Licence',
} as const;

/**
 * The shot list.
 *
 * `slot` matches the `name` in scripts/build-images.mjs, so a new file drops
 * straight in. `status` is honest: 'placeholder' means the current picture is
 * the best available approximation, not the picture that was asked for.
 */
export type ShotBrief = {
  slot: string;
  where: string;
  status: 'placeholder' | 'final';
  /** The scene, as it would be described to a photographer on the day. */
  scene: string;
  /** Framing, aspect and where the subjects must sit in the frame. */
  framing: string;
  /** What the picture has to make the visitor feel or understand. */
  message: string;
};

export const shotList: ShotBrief[] = [
  {
    slot: 'hero-wide / hero-tall',
    where: 'Startseite, Hero',
    status: 'placeholder',
    scene:
      'Pflegekraft und Klientin in einer echten, hellen Wohnung. Die Klientin sitzt '
      + 'am Esstisch oder im Sessel, die Pflegekraft beugt sich leicht zu ihr im '
      + 'Gespräch. Tageslicht vom Fenster, warme neutrale Materialien, keine '
      + 'medizinischen Geräte im Bild. Niemand schaut in die Kamera.',
    framing:
      'Halbtotale, 0,95:1 für Desktop und 1,36:1 für das Telefon. Personen rechts im Bild, '
      + '35–45 % ruhige Fläche links — dort steht die Überschrift. Kein Gesicht darf '
      + 'hinter Text geraten. Die Klientin nicht wegunschärfen: beide Personen bleiben '
      + 'relevant.',
    message: 'Sie können zu Hause bleiben und werden zuverlässig unterstützt.',
  },
  {
    slot: 'beratung',
    where: 'Startseite, „Vier Fragen“',
    status: 'placeholder',
    scene:
      'Drei Personen an einem Küchen- oder Esstisch in der Wohnung der Klientin: '
      + 'ältere Mutter, Tochter (45–55), Pflegekraft. Auf dem Tisch eine schmale '
      + 'Mappe, ein Stift, Wasser oder Kaffee — kein Papierstapel. Die Pflegekraft '
      + 'erklärt ruhig, die Tochter hört zu, die Mutter ist Teil des Gesprächs.',
    framing:
      'Halbtotale quer, 3:2. Alle drei verbunden im Bild, niemand in die Kamera. '
      + 'Kein Besprechungsraum-Gefühl.',
    message: 'Wir erklären Ihnen, wie Versorgung, Leistungen und Kosten organisiert werden.',
  },
  {
    slot: 'haltung',
    where: 'Startseite, „Pflege lässt sich nicht auf Minuten reduzieren“',
    status: 'placeholder',
    scene:
      'Pflegekraft hilft einem älteren Herrn beim Aufstehen aus dem Sessel oder beim '
      + 'Anziehen einer leichten Jacke vor dem Hinausgehen. Leichte Armunterstützung, '
      + 'er macht den Schritt selbst. Zurückhaltend und würdevoll — der Klient wirkt '
      + 'nicht hilflos, die Pflegekraft nicht dominant.',
    framing: 'Hochformat 4:5, halbnah. Beide Gesichter sichtbar.',
    message: 'Unterstützung, die Selbstständigkeit erhält.',
  },
  {
    slot: 'leistungen',
    where: 'Leistungen, Kopfbild',
    status: 'placeholder',
    scene:
      'Pflegekraft und Klientin gemeinsam in einer aufgeräumten Küche bei einer '
      + 'kleinen alltäglichen Aufgabe — Tisch decken, Einkäufe einräumen, etwas '
      + 'Einfaches zubereiten. Kein Putzeimer, kein Wischmopp, keine Sprühflaschen: '
      + 'Supra ist kein Reinigungsdienst.',
    framing: 'Quer 16:9, Halbtotale mit Raumkontext.',
    message: 'Unterstützung im Haushalt als Teil eines selbstbestimmten Alltags.',
  },
  {
    slot: 'ueber-uns',
    where: 'Über uns',
    status: 'placeholder',
    scene:
      'Ersetzen durch ein echtes Bild: Inhaber und Team vor oder in einem der beiden '
      + 'Büros, oder eine Pflegekraft beim Verlassen eines Münchner Wohnhauses. Bis '
      + 'dahin ein Motiv, das eine Pflegekraft und eine Klientin zusammen zeigt.',
    framing: 'Quer 3:2.',
    message: 'Diesen Dienst führen Menschen, die man sehen kann.',
  },
  {
    slot: 'pflegekraft',
    where: 'Karriere',
    status: 'placeholder',
    scene:
      'Pflegefachkraft, 28–40, moderne saubere Arbeitskleidung, bereitet die '
      + 'Pflegetasche vor der Wohnungstür vor — oder geht auf ein Münchner Wohnhaus '
      + 'zu. Kein Krankenhausflur, kein verschränkte-Arme-Porträt, keine ältere '
      + 'Person, die das Bild dominiert.',
    framing:
      'Hochformat 4:5. Etwas mehr Bewegung als auf den Klientenseiten, gleiche '
      + 'Farbstimmung.',
    message: 'Das könnte mein Arbeitsplatz sein.',
  },
  {
    slot: 'behandlungspflege (neu)',
    where: 'Leistungen / Behandlungspflege',
    status: 'placeholder',
    scene:
      'Pflegekraft richtet in der Wohnung ruhig Medikamente oder prüft eine '
      + 'Dokumentation, der Klient ist anwesend und beteiligt. Sauberer Tisch. Keine '
      + 'Kanülen im Vordergrund, keine Klinikgeräte, keine dramatische Prozedur.',
    framing: 'Quer 3:2.',
    message: 'Medizinisch notwendige Unterstützung — professionell bei Ihnen zu Hause.',
  },
  {
    slot: 'verhinderungspflege (neu)',
    where: 'Leistungen / Verhinderungspflege',
    status: 'placeholder',
    scene:
      'Ruhige Übergabesituation: die Tochter zieht die Jacke an und geht, die '
      + 'Pflegekraft übernimmt selbstverständlich. Kein dramatischer Abschied, kein '
      + 'Koffer-Klischee.',
    framing: 'Quer 3:2.',
    message: 'Entlastung für Angehörige — ohne dass die Versorgung unterbrochen wird.',
  },
];

/**
 * Reject any candidate on which ANY of these is true. Written down because
 * five frames already had to be pulled from this site after they had shipped,
 * and every one of them failed a test that was obvious in hindsight.
 */
export const REJECT_IF = [
  'Menschen wirken KI-generiert; Hände, Finger oder Zähne unnatürlich',
  'Haut überglättet, Gesichter plastikartig',
  'Wohnung wirkt wie ein Showroom, unmöglich perfekt',
  'kräftige Orange-Teal-Farbkorrektur oder übertriebenes Sonnenlicht',
  'Personen schauen in die Kamera oder lächeln übertrieben',
  'Umgebung wirkt wie Krankenhaus, Klinik, Tagespflege oder Seniorenheim',
  'ältere Person wirkt stereotyp hilflos',
  'Pflegekraft wirkt wie ein Model',
  'fremde Logos auf Kleidung oder Ausrüstung',
  'kein erkennbarer Bezug zum Abschnitt, in dem das Bild steht',
  'kein Pflegebezug: nur eine ältere Person allein, ohne Betreuungssituation',
] as const;
