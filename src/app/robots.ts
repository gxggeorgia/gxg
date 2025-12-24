import { MetadataRoute } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/account/',
        ],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: ['/*'], // Allow images to be indexed
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
