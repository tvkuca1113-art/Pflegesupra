import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

// Regenerate the full scene without cropping; responsive focal points live in CSS.
await mkdir('public/img', { recursive: true });
for (const width of [960, 1600, 1774]) {
  const source = sharp('assets/photos/supra-home-hero-v2.jpg').resize({ width, withoutEnlargement: true });
  await source.clone().webp({ quality: 83 }).toFile(`public/img/supra-home-hero-${width}.webp`);
  await source.clone().avif({ quality: 58, effort: 5 }).toFile(`public/img/supra-home-hero-${width}.avif`);
}
console.log('SUPRA full-width hero: 3 widths, AVIF + WebP.');
