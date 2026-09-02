/**
 * Contrast audit. Run: node scripts/contrast.mjs
 * Fails (exit 1) if any pair used for text falls below its WCAG 2.2 target.
 */
const hex = h => h.replace('#','').match(/../g).map(x=>parseInt(x,16));
const lin = c => { c/=255; return c<=0.03928 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
const L = h => { const [r,g,b]=hex(h); return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b); };
const ratio = (a,b) => { const [x,y]=[L(a),L(b)].sort((m,n)=>n-m); return (x+0.05)/(y+0.05); };

const C = {
  brand:'#003399', brandDeep:'#002270', brandInk:'#001a52',
  sun:'#ff6600', sunSoft:'#ffd9b8', inkAccent:'#a83b00',
  page:'#fbf8f3', paper:'#f1eade', paperWarm:'#f6f0e6', surface:'#ffffff',
  night:'#191c24', nightSoft:'#232733',
  ink:'#1b1815', inkMuted:'#56504a',
  ok:'#14603a', okBg:'#e7f4ec', err:'#a3131f', errBg:'#fdeceb',
  line:'#ded5c7', lineStrong:'#8a8074', white:'#ffffff',
};

// [label, fg, bg, minimum required]
// 4.5 = AA normal text · 3.0 = AA large text and non-text UI (WCAG 1.4.11)
const checks = [
  ['body ink on page',            C.ink,       C.page,      4.5],
  ['body ink on paper',           C.ink,       C.paper,     4.5],
  ['body ink on warm paper',      C.ink,       C.paperWarm, 4.5],
  ['body ink on surface',         C.ink,       C.surface,   4.5],
  ['muted ink on page',           C.inkMuted,  C.page,      4.5],
  ['muted ink on paper',          C.inkMuted,  C.paper,     4.5],
  ['muted ink on surface',        C.inkMuted,  C.surface,   4.5],
  ['heading on page',             C.brandInk,  C.page,      4.5],
  ['heading on paper',            C.brandInk,  C.paper,     4.5],
  ['link/brand on page',          C.brand,     C.page,      4.5],
  ['link/brand on paper',         C.brand,     C.paper,     4.5],
  ['link/brand on surface',       C.brand,     C.surface,   4.5],
  ['eyebrow accent on page',      C.inkAccent, C.page,      4.5],
  ['eyebrow accent on paper',     C.inkAccent, C.paper,     4.5],
  ['primary btn text',            C.white,     C.brand,     4.5],
  ['primary btn hover text',      C.white,     C.brandDeep, 4.5],
  ['onDark btn text',             C.brandDeep, C.white,     4.5],
  ['onDark btn hover text',       C.brandDeep, C.sunSoft,   4.5],
  ['text on deep blue ground',    C.white,     C.brandDeep, 4.5],
  ['text on brand ground',        C.white,     C.brand,     4.5],
  // The night ground, and the one place brand orange is allowed to set text.
  ['text on night ground',        C.white,     C.night,     4.5],
  ['muted text on night ground',  '#d8d3cb',   C.night,     4.5],
  ['BRAND ORANGE as text on night', C.sun,     C.night,     4.5],
  ['success text',                C.ok,        C.okBg,      4.5],
  ['error text',                  C.err,       C.errBg,     4.5],
  ['error text on page',          C.err,       C.page,      4.5],
  ['input border on page',        C.lineStrong,C.page,      3.0],
  ['input border on paper',       C.lineStrong,C.paper,     3.0],
  ['input border on surface',     C.lineStrong,C.surface,   3.0],
  ['focus ring on page',          C.brand,     C.page,      3.0],
  ['focus ring on brand ground',  C.white,     C.brand,     3.0],
];

// Documented as graphic-only: orange is never allowed to carry text.
const graphicOnly = [
  ['sun marker on page (graphic only, ≥4px)', C.sun, C.page],
  ['sun marker on paper (graphic only, ≥4px)', C.sun, C.paper],
  ['hairline on page (decoration only)', C.line, C.page],
];

let fail = 0;
console.log('WCAG 2.2 contrast audit — Supra design tokens\n');
for (const [label, fg, bg, min] of checks) {
  const r = ratio(fg, bg);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(6)}:1  (min ${min})  ${label}`);
}
console.log('\nGraphic-only tokens — no contrast minimum applies (WCAG 1.4.11 exempts');
console.log('pure decoration); enforced by never using these for text:');
for (const [label, fg, bg] of graphicOnly) {
  console.log(`  --    ${ratio(fg, bg).toFixed(2).padStart(6)}:1           ${label}`);
}
console.log(fail ? `\n${fail} FAILURE(S)` : '\nAll text and UI pairs pass.');
process.exit(fail ? 1 : 0);
