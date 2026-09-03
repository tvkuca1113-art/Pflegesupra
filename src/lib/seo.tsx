import type { Metadata } from 'next';
import { business, siteUrl, fullAddress } from '@/content/business';

export const SITE_NAME = 'Supra ambulanter Pflegedienst';

interface PageMetaInput {
  title: string;
  description: string;
  /** Path with leading slash, no trailing slash (except '/'). */
  path: string;
  noindex?: boolean;
}

/** One <title>, one description, one canonical per URL — no page may skip this. */
export function pageMeta({ title, description, path, noindex }: PageMetaInput): Metadata {
  const url = path === '/' ? siteUrl : `${siteUrl}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'website',
      locale: 'de_DE',
      siteName: SITE_NAME,
      title,
      description,
      url,
      /* 1200x630 — the size every platform crops a link preview to. The logo
         that used to sit here is 260px wide and was upscaled into a blur. No
         text is baked into the card: the title comes from the page metadata,
         so a rewritten headline never leaves a stale one in the image. */
      images: [{
        url: `${siteUrl}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ambulante Pflege zu Hause in München und Pfaffenhofen a.d. Ilm`,
      }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

const [muenchen] = business.locations;

/**
 * Organization / MedicalBusiness graph.
 *
 * Deliberately omits aggregateRating, review, priceRange and openingHours for
 * care delivery: none of those are backed by a source the client controls, and
 * fabricating them is both a Google structured-data violation and a legal risk.
 * `openingHoursSpecification` describes telephone availability only, matching
 * how it is labelled in the page itself.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MedicalBusiness', 'HomeAndConstructionBusiness', 'Organization'],
        '@id': `${siteUrl}/#organization`,
        name: SITE_NAME,
        legalName: `${business.legalName}, Inhaber ${business.owner}`,
        url: siteUrl,
        telephone: business.phone.display,
        faxNumber: business.fax,
        email: business.email,
        founder: { '@type': 'Person', name: business.owner },
        foundingDate: String(business.founded),
        logo: {
          '@type': 'ImageObject',
          '@id': `${siteUrl}/#logo`,
          url: `${siteUrl}/logo-supra.png`,
          width: 260,
          height: 184,
        },
        image: { '@id': `${siteUrl}/#logo` },
        address: {
          '@type': 'PostalAddress',
          streetAddress: muenchen.street,
          postalCode: muenchen.postalCode,
          addressLocality: muenchen.city,
          addressRegion: 'Bayern',
          addressCountry: 'DE',
        },
        areaServed: business.locations.map((l) => ({ '@type': 'City', name: l.city })),
        location: business.locations.map((l) => ({
          '@type': 'Place',
          name: `${SITE_NAME} — ${l.role} ${l.city}`,
          address: {
            '@type': 'PostalAddress',
            streetAddress: l.street,
            postalCode: l.postalCode,
            addressLocality: l.city,
            addressCountry: 'DE',
          },
        })),
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday', 'Tuesday', 'Wednesday', 'Thursday',
              'Friday', 'Saturday', 'Sunday',
            ],
            opens: business.officeHours.from,
            closes: business.officeHours.to,
            description: 'Telefonische Erreichbarkeit des Büros',
          },
        ],
        knowsLanguage: ['de'],
        description:
          'Ambulanter Pflegedienst für Grundpflege, Behandlungspflege, Betreuung und '
          + 'hauswirtschaftliche Versorgung zu Hause in München und Pfaffenhofen a.d. Ilm.',
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_NAME,
        inLanguage: 'de-DE',
        publisher: { '@id': `${siteUrl}/#organization` },
      },
    ],
  };
}

export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: t.path === '/' ? siteUrl : `${siteUrl}${t.path}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string[] }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer.join(' ') },
    })),
  };
}

export function serviceJsonLd(s: { name: string; slug: string; promise: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    serviceType: s.name,
    description: s.promise,
    url: `${siteUrl}/leistungen/${s.slug}`,
    provider: { '@id': `${siteUrl}/#organization` },
    areaServed: business.locations.map((l) => ({ '@type': 'City', name: l.city })),
  };
}

export const addressLines = business.locations.map((l) => ({
  ...l,
  oneLine: fullAddress(l),
}));

/** Inline a JSON-LD block. Escaped so page content can never break out of it. */
export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}
