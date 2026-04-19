const SITE_URL = 'https://invoice.flowdesk.tech';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dashboard/',
          '/profile',
          '/customers',
          '/invoices',
          '/invoice-templates',
          '/recurring-invoices',
          '/generate-social-images',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
