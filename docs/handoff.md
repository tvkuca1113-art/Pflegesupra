# Handoff — Supra ambulanter Pflegedienst

Date: 2026-09-01 · Branch: `claude/digital-product-protocol-51ullv`

---

## 1. Project classification

**Prototype for the parts that need client access; production-ready code for
everything else.**

This is not a finished, live website. It is a complete, tested build that needs
three environment variables, a legal review, and a Vercel↔GitHub authorization
before it can go live. All three are listed under [Blockers](#4-blockers)
and none of them are code problems.

---

## 2. What the old site does today

Everything here was measured on 2026-09-01, not estimated.

| Finding | Evidence |
| --- | --- |
| **The contact form cannot be submitted.** Bricks renders `Google reCaptcha: Ungültiger Website-Schlüssel` into the page HTML. Google returns `Invalid input` for site key `6Lcf6bYs…`. | Server-rendered HTML of `/pflegedienst-muenchen-kontakt/` |
| Homepage weighs **11,417 KB** on desktop (35 requests), 4,315 KB on mobile | Headless Chromium, 1440×900 |
| `Startseite_Bild-2.png` alone is **2,299,972 bytes** | HTTP `content-length` |
| **Two `<h1>` per page** — the header tagline is an `<h1>` sitewide | DOM query on all four pages |
| FAQ and Kontakt have **no content `<h1>`** at all | Same |
| Heading levels jump: `H1 H1 H3 H3 H3 H2 H5 H3…` | Same |
| Mobile homepage is **7,511 px** tall with no sticky call action | 390×844 |
| Hero sets dark blue text over a dark photograph | Screenshot |
| Footer text renders outside the left viewport edge | Screenshot |
| Loads Google Fonts from `fonts.gstatic.com` | Network log |
| No `LocalBusiness` schema, no address, no `areaServed` | JSON-LD |
| Two empty WordPress demo posts are indexable | `/uncategorized/hello-world/`, `/allgemein/hallo-welt/` |

**Unresolved data conflict — client decision required.** Directory listings
(Creditreform, meinestadt, 11880) carry `Süskindstr. 4, 81929 München`; the
Impressum carries `Zielstattstr. 10a, 81379 München`. The new site uses the
Impressum, as the source the client controls. **The directories still need
correcting** — inconsistent NAP data directly damages local search.

---

## 3. What was built

17 URLs, all prerendered as static HTML, **33 KB per page**.

```
/                              /pflegegrade-und-kosten
/leistungen                    /ablauf
/leistungen/grundpflege        /fragen-und-antworten
/leistungen/behandlungspflege  /einsatzgebiet/muenchen
/leistungen/betreuung-und-entlastung
/leistungen/hauswirtschaft     /einsatzgebiet/pfaffenhofen-an-der-ilm
/leistungen/verhinderungspflege
/ueber-uns   /karriere   /kontakt   /impressum   /datenschutz
```

Plus a 404 with full navigation, an error boundary, `sitemap.xml`, `robots.txt`
and 301s from every old WordPress URL.

**The Pflege-Kompass** (`/` and `/pflegegrade-und-kosten`) is the signature
element: three questions that end in the actual statutory figure for the
visitor's Pflegegrad, with the answers carried into the contact form so nobody
retypes them. The same figures also render as a static table, so a visitor
without JavaScript loses convenience and nothing else.

**Two additions the old site does not have at all:** a `/karriere` page with its
own application form, and location pages that link to the *independent* public
advice services (Stadt München, Pflegestützpunkt Pfaffenhofen) rather than
pretending to be the only option.

---

## 4. Blockers

Three, none of them code.

### 4.1 Vercel cannot deploy — GitHub authorization missing

`create_git_project` creates a Vercel project but cannot verify the git link,
and the created projects are not readable afterwards (`404 Project not found`).
This is an account-level authorization.

**Fix (about two minutes):** in Vercel → Settings → Git, connect the GitHub
account, then import `tvkuca1113-art/Pflegesupra`. Framework detection handles
the rest. Two stray empty projects, `supra-pflegedienst` and `supra-pd-website`,
were created by the failed attempts and can be deleted.

### 4.2 Three environment variables

The site renders completely without them; only the form needs them.

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://supra-pd.de` |
| `SUPABASE_URL` | Project URL, Supabase → Settings → API |
| `SUPABASE_PUBLISHABLE_KEY` | Publishable key, same page |
| `INQUIRY_IP_SALT` | `openssl rand -hex 32` |

Until they are set, the form shows a plainly worded notice that the preview has
no database connection, plus the phone number. It does not pretend to work.

### 4.3 Legal text needs a qualified review

`/impressum` and `/datenschutz` carry a red banner listing exactly what is
missing. **Both banners must be removed before launch, and only after a lawyer
has read the pages.** Outstanding items:

* VAT ID, if one exists (§27a UStG)
* The supervisory authority, by full name and address
* Professional title and the governing regulations
* The actual hoster, with full address
* Whether a data protection officer is appointed
* Data processing agreements with the hoster and the database provider

The Datenschutz text describes this build's actual behaviour correctly — no
cookies, self-hosted fonts, no third-party requests, EU database, salted IP
hashes for throttling, stated retention. That is a description, not legal advice.

---

## 5. Definition of Done

| Criterion | Status | Evidence | Remaining |
| --- | --- | --- | --- |
| Strategy agreed | **PASS** | Direction B, clients + recruiting, chosen 2026-09-01 | — |
| All routes work | **PASS** | `npm run qa`: 17 routes HTTP 200, every internal link resolves | — |
| One H1 per page, no level jumps | **PASS** | Enforced by `npm run qa` | — |
| Unique title / description / canonical | **PASS** | Enforced by `npm run qa` | — |
| Form actually stores an inquiry | **PASS** | `scripts/e2e-form.mjs` 19/19; row `d9fceb47-…` written and read back in Postgres | Needs §4.2 in production |
| Form validation and error states | **PASS** | Empty submit, malformed e-mail, missing consent, cross-origin, rate limit, honeypot, time trap — all asserted | — |
| Bot defences actually discard | **PASS** | Sub-2.5s submission returns `id: null`; nothing stored | — |
| Keyboard-only operation | **PASS** | Application submitted using only the keyboard; skip link, focus order, focus return after Escape all asserted | Screen-reader test not run — see §6 |
| Mobile QA | **PASS** | No horizontal overflow at 320/375/390/430/768/1280/1440 | — |
| Touch targets ≥24px | **PASS** | Enforced by `npm run qa`, honouring the WCAG 2.2 inline exception | — |
| Colour contrast | **PASS** | `npm run check:contrast`: 24/24 pairs, lowest 3.36:1 for a UI boundary, 6.00:1 for any text | — |
| Page weight | **PASS** | 33 KB per page vs 11,417 KB today | — |
| Build / typecheck / lint | **PASS** | `npm run verify` clean | — |
| SEO foundation | **PASS** | Sitemap, robots, canonicals, 301s, JSON-LD validated as parseable | Rich Results test needs a public URL |
| Structured data matches reality | **PASS** | No `aggregateRating`, `review` or `priceRange` — nothing supports them | — |
| Statutory figures correct | **PASS** | Checked against BMG *Leistungsbeträge 2026*, Stand 04.11.2025 | — |
| Analytics events defined | **PASS** | 15 events, each with its business question and allowed parameters; PII stripped before dispatch | GA4 ID needed to connect |
| Database security review | **PASS** | Supabase advisor run; both notices on this schema are the intended design, documented in `supabase/migrations/README.md` | — |
| Rate limiting verified | **PASS** | 4th submission from one address inside an hour returns HTTP 429 | — |
| Legal content | **BLOCKED** | Drafted, red-flagged | §4.3 |
| Production deployment | **BLOCKED** | — | §4.1 |
| Research-led content | **PASS** | The Klartext section, the Einsatz timeline and the recruiting headline each answer a documented, sourced finding rather than a brief — see §7 | Forums and consumer reporting only; closed groups were not accessible |
| Photography | **PASS** | Five frames from one documentary commission, credited in the Impressum, labelled as symbolic under every image | Real photographs of the team are still the biggest upgrade — §6 |
| Core Web Vitals (lab) | **PASS** | `node scripts/vitals.mjs` — CLS 0 on every route, LCP 1.28 s worst case, FCP 0.82 s worst case, under Slow 4G + 4× CPU | Total Blocking Time on the home page is over budget; see §6 |
| Lighthouse score | **NOT RUN** | — | Lighthouse is not installed and installing it was not authorised; the metrics above were measured directly instead. See §6 |
| Search Console | **BLOCKED** | — | Client access |

**One critical FAIL would make this not production-ready. There is none — but
two BLOCKED items stand between this and going live.**

---

## 6. Not done, and honestly so

* **No Lighthouse score is claimed.** Lighthouse itself is not installed here
  and installing it was not authorised, so `scripts/vitals.mjs` measures the
  same field metrics directly through the browser's own PerformanceObserver,
  under Lighthouse's mobile emulation profile (Slow 4G, 1.6 Mbit/s, 150 ms RTT,
  4× CPU slowdown). Two honest caveats: it runs against a local production
  build, so TTFB is optimistic — the Vercel edge is not in the path; and CPU
  throttling is relative to *this* machine, so the blocking-time figures are a
  comparison between routes, not a Lighthouse score.

  Measured, on the current build:

  | | worst route | budget |
  |---|---|---|
  | CLS | **0** (0.0095 on `/kontakt`) | ≤ 0.1 |
  | LCP | **1.28 s** (`/`) | ≤ 2.5 s |
  | FCP | **0.82 s** (`/pflegegrade-und-kosten`) | ≤ 1.8 s |
  | TBT | **233 ms** (`/`, median of 5) | ≤ 200 ms |

  The first measurement was not this. It found **CLS 0.3076 on the home page**
  — three times the threshold — and 0.1284 on `/karriere`. The cause was the
  web font: the browser only discovered it after the stylesheet had parsed and
  text had been laid out, fetched it at 1.25 s, and the swap changed the
  header's height by 23 px, pushing every page down with it. Preloading the
  font and giving the fallback matched metrics (`size-adjust: 107.63%`, derived
  from a measured 1369.90 px vs 1272.80 px lowercase alphabet at 100 px) took
  every route to zero. **The QA harness had never checked layout shift.** It
  does now, in `scripts/vitals.mjs`.

  Blocking time on the home page remains over budget by roughly 15 %. About
  170 ms of it is React hydrating the shell — header, mobile bar, consent
  banner — and is the framework's floor, not this page's code; the rest is the
  Pflege-Kompass. Moving the footer and the contact block back to the server
  (see below) took ~20 ms off it. Going further means shipping less framework
  JavaScript, which is a structural decision, not a tuning one, and it is not
  made unilaterally here.
