import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Retouched masters are separate from the supplied originals. Versioned public
// filenames ensure every page uses the corrected photograph without stale caches.
const crops = [
  { source: 'grundpflege-retouched.jpg', name: 'grundpflege-v2', ratio: 3 / 2 },
  { source: 'grundpflege-retouched.jpg', name: 'haltung-v2', ratio: 3 / 2 },
  { source: 'karriere-retouched.jpg', name: 'karriere-v2', ratio: 3 / 2 },
];
await mkdir('public/img', { recursive: true });
for (const { source, name, ratio } of crops) {
  for (const width of [600, 900, 1400]) {
    const image = sharp(`assets/photos/${source}`).resize(width, Math.round(width / ratio), {
      fit: 'cover', position: 'centre', withoutEnlargement: true,
    });
    await image.clone().avif({ quality: 58, effort: 5 }).toFile(`public/img/${name}-${width}.avif`);
    await image.clone().webp({ quality: 84 }).toFile(`public/img/${name}-${width}.webp`);
  }
}
await import('./build-home-hero.mjs');
console.log('Corrected Grundpflege, Haltung and Karriere: AVIF + WebP, three widths each.');
