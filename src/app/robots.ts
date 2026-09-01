import type { MetadataRoute } from 'next';
import { siteUrl } from '@/content/business';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The write endpoint has nothing to index and should never be crawled.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
