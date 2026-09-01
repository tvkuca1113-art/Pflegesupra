import type { MetadataRoute } from 'next';
import { siteUrl } from '@/content/business';
import { services } from '@/content/services';
import { areas } from '@/content/areas';

/**
 * Sitemap. Every indexable URL appears exactly once; the legal pages are
 * included but weighted low, and there are no orphans — each entry is also
 * reachable through the header or footer navigation.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (path: string, priority: number, changeFrequency: 'monthly' | 'yearly') => ({
    url: path === '/' ? siteUrl : `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry('/', 1.0, 'monthly'),
    entry('/leistungen', 0.9, 'monthly'),
    ...services.map((s) => entry(`/leistungen/${s.slug}`, 0.8, 'monthly')),
    entry('/pflegegrade-und-kosten', 0.9, 'monthly'),
    entry('/ablauf', 0.7, 'yearly'),
    entry('/fragen-und-antworten', 0.8, 'monthly'),
    ...areas.map((a) => entry(`/einsatzgebiet/${a.slug}`, 0.8, 'monthly')),
    entry('/ueber-uns', 0.6, 'yearly'),
    entry('/karriere', 0.7, 'monthly'),
    entry('/kontakt', 0.9, 'yearly'),
    entry('/impressum', 0.2, 'yearly'),
    entry('/datenschutz', 0.2, 'yearly'),
  ];
}
