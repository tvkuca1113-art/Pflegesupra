import { grades, euro, type GradBenefits } from '@/content/pflege';

/**
 * What each Pflegegrad is worth per month, as a picture.
 *
 * WHY A CHART AT ALL. The table underneath this already carries every figure,
 * and a table is the better instrument for looking one number up. The chart
 * answers a different question, and it is the question families actually ask
 * out loud: "is it worth applying for a higher Pflegegrad?" The jump from
 * PG3 to PG4 is 362 € a month. In a table that is two rows to subtract; here
 * it is a length, seen before it is read.
 *
 * FORM. Two series over five categories, and the series are the subject
 * (Sachleistung and Pflegegeld are alternatives you must choose between, not
 * two views of one thing) — so: grouped horizontal bars, categorical colour.
 * Horizontal because the category labels are words, not dates.
 *
 * COLOUR. #2f56b5 and #a8480a — the site's own blue and orange, each stepped
 * to the lightness band a chart mark needs. Validated rather than eyeballed:
 * both sit inside L 0.43–0.77, clear the chroma floor, clear 3:1 against the
 * paper surface, and separate by ΔE 24.7 under protanopia and 25.9 under
 * tritanopia — well above the ΔE 8 target. Brand #003399 itself measures
 * L 0.371 and fails the band, which is why the mark is a step lighter than
 * the button beside it.
 *
 * TWO DELIBERATE DEPARTURES from the house chart rules, both to avoid adding
 * ink or JavaScript that carries no information:
 *
 *  - Every bar is labelled, and there is no axis and no gridline. The usual
 *    rule is the reverse — label selectively, let the axis carry the rest —
 *    but that rule exists to stop a dense series being flooded with numbers.
 *    Here there are nine bars and each one is a distinct legal entitlement;
 *    the euro figure IS the content, and an axis would only let the reader
 *    estimate what is already printed. Direct labels before gridlines.
 *
 *  - No hover tooltip, and therefore no client component. A tooltip would
 *    reveal the number that is already on screen, at the cost of hydrating
 *    this page for every visitor. The full table sits directly below.
 *
 * ACCESSIBILITY. The bars are aria-hidden decoration; every value is real
 * text in the reading order, so a screen reader gets a clean list of grade,
 * benefit and amount without hearing about rectangles. Identity is carried by
 * the legend AND by the written series name on every row, never by colour
 * alone.
 */

const SERIES = {
  sach: { label: 'Pflegesachleistung', color: '#2f56b5', note: 'wenn ein Pflegedienst kommt' },
  geld: { label: 'Pflegegeld', color: '#a8480a', note: 'wenn Angehörige selbst pflegen' },
} as const;

/** The scale is set by the largest value on the chart, not by a round number. */
const MAX = Math.max(...grades.map((g) => g.sachleistung));

function Bar({ value, color, label, series }: { value: number; color: string; label: string; series: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      {/* The track. A fixed right-hand column holds the value instead of
          floating it at the bar's tip: at 320px a full-width bar would push
          its own label off the screen, and a clipped number is worse than a
          number in a column. */}
      <div className="h-3.5 w-full bg-[color-mix(in_srgb,var(--color-line)_70%,transparent)]" aria-hidden="true">
        <div
          className="h-full rounded-e-[4px]"
          style={{ width: `${Math.max((value / MAX) * 100, 1.5)}%`, background: color }}
        />
      </div>
      <span className="figure-xl min-w-[7ch] text-right text-lg text-ink tabular-nums">
        {label}
      </span>
      <span className="sr-only">{series}</span>
    </div>
  );
}

function Row({ g }: { g: GradBenefits }) {
  const none = g.sachleistung === 0 && g.pflegegeld === 0;
  return (
    <div className="border-t border-line py-5 first:border-t-0 sm:grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
      <h3 className="mb-3 text-xl sm:mb-0">Pflegegrad {g.grad}</h3>
      {none ? (
        <p className="m-0 text-ink-muted">
          Kein Anspruch auf Pflegesachleistung oder Pflegegeld. Es bleibt der
          Entlastungsbetrag von {euro(g.entlastungsbetrag)} monatlich.
        </p>
      ) : (
        <div className="space-y-2.5">
          <div>
            <p className="m-0 mb-1 text-sm text-ink-muted">{SERIES.sach.label}</p>
            <Bar value={g.sachleistung} color={SERIES.sach.color} label={euro(g.sachleistung)} series={`${SERIES.sach.label}, Pflegegrad ${g.grad}`} />
          </div>
          <div>
            <p className="m-0 mb-1 text-sm text-ink-muted">{SERIES.geld.label}</p>
            <Bar value={g.pflegegeld} color={SERIES.geld.color} label={euro(g.pflegegeld)} series={`${SERIES.geld.label}, Pflegegrad ${g.grad}`} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function BudgetChart() {
  return (
    <figure className="m-0">
      {/* Legend above the plot, in one row, as the dependable identity
          channel — the written series name on each row is the second. */}
      <ul className="m-0 mb-7 flex list-none flex-wrap gap-x-7 gap-y-2 p-0">
        {Object.values(SERIES).map((s) => (
          <li key={s.label} className="flex items-baseline gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 flex-none translate-y-px"
              style={{ background: s.color }}
            />
            <span>
              <span className="font-bold text-ink">{s.label}</span>
              <span className="block text-sm text-ink-muted">{s.note}</span>
            </span>
          </li>
        ))}
      </ul>

      <div>
        {grades.map((g) => (
          <Row key={g.grad} g={g} />
        ))}
      </div>

      <figcaption className="mt-6 border-t border-line pt-4 text-sm text-ink-muted">
        Monatliche Beträge für 2026. Die Balken sind auf den höchsten Wert der
        Tabelle skaliert ({euro(MAX)}). Sachleistung und Pflegegeld schließen
        einander nicht vollständig aus — wer den Pflegedienst nur teilweise
        nutzt, kann anteilig Pflegegeld behalten (Kombinationsleistung).
      </figcaption>
    </figure>
  );
}
