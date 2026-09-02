import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileActionBar from '@/components/MobileActionBar';
import ConsentBanner from '@/components/ConsentBanner';
import { JsonLd, organizationJsonLd, SITE_NAME } from '@/lib/seo';
import { siteUrl } from '@/content/business';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Ambulanter Pflegedienst München & Pfaffenhofen | Supra',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Ambulante Pflege zu Hause in München und Pfaffenhofen a.d. Ilm: Grundpflege, '
    + 'Behandlungspflege, Betreuung und Hauswirtschaft. Beratung: 089 189 39 716.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  formatDetection: { telephone: true, address: false, email: false },
  icons: { icon: '/icon.png', apple: '/apple-icon.png' },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  themeColor: '#003399',
  // Zoom is never capped — WCAG 1.4.4 and, for this audience, plain common sense.
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const analyticsConfigured = Boolean(process.env.NEXT_PUBLIC_GA_ID);

  return (
    <html lang="de">
      <head>
        {/* Every line on this site is set in one 20 KB subset. Left to
            discovery, the browser only asks for it after the stylesheet has
            parsed and text has been laid out — measured at 1.25 s on Slow 4G,
            half a second after first paint. Preloading moves the request into
            the initial scan of the document, so the face is usually in place
            before anything is painted. */}
        <link
          rel="preload"
          href="/fonts/libre-franklin-de.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={organizationJsonLd()} />
        <Header />
        <main id="inhalt" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <ConsentBanner analyticsConfigured={analyticsConfigured} />
      </body>
    </html>
  );
}
