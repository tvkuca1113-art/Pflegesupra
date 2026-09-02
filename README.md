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
| `npm run check:hero` | Renders the hero and measures text contrast against the real pixels beneath it, at three viewports. Needs the site running. |
| `npm run qa` | Crawls a running site: headings, metadata, links, overflow at 7 widths, touch targets, keyboard, 404. |
| `npm run check:vitals` | Measures LCP, CLS, FCP and blocking time on five routes under Slow 4G + 4× CPU. Needs the site running. |
| `npm run check:analytics` | Asserts that the delegated click tracking still fires the conversion events. Needs a build made with `NEXT_PUBLIC_GA_ID` set. |
| `npm run verify` | typecheck + lint + contrast + build. |

`npm run qa`, `npm run check:hero`, `npm run check:vitals` and
`node scripts/e2e-form.mjs` need the site running (`npm run build && npm start`,
then pass the base URL, default `http://127.0.0.1:3111`).

`npm run check:analytics` additionally needs the build to have been made with a
measurement ID — `NEXT_PUBLIC_GA_ID=G-TEST0000 npm run build` — because without
one the consent banner never appears and every event stays queued by design.

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

Three more rules that exist because breaking them shipped a visible bug:

* **`overflow-wrap: anywhere`, never `break-word`.** They look identical until a
  long German compound sits in a flex or grid item: `break-word` still reports
  the whole word as the element's min-content width, so the container is forced
  wider than its parent. `anywhere` shrinks min-content too.
* **No `&nbsp;` in headings.** Gluing "Pfaffenhofen a.d. Ilm." into one
  22-character token pushed the headline off the right edge of a phone.
* **`text-wrap: balance` only from `48rem` up.** Shipped Safari versions can
  produce a balanced line wider than its container; with `overflow: hidden` on
  an ancestor the text is then silently sliced rather than scrolled.

The type scale, colours, radii and shadows are declared in `@theme`, so
`text-4xl`, `bg-brand-deep`, `rounded-lg` are real Tailwind utilities built from
our tokens. Avoid `text-[var(--…)]` — Tailwind reads it as a *colour*.

---

## Imagery, and what carries the first screen

The hero carries a **real photograph** — two hands holding another pair of
hands — by Thomas Griggs, licensed via Unsplash, credited in the Impressum.

It is used as **atmosphere only**. The Impressum states plainly that it shows
neither Supra's staff nor its clients nor its premises, because it does not.
That distinction is the whole point: the client's current site uses
AI-generated images of people who do not exist and says so in its own
Impressum, which is corrosive on a care provider's site. A real, licensed,
honestly-labelled photograph is not the same thing as a fabricated one.

**Replace it** with photographs of the actual team and offices as soon as they
exist. `src/components/HeroBackdrop.tsx` is the only file to touch.

### Where the photograph sits, and why the scrim is what it is

The photograph is the hero's **background**, behind the text, on every
breakpoint. Getting it to read there took three wrong turns worth recording:

1. A landscape crop scaled by `object-cover` into a 1,285px-tall box showed
   about 17% of its width — a slice of background bokeh. **Match the crop's
   aspect to its container.**
2. Darkening the image *and* putting a heavy scrim on top left nothing to see.
   The image files now use the BRIGHT treatment; the scrim alone does the
   contrast work.
3. The backdrop covered the whole hero `<section>` — but the "Was passiert"
   card lives in that section too and stacks underneath on a phone, forcing the
   background into a ~0.28 aspect. `HeroPhotoBackdrop` is therefore bounded to
   the **text block**, full-bleed via `left-1/2 -translate-x-1/2 w-screen`, so
   the ratio is about 0.7 and a real crop fills it. The card below sits on solid
   brand ink.

There is a floor here that no amount of tuning removes: on a phone the hero
text covers the hero, so the photograph must sit under a scrim. The scrim is as
light as the measurement allows and no lighter — currently 5.19:1 at its worst
point against a 4.5:1 requirement.

### Other decisions worth keeping

* **Duotone is baked into the files** (sharp: adjust levels, then `tint()` with
  brand chroma) rather than applied as a CSS filter — no runtime cost, and it
  cannot fail to load separately from the image. Note `greyscale()` must NOT be
  used before `tint()`: sharp's pipeline runs greyscale last and cancels it.
* **Match the crop's aspect to its container.** An early landscape crop was
  scaled by `object-cover` to fill a 1,285px-tall box, showing about 17% of its
  width — a slice of background bokeh. If you re-crop, check the aspect first.
* **Each image is fetched only at its own breakpoint, and this needs care.**
  An `<img>` inside a `display:none` container **is still downloaded**. Measured
  twice, costing ~20 KB each time. The desktop backdrop is therefore a CSS
  `background-image` declared inside `@media (min-width: 64rem)` — a background
  in a non-matching media query is never requested. The band's `<source>`s are
  media-scoped and its `<img>` fallback is a 1×1 transparent GIF, so desktop
  does not pull the phone crop either.
* AVIF with WebP fallback. The homepage transfers **47 KB on mobile**, 72 KB on
  desktop; the current site's mobile homepage is 4,315 KB.
* **Headings do not hyphenate.** `hyphens: auto` split the headline as
  "Mün-chen", which reads as a fault. Body copy still hyphenates, where German
  compounds need it; `overflow-wrap: anywhere` remains the backstop.

### Contrast is measured, never assumed

`npm run check:hero` renders the page, hides the hero text, photographs the
ground underneath and checks each text colour against the *lightest* pixel it
actually sits on, at three viewports, compositing `text-white/85` properly.

**The overlay opacities in `HeroBackdrop.tsx` are the output of that
measurement.** One pass lightened them until the hours note measured 4.21:1 —
that line moved to `text-white/85` rather than darkening the image again.

`SunriseMark.tsx` — the logo's geometry as a shallow band — heads the "Was
passiert, wenn Sie anrufen" card. Only one sun shows at a time: below `lg` the
backdrop draws it, from `lg` up the card carries it.

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
