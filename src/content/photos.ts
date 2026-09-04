/**
 * Photographic credits and the shot list.
 *
 * WHAT IS HERE NOW. Seven photographs supplied and approved by the client, one
 * per placement, stored as masters in assets/photos/ and rendered by
 * scripts/build-images.mjs. Every previous image is gone from the site and from
 * the repository: the Age Cymru documentary series, the Centre for Ageing
 * Better library and the single Dominik Lange frame, together with every
 * rendition built from them.
 *
 * WHY ONE FRAME PER PLACEMENT. The set this replaces reused three sittings at
 * seven crops, and a visitor could see it: the same carer, the same client, the
 * same room, page after page. Seven different homes and seven different people
 * fix that only if nothing is repeated, so nothing is — with one deliberate
 * exception, `grundpflege`, which also carries the home page's argument about
 * preserving independence, on a different page.
 *
 * WHAT THEY ARE, STATED PLAINLY. These are not photographs of Supra's staff,
 * clients or premises, and the site says so: quietly, once per image, through
 * the `figure__mark` word rather than a paragraph of disclaimer. The Impressum
 * carries the full disclosure, including how the pictures were produced —
 * which matters more here than on most sites, because the site this replaces
 * used generated imagery and had to disclose it too. Saying it plainly is the
 * difference between disclosure and being caught.
 *
 * WHAT ONLY A REAL SHOOT CAN STILL FIX. Two slots have no approved frame and
 * are deliberately running without one: /ueber-uns, which is about who owns and
 * runs this business, and /leistungen/verhinderungspflege. Both are waiting for
 * photographs of real people at real addresses, and /ueber-uns is the one where
 * a real picture would do the most work — a care provider's own face is worth
 * more than any commissioned scene. The briefs below are written to make that
 * day efficient.
 */
export const PHOTO_CREDIT = {
  /** Appended to the alt text of the opening photograph. */
  short: 'Symbolbild.',
  /**
   * Named in /impressum. Kept as data so the Impressum cannot drift away from
   * what is actually on the site — the last set went out of sync twice.
   */
  origin: 'vom Auftraggeber bereitgestellt und freigegeben',
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
    slot: 'ueber-uns',
    where: 'Über uns — derzeit ohne Foto',
    status: 'placeholder',
    scene:
      'Inhaber und Team vor oder in einem der beiden Büros. Kein gestelltes '
      + 'Gruppenfoto in einer Reihe: zwei bis vier Personen im Gespräch, so wie sie '
      + 'morgens tatsächlich zusammenstehen, bevor die Touren losgehen.',
    framing: 'Quer 3:2, Halbtotale mit Raumkontext.',
    message: 'Diesen Dienst führen Menschen, die man sehen kann.',
  },
  {
    slot: 'verhinderungspflege',
    where: 'Leistungen / Verhinderungspflege — derzeit ohne Foto',
    status: 'placeholder',
    scene:
      'Ruhige Übergabesituation: die Tochter zieht die Jacke an und geht, die '
      + 'Pflegekraft übernimmt selbstverständlich. Kein dramatischer Abschied, kein '
      + 'Koffer-Klischee.',
    framing: 'Quer 16:9, passend zu den übrigen Leistungsseiten.',
    message: 'Entlastung für Angehörige — ohne dass die Versorgung unterbrochen wird.',
  },
  {
    slot: 'alle sieben Bestandsbilder',
    where: 'Startseite, Leistungsseiten, Karriere',
    status: 'placeholder',
    scene:
      'Ersetzen durch echte Aufnahmen: eigene Pflegekräfte, echte Klientinnen und '
      + 'Klienten mit schriftlicher Einwilligung, echte Wohnungen in München und '
      + 'Pfaffenhofen. Ein Tag mit einer Fotografin oder einem Fotografen deckt alle '
      + 'sieben Motive ab, wenn zwei Touren begleitet werden dürfen.',
    framing:
      'Pro Motiv 4:3 quer; für den Kopfbereich zusätzlich eine Aufnahme mit '
      + 'ruhiger Fläche links, damit die Zuschnitte 0,95:1 auf dem Desktop und '
      + '16:9 auf dem Telefon beide funktionieren. Mindestens 3000 px Breite — '
      + 'die aktuellen Vorlagen haben 1448 px. Für das Kopfbild reicht das nicht '
      + 'ganz: ein 1440-px-Display mit doppelter Pixeldichte möchte rund 1556 px, '
      + 'der Zuschnitt liefert 1032 px.',
    message: 'Echte Menschen schlagen jedes Symbolbild.',
  },
];

/**
 * Reject any candidate on which ANY of these is true. Kept for the real shoot,
 * because the list was earned: frames were pulled from this site after they had
 * shipped for most of these reasons, and the hero alone was replaced four times
 * before the client supplied the current set.
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
