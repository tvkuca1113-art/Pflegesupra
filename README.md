# Supra ambulanter Pflegedienst — Website

Redesign of [supra-pd.de](https://supra-pd.de) for Supra ambulanter Pflegedienst
(München · Pfaffenhofen a.d. Ilm).

**Status: Production-ready code, pending three environment variables and a legal
review.** See [Definition of Done](#definition-of-done) for exactly what is
proven and what is blocked.

---

## Running it

```bash
npm install
cp .env.example .env.local     # then fill in the values, see below
npm run dev                    # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run build` | Production build. 17 routes, all prerendered as static HTML. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm run lint` | ESLint (next/core-web-vitals + next/typescript). |
| `npm run check:contrast` | Audits every design token pair against WCAG 2.2. Fails the run on a regression. |
| `npm run qa` | Crawls a running site: headings, metadata, links, overflow at 7 widths, touch targets, keyboard, 404. |
| `npm run verify` | typecheck + lint + contrast + build. |

`npm run qa` and `node scripts/e2e-form.mjs` need the site running
(`npm run build && npm start`, then pass the base URL, default
`http://127.0.0.1:3111`).

## Environment variables

Copy `.env.example`. Nothing here is optional for the contact form to work.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph. |
| `SUPABASE_URL` | Project URL of the inquiry database. |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key. Used **server-side only**. |
| `INQUIRY_IP_SALT` | Salt for hashing caller IPs before throttling. `openssl rand -hex 32`. |
| `NEXT_PUBLIC_GA_ID` | Optional. While empty, the site sets no cookies and shows no consent banner. |

The service-role key is deliberately **not used anywhere**. See below.

---

## How the contact form works

The browser never talks to the database.

```
Browser ──POST /api/anfrage──► Route handler ──RPC──► Postgres
                               │                      │
                               │ same-origin check    │ supra.inquiries
                               │ honeypot + time trap │ (schema unexposed,
                               │ shared validation    │  RLS on, no policies)
                               │ salted IP hash       │
```

* The `supra` schema is **not exposed through PostgREST**, so no HTTP client can
  reach the table. Verified: `Accept-Profile: supra` returns `PGRST106`.
* RLS is enabled with **zero policies**, which denies everything.
* The only entry point is `public.supra_submit_inquiry`, a `SECURITY DEFINER`
  function that validates, throttles and inserts. It **cannot read**.
* Consequence: the deployment holds no secret whose leak would expose an
  inquiry. Worst case, someone can submit a form — which a public website
  permits anyway.

**No CAPTCHA, deliberately.** The old site's reCAPTCHA site key is invalid, and
Bricks renders `Google reCaptcha: Ungültiger Website-Schlüssel` into the page, so
every submission has been silently blocked. A spam defence that can fail closed
on the only form that earns the business is the wrong trade. The layers above
fail open for humans and closed for scripts.

### Reading the inquiries

Until an admin view exists, the team reads them in the Supabase table editor, or:

```sql
select created_at, kind, first_name, last_name, email, phone, topic, message, status
from supra.inquiries
where status = 'neu'
order by created_at desc;
```

Workflow columns: `status` (`neu` / `in_arbeit` / `erledigt` / `spam`),
`handled_at`, `note`.

Retention: `select supra.purge_expired_inquiries();` deletes anything older than
two years past handling. **Schedule this** (pg_cron or an external scheduler)
once the client confirms the retention period they want.

---

## Content and facts

`src/content/` is the single source of truth. Nothing there is invented.

| File | Contains | Source |
| --- | --- | --- |
| `business.ts` | Name, owner, addresses, phone, hours | The client's own Impressum and Kontakt pages, retrieved 2026-09-01 |
| `pflege.ts` | All statutory amounts | BMG, *Leistungsansprüche der Versicherten im Jahr 2026*, Stand 04.11.2025 |
| `services.ts` | Service catalogue | Rewritten from the client's own Leistungen and FAQ pages; legal substance unchanged |
| `faq.ts` | FAQ | The client's FAQ plus the questions their copy raises but never answers |
| `areas.ts` | Location pages | Client addresses; official advice contacts verified against stadt.muenchen.de and landkreis-pfaffenhofen.de |

`business.ts` also exports `unverified` — a list of claims **deliberately not
made anywhere on this site** because no source supports them: staff numbers,
client numbers, reviews, certificates, response times. Do not fill these in
without evidence.

**When the BMG amounts change** (next scheduled adjustment 01.01.2028): edit
`src/content/pflege.ts` only. The Kompass, the table and the service pages all
read from it.

---

## Design system

`src/app/globals.css`. Two rules govern every colour decision, and they come
from the logo, whose colours were sampled from the client's own file:

1. **Blue (`#003399`) carries structure and action.** 10.86:1 on white — the
   only brand colour that clears WCAG AA everywhere, so it is the only one
   allowed to fill a button or set body text.
2. **Orange (`#FF6600`) marks, it never speaks.** 2.94:1 on white, below AA for
   text and below 3:1 for UI. So it appears only as a graphic mark of at least
   4px — the Horizont rule, list markers, the active-nav underline. Where orange
   must carry words, `--color-ink-accent` (`#A83B00`, 6.38:1) is used instead.

`npm run check:contrast` enforces this. It already caught the input border at
2.49:1 during development.

Author CSS lives in `@layer base` / `@layer components`. **Do not write
unlayered CSS** — it outranks every Tailwind utility and silently breaks
`text-4xl`, `lg:hidden` and the rest. That bug shipped once and was caught by QA.

The type scale, colours, radii and shadows are declared in `@theme`, so
`text-4xl`, `bg-brand-deep`, `rounded-lg` are real Tailwind utilities built from
our tokens. Avoid `text-[var(--…)]` — Tailwind reads it as a *colour*.

---

## Imagery

There is none, on purpose.

The current site's own Impressum states its images are AI-generated and show no
real people. On a care provider's website that quietly undermines the trust the
site exists to build, so none of it was carried over, and no stock photography
was substituted. `SunriseMark.tsx` — an abstraction of the logo's rising sun —
carries the brand instead. It cannot mislead anyone.

**This is a placeholder for real photographs**, not a final answer. Once the
client has photographs of the actual team, offices and (with consent) care
situations, they belong in the hero, on `/ueber-uns` and on `/karriere`.

---

## SEO

* 17 indexable URLs, all prerendered. `sitemap.xml` and `robots.txt` generated.
* Exactly one `<h1>` per page, no heading-level jumps — both enforced by `npm run qa`.
* Unique `<title>`, description and canonical per URL — also enforced.
* JSON-LD: `MedicalBusiness`/`Organization` + `WebSite` sitewide, plus
  `BreadcrumbList`, `Service` and `FAQPage` where they apply. The graph omits
  `aggregateRating`, `review` and `priceRange` because nothing supports them.
* 301s from every old WordPress URL are in `next.config.mjs`.

### Old → new URL map

| Old | New |
| --- | --- |
| `/ambulante-pflege-muenchen-leistungen/` | `/leistungen` |
| `/ambulante-pflege-muenchen-faq/` | `/fragen-und-antworten` |
| `/pflegedienst-muenchen-kontakt/` | `/kontakt` |
| `/uncategorized/hello-world/`, `/allgemein/hallo-welt/` | `/` |
| `/category/*`, `/author/*` | `/`, `/ueber-uns` |
| `/impressum/`, `/datenschutz/` | unchanged |

---

## Analytics

`src/lib/analytics.ts` defines every event, the business question it answers and
the parameters it may carry. Three rules are enforced in code, not by convention:

1. Nothing fires before consent. Events are queued in memory and dropped if
   consent is declined.
2. Payloads are whitelisted, and anything resembling an e-mail, phone number or
   address is stripped before it leaves the browser.
3. Events land in `window.dataLayer`, so GTM or GA4 can consume them as soon as
   `NEXT_PUBLIC_GA_ID` is set.

---

## Definition of Done

See the handoff notes in `docs/handoff.md`.
