import { MetadataRoute } from 'next';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq, isNotNull, and, gt } from 'drizzle-orm';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'ka', 'ru'];
  const staticRoutes = ['', '/privacy', '/terms', '/support', '/register', '/favorites'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static routes
  locales.forEach((locale) => {
    staticRoutes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : 0.7,
      });
    });
  });

  // Fetch all active escorts
  const activeEscorts = await db
    .select({
      slug: users.slug,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(
      and(
        eq(users.role, 'escort'),
        isNotNull(users.slug),
        gt(users.publicExpiry, new Date()) // Only list active profiles
      )
    );

  // Add dyanmic escort routes
  activeEscorts.forEach((escort) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}/escort/${escort.slug}`,
        lastModified: escort.updatedAt || new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });
    });
  });

  return sitemapEntries;
}
