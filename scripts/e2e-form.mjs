/**
 * End-to-end test of the conversion path, driven the way a person drives it.
 * Covers the Kompass -> contact form hand-off, keyboard-only submission, and
 * the error path. Usage: node scripts/e2e-form.mjs [baseUrl]
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:3111';
const results = [];
let contactId = null;

// A fresh address per run. The endpoint allows three submissions per address
// per hour, so a fixed test address makes the suite fail on its second run in
// an hour — which looks like a broken form and is actually the rate limiter
// doing its job.
const RUN = Date.now().toString(36);
const mail = (who) => `${who}-${RUN}@example.org`;
const check = (name, ok, detail = '') => {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
};

const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

// ---------------------------------- 1. Pflege-Kompass, mouse, mobile viewport
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  const p = await c.newPage();
  await p.goto(`${BASE}/pflegegrade-und-kosten`, { waitUntil: 'load' });

  await p.getByRole('radio', { name: /Pflegegrad 3/ }).check();
  await p.getByRole('button', { name: /^Weiter/ }).click();
  await p.getByRole('checkbox', { name: /Hilfe bei der Körperpflege/ }).check();
  await p.getByRole('checkbox', { name: /Unterstützung im Haushalt/ }).check();
  await p.getByRole('button', { name: /^Weiter/ }).click();
  await p.getByRole('radio', { name: /München/ }).first().check();
  await p.getByRole('button', { name: /Ergebnis anzeigen/ }).click();

  const shown = await p.textContent('body');
  check('Kompass shows the real PG3 figure', shown.includes('1.497'), 'expects 1.497 € from the BMG table');
  check('Kompass maps needs to services',
    shown.includes('Grundpflege') && shown.includes('Hauswirtschaftliche Versorgung'));

  await p.getByRole('link', { name: /Kostenlose Beratung anfragen/ }).click();
  await p.waitForURL(/\/kontakt\?/);
  const url = new URL(p.url());
  check('Kompass answers travel to the form',
    url.searchParams.get('grad') === '3' && url.searchParams.get('ort') === 'muenchen',
    url.search);
  const carried = await p.textContent('body');
  check('Carried-over answers are shown to the visitor', carried.includes('Aus dem Pflege-Kompass übernommen'));
  await c.close();
}

// ------------------------------------------- 2. Validation errors, then submit
{
  const c = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const p = await c.newPage();
  const apiResults = [];
  p.on('response', async (r) => {
    if (r.url().endsWith('/api/anfrage')) {
      try { apiResults.push({ status: r.status(), body: await r.json() }); } catch { /* no body */ }
    }
  });
  await p.goto(`${BASE}/kontakt`, { waitUntil: 'load' });

  // Submit empty: expect an error summary, focus moved to it, nothing sent.
  await p.getByRole('button', { name: /Anfrage senden/ }).click();
  const alert = p.getByRole('alert').first();
  await alert.waitFor({ timeout: 4000 });
  check('Empty submit shows an error summary', await alert.isVisible());
  const focused = await p.evaluate(() => document.activeElement?.getAttribute('role'));
  check('Focus moves to the error summary', focused === 'alert', `activeElement role=${focused}`);
  const invalid = await p.locator('[aria-invalid="true"]').count();
  check('Invalid fields are marked with aria-invalid', invalid >= 2, `${invalid} field(s)`);

  // A bad e-mail must be caught before anything is sent.
  await p.getByLabel(/Nachname/).fill('Browsertest');
  await p.getByLabel(/E-Mail-Adresse/).fill('kaputt');
  await p.getByLabel(/Was brauchen Sie/).fill('Automatisierter Browsertest der Formularstrecke.');
  await p.getByRole('button', { name: /Anfrage senden/ }).click();
  const emailErr = await p.textContent('[role="alert"]');
  check('Malformed e-mail is rejected', /E-Mail-Adresse sieht nicht vollständig aus/.test(emailErr));

  // Correct it and submit for real. The wait matters: the endpoint discards
  // anything submitted in under 2.5s as a bot, and answers "accepted" so a bot
  // learns nothing — which means a fast test would pass on a discarded row.
  await p.getByLabel(/E-Mail-Adresse/).fill(mail('browsertest'));
  await p.getByLabel(/Ich habe die/).check();
  await p.waitForTimeout(3000);
  await p.getByRole('button', { name: /Anfrage senden/ }).click();

  await p.getByRole('status').waitFor({ timeout: 15000 });
  const done = await p.textContent('[role="status"]');
  check('Successful submit shows a confirmation', /Ihre Anfrage ist angekommen/.test(done));
  const doneFocus = await p.evaluate(() => document.activeElement?.getAttribute('role'));
  check('Focus moves to the confirmation', doneFocus === 'status', `activeElement role=${doneFocus}`);

  const stored = apiResults.at(-1);
  check('Inquiry was actually stored (non-null id returned)',
    stored?.status === 200 && typeof stored.body?.id === 'string' && stored.body.id.length > 0,
    `id=${stored?.body?.id ?? 'null'}`);
  contactId = stored?.body?.id ?? null;
  await c.close();
}

