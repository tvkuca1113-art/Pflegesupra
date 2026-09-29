# Homepage redesign — September 2026

The opening image now fills the complete hero. A continuous light scrim supports dark HTML text without covering either face. On narrow screens, the photograph uses a right-hand focal point and fades into the reading area; it remains one section. Navigation is shorter on desktop, with all original destinations retained in the mobile menu and footer.

Services now have four contextual photographs, followed by a separate respite-care link. The page continues through the approach to care, the existing Pflege-Kompass, four steps, native FAQ disclosures, locations and a recruitment photograph. Forms, budget calculations, contact details, legal pages and route metadata retain their existing behavior.

## Design references reviewed

- Home Instead USA — https://www.homeinstead.com/ — short explanation and a clear enquiry path.
- Home Instead UK — https://www.homeinstead.co.uk/ — human-scale care photography and calm, readable hierarchy.
- Persona Studio's first-party case study — https://persona.studio/work/home-instead/ — empathy, clear information and consistent visual direction.
- Vesta Care Dubai — https://www.vestacare.ae/ — direct access to services and contact, blue brand continuity.
- Home Instead UK Instagram — https://www.instagram.com/homeinsteaduk/ — approachable people and practical answers, viewed in the authorized Instagram session.

These are design references, not a claim that every website won a design award. No competitor photographs, reviews, rankings or outcome claims were copied.

## New image

`assets/photos/supra-home-hero-v2.jpg` is an AI-generated illustrative scene, produced using the built-in image-generation tool. The supplied existing Supra logo was the branding reference. It does not portray real Supra staff or clients. Existing Symbolbild and Impressum disclosures remain, and the new image's origin is recorded in the Impressum.

Art direction / prompt: a single wide editorial photograph in a lived-in Munich home; an older woman and a caregiver in a navy Supra polo converse at a light oak table, both on the right; soft natural window light, believable skin and fabric, warm cream wall and quiet space on the left for dark HTML copy; a small Supra logo embroidered on the uniform; no text/UI baked into the image, no plastic skin, no medical clichés.

Regenerate web renditions with `node scripts/build-home-hero.mjs`. Widths are 960, 1600 and 1774 pixels, in AVIF and WebP. The new hero component remains server rendered; only the hero loads eagerly. Existing editorial photos remain lazy loaded.

## Checks

- TypeScript check, ESLint, existing design-token contrast check and production build passed.
- Browser checks and any final adjustments are recorded in the delivery commit notes.
