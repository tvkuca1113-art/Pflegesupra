/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // 301s preserving the ranking of the old WordPress URLs.
  async redirects() {
    return [
      { source: '/ambulante-pflege-muenchen-leistungen', destination: '/leistungen', permanent: true },
      { source: '/ambulante-pflege-muenchen-faq', destination: '/fragen-und-antworten', permanent: true },
      { source: '/pflegedienst-muenchen-kontakt', destination: '/kontakt', permanent: true },
      { source: '/uncategorized/hello-world', destination: '/', permanent: true },
      { source: '/allgemein/hallo-welt', destination: '/', permanent: true },
      { source: '/category/:slug', destination: '/', permanent: true },
      { source: '/author/:slug', destination: '/ueber-uns', permanent: true },
      { source: '/datenschutzerklaerung', destination: '/datenschutz', permanent: true },
    ];
  },
};

export default nextConfig;