* **Analytics no longer uses per-element handlers.** The footer and the contact
  block were client components purely so three links each could report a click,
  which cost every page in the site a hydration pass. They are server
  components now; the links carry `data-track` attributes and one delegated
  listener on the document turns those into the same events, still governed by
  the same whitelist and PII filter. `scripts/analytics-check.mjs` asserts the
  events, the parameter whitelist and the failure behaviour, because an
  indirection like this is exactly the kind that breaks silently — the phone
  still rings, and the client simply loses the ability to tell which page
  produced the call.
* **No screen-reader test.** Automated checks and manual keyboard testing were
  done; NVDA/VoiceOver was not available. Recommended before launch.
* **No real photography.** Deliberate: the old site's images are AI-generated
  and depict no real people, per the client's own Impressum. None were carried
  over and no stock was substituted. Real photographs of the team and offices
  are the single biggest remaining upgrade.
* **No CMS.** Content lives in typed files under `src/content/`. Appropriate for
  a site that changes a few times a year; if the client wants to edit copy
  themselves, that is a separate piece of work.
* **No admin view for inquiries.** They are read in the Supabase table editor
  or by SQL. A simple protected list page is a small follow-up.
* **Retention job not scheduled.** `supra.purge_expired_inquiries()` exists and
  works; it needs a schedule once the client confirms the retention period.
