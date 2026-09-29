# Homepage redesign — September 2026

The opening image now fills the complete hero. A continuous light scrim supports dark HTML text without covering either face. On narrow screens, the photograph uses a right-hand focal point and fades into the reading area; it remains one section. Navigation is shorter on desktop, with all original destinations retained in the mobile menu and footer.

Services now have four contextual photographs, followed by a separate respite-care link. The page continues through the approach to care, the existing Pflege-Kompass, four steps, native FAQ disclosures, locations and a recruitment photograph. Forms, budget calculations, contact details, legal pages and route metadata retain their existing behavior.

## Design references reviewed

- Home Instead USA — https://www.homeinstead.com/ — short explanation and a clear enquiry path.
- Home Instead UK — https://www.homeinstead.co.uk/ — human-scale care photography and calm, readable hierarchy.
- Persona Studio's first-party case study — https://persona.studio/work/home-instead/ — empathy, clear information and consistent visual direction.
- Vesta Care Dubai — https://www.vestacare.ae/ — direct access to services and contact, blue brand continuity.
- Vesta Care Dubai Instagram — https://www.instagram.com/vestacaredubai/ — consistent blue branding and practical service explanations, viewed in the authorized Instagram session.
- Home Instead UK Instagram — https://www.instagram.com/homeinsteaduk/ — approachable people and practical answers, viewed in the authorized Instagram session.

These are design references, not a claim that every website won a design award. No competitor photographs, reviews, rankings or outcome claims were copied.

## New image

`assets/photos/supra-home-hero-v2.jpg` is an AI-generated illustrative scene, produced using the built-in image-generation tool. The supplied existing Supra logo was the branding reference. It does not portray real Supra staff or clients. Existing Symbolbild and Impressum disclosures remain, and the new image's origin is recorded in the Impressum.

Art direction / prompt: a single wide editorial photograph in a lived-in Munich home; an older woman and a caregiver in a navy Supra polo converse at a light oak table, both on the right; soft natural window light, believable skin and fabric, warm cream wall and quiet space on the left for dark HTML copy; a small Supra logo embroidered on the uniform; no text/UI baked into the image, no plastic skin, no medical clichés.

Regenerate all corrected renditions with `node scripts/build-photo-retouches.mjs` (also included in the standard image build). Hero widths are 960, 1600 and 1774 pixels; service/recruitment widths are 600, 900 and 1400 pixels, all in AVIF and WebP. The hero component remains server rendered; only the hero loads eagerly. Other editorial photos remain lazy loaded.

## Image anatomy review and corrections

The user reported merged fingers in the new hero. Every distinct photographic scene and its placements was reviewed at the largest available rendition, including the older hero/share image. Logos and icons contain no anatomical content. The built-in image-generation editor was used for three targeted corrections; the untouched originals remain in Git history.

| Scene | Review / action |
| --- | --- |
| New homepage hero | Replaced ambiguous overlapping caregiver hands with a relaxed single hand on the table and the other naturally below it; reviewed the senior's cup grip. |
| Grundpflege / Haltung | Corrected the senior's hanging hands, finger separation, cuff/wrist transitions and jacket grips; both crops use the same corrected master. |
| Karriere | Corrected the tablet-supporting hand and reviewed the pointing finger, tablet edges and bag grips. |
| Behandlungspflege | Reviewed pointing hand, dispenser support, seven compartments and seated senior; no clear anatomical defect found. |
| Betreuung | Reviewed cup and saucer grips, wrists and arm continuity; no clear anatomical defect found. |
| Hauswirtschaft | Reviewed hands, grocery bag, packaging and arm continuity; no clear anatomical defect found. |
| Beratung | Reviewed document grip, senior's hands, cups and three-person composition; no clear anatomical defect found. |
| Previous hero / share preview | Reviewed both seated people and hands; no clear anatomical defect found. |

Corrected masters: `assets/photos/supra-home-hero-v2.jpg`, `assets/photos/grundpflege-retouched.jpg`, `assets/photos/karriere-retouched.jpg`. New `supra-home-hero-v3-*`, `grundpflege-v2-*`, `haltung-v2-*` and `karriere-v2-*` filenames prevent old cached images from being selected on any page.

Edit prompts (built-in image editor): preserve faces, embroidered Supra logos, rooms, lighting and framing; repair only local hand anatomy and object contact. Hero: one relaxed palm-down caregiver hand with four natural fingers and a thumb, other hand on lap; natural cup grip. Grundpflege: relaxed elderly hands with distinct plausible fingers, aligned wrists/cuffs and coherent caregiver jacket grips. Karriere: one normal hand supporting the tablet, other index touching the screen, plausible hidden fingers and clean tablet edges; natural bag grips.

## Checks

- TypeScript check, ESLint, existing design-token contrast check and production build passed.
- Live browser checks: mobile menu opens and closes with Escape; all three Pflege-Kompass choices lead to an appropriate result and consultation URL; FAQ disclosures open; no horizontal overflow at 320, 390, 768 and 1024 pixel review widths.
- Visual review prompted a compact mobile utility strip, deliberate two-line heading, a stacked tablet hero keeping both people visible, and wider service-photo crops.
- Static generated-page audit: one H1 per page, homepage images have alt text, and homepage internal links resolve to generated routes.