// -------------------------------------------- 3. Keyboard-only job application
{
  const c = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const p = await c.newPage();
  const jobResults = [];
  p.on('response', async (r) => {
    if (r.url().endsWith('/api/anfrage')) {
      try { jobResults.push({ status: r.status(), body: await r.json() }); } catch { /* no body */ }
    }
  });
  await p.goto(`${BASE}/karriere`, { waitUntil: 'load' });

  await p.getByLabel(/Nachname/).focus();
  await p.keyboard.type('Tastaturtest');
  await p.keyboard.press('Tab'); // -> e-mail
  await p.keyboard.type(mail('tastatur'));
  await p.getByLabel(/Ihre Nachricht/).focus();
  await p.keyboard.type('Bewerbung über Tastatur eingegeben, automatisierter Test.');
  await p.getByLabel(/Ich habe die/).focus();
  await p.keyboard.press('Space');
  const checked = await p.getByLabel(/Ich habe die/).isChecked();
  check('Consent box is operable with the keyboard', checked);

  await p.waitForTimeout(3000);
  await p.getByRole('button', { name: /Bewerbung senden/ }).focus();
  await p.keyboard.press('Enter');
  await p.getByRole('status').waitFor({ timeout: 15000 });
  check('Keyboard-only application submits',
    /Ihre Bewerbung ist angekommen/.test(await p.textContent('[role="status"]')));
  const storedJob = jobResults.at(-1);
  check('Application was actually stored (non-null id returned)',
    storedJob?.status === 200 && typeof storedJob.body?.id === 'string',
    `id=${storedJob?.body?.id ?? 'null'}`);
  await c.close();
}

// ------------------------------------------------- 4. Mobile menu, keyboard
{
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, locale: 'de-DE' });
  const p = await c.newPage();
  await p.goto(`${BASE}/`, { waitUntil: 'load' });
  // Located by aria-controls, not by label: the accessible name deliberately
  // changes from "Menü" to "Schließen" when the drawer opens.
  const toggle = p.locator('button[aria-controls="mobilmenue"]');
  await toggle.click();
  check('Mobile menu reports expanded state',
    (await toggle.getAttribute('aria-expanded')) === 'true');
  await p.keyboard.press('Escape');
  check('Escape closes the mobile menu',
    (await toggle.getAttribute('aria-expanded')) === 'false');
  const refocused = await p.evaluate(() =>
    document.activeElement?.getAttribute('aria-controls'));
  check('Focus returns to the toggle after Escape', refocused === 'mobilmenue', `focus on [aria-controls=${refocused}]`);
  const drawerHidden = await p.locator('#mobilmenue').isHidden();
  check('Drawer is hidden from assistive tech when closed', drawerHidden);
  await c.close();
}

// ------------------------------------ 5. The bot traps discard, not just pass
{
  const c = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'de-DE' });
  const p = await c.newPage();
  const fast = [];
  p.on('response', async (r) => {
    if (r.url().endsWith('/api/anfrage')) {
      try { fast.push(await r.json()); } catch { /* no body */ }
    }
  });
  await p.goto(`${BASE}/kontakt`, { waitUntil: 'load' });
  await p.getByLabel(/Nachname/).fill('Schnellbot');
  await p.getByLabel(/E-Mail-Adresse/).fill(mail('schnellbot'));
  await p.getByLabel(/Was brauchen Sie/).fill('Sofort abgeschickt, sollte verworfen werden.');
  await p.getByLabel(/Ich habe die/).check();
  await p.getByRole('button', { name: /Anfrage senden/ }).click();
  await p.getByRole('status').waitFor({ timeout: 15000 });
  const r = fast.at(-1);
  // Accepted on the surface, discarded underneath: id must be null.
  check('Sub-2.5s submit is silently discarded', r?.ok === true && r?.id === null, `id=${String(r?.id)}`);
  await c.close();
}

await b.close();
console.log(`\nStored contact inquiry id: ${contactId ?? 'none'}`);
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
process.exit(failed.length ? 1 : 0);