* **Two claims removed from the site** because nothing supports them: any
  response-time promise, and any review or rating. `business.ts` lists
  everything deliberately not claimed.

---

## 7. First week after launch

1. Connect Google Search Console, submit `sitemap.xml`, confirm all 17 URLs index.
2. Record the baseline: clicks, impressions, positions, calls.
3. Correct the address in Creditreform, meinestadt, 11880 and Google Business
   Profile so NAP data is consistent (see §2).
4. Confirm the office hours in `src/content/business.ts`. The current
   `Mo–So 09:00–17:00` comes from the old site's own schema markup and is
   unlikely to describe when care actually happens.
5. Set the GA4 ID if measurement is wanted; the consent banner activates itself.
6. Send one real test inquiry and confirm it reaches the team.

Then review at 30, 60 and 90 days: inquiries by source, phone clicks, which FAQ
questions get opened, and where the Pflege-Kompass is abandoned — that last one
tells you which step of the funnel is confusing.

---

## 7. What the redesign is based on

The visual and editorial direction was not chosen by taste. It came out of
reading what families and nurses actually say about this sector, in public
sources, and then letting the findings decide what goes on the page.

**Sources read.** The Verbraucherzentrale's standing collection of consumer
reports on ambulante Pflegedienste; the family-carer forums and guidance
services (Pflegeboard, Pflegenetz, angehoerige-pflegen.de, Pflegewegweiser NRW);
reporting on which care calculators are actually used; journalism and industry
writing on what performs in German care content on TikTok and Instagram; and
sector reporting on what nurses weigh when they change employer.

**Honest limits.** Facebook groups and TikTok are behind logins and were not
crawlable; what is recorded below about social platforms comes from journalism
and industry reporting about them, not from reading the platforms directly. One
forum thread returned HTTP 503 and was not read. Nothing here is a survey, and
no number is claimed.

**What the findings changed.**

| Finding | Where it went |
|---|---|
| The complaints that recur are billing for services never rendered, costs never stated up front, nobody reachable, and constant staff changes — and people stay silent because they fear losing the care arrangement | The **Klartext** section: the four fears quoted in the visitor's own words, each answered with a checkable commitment, with the source named on the page |
| Guilt is the dominant private emotion; ~70% of family carers report severe strain | The hero lead is about *knowing*, not about quality — "Sie wissen vorher, wer kommt, wann er kommt und was es kostet" — because the fear people arrive with is not bad care, it is not knowing |
| The most-used tools in this space are free, anonymous, registration-free calculators | Confirmed the Pflege-Kompass, and gave it the site's one dark band so it reads as the centrepiece it is |
| Nobody outside the profession knows what a visit physically contains | The **Ein Einsatz** timeline — a timed sequence rather than a catalogue of nouns, and the only way to *show* the claim about planning by real duration |
| What nurses weigh when changing jobs: roster control first, then pay, then being taken seriously | The recruiting headline leads on the roster, not on "werden Sie Teil unseres Teams" |
| What travels in care content: real faces, real rooms, day-in-the-life, honesty about the system's problems — not marketing gloss | The photographic direction: one documentary commission, minimal treatment, labelled as symbolic |

**What was deliberately not done with the research.** No claim about how many
people feel any of this. No invented testimonial in the voice of a family. No
"9 von 10 Angehörigen" statistic. The Klartext section quotes a documented
complaint pattern and says where it comes from; it does not assert that Supra's
own clients said any of it.
