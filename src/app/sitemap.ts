import { MetadataRoute } from 'next';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq, isNotNull, and, gt } from 'drizzle-orm';
import { routing } from '@/i18n/routing';
import { locations } from '@/data/locations';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = routing.locales;
  const defaultLocale = routing.defaultLocale;

  const getLocalizedUrl = (locale: string, path: string) => {
    const prefix = locale === defaultLocale ? '' : `/${locale}`;
    return `${baseUrl}${prefix}${path}`;
  };

  const getAlternates = (path: string) => {
    const languages: Record<string, string> = {
      'x-default': getLocalizedUrl(defaultLocale, path)
    };
    locales.forEach((l) => {
      languages[l] = getLocalizedUrl(l, path);
    });
    return { languages };
  };

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Routes
  const staticRoutes = ['', '/support', '/register', '/favorites', '/privacy', '/terms'];
  staticRoutes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: getLocalizedUrl(locale, route),
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : 0.7,
        alternates: getAlternates(route),
      });
    });
  });

  // 2. Category Routes (Cities & Districts)
  locations.forEach((city) => {
    if (city.id === 'all') return;

    // City Pages
    const cityPath = `/?city=${city.id}`;
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: getLocalizedUrl(locale, cityPath),
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
        alternates: getAlternates(cityPath),
      });
    });

    // District Pages
    city.districts.forEach((district) => {
      if (district.id === 'all') return;
      const districtPath = `/?city=${city.id}&district=${district.id}`;
      locales.forEach((locale) => {
        sitemapEntries.push({
          url: getLocalizedUrl(locale, districtPath),
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.8,
          alternates: getAlternates(districtPath),
        });
      });
    });
  });

  // 3. Dynamic Escort Routes
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
        gt(users.publicExpiry, new Date())
      )
    );

  activeEscorts.forEach((escort) => {
    const escortPath = `/escort/${escort.slug}`;
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: getLocalizedUrl(locale, escortPath),
        lastModified: escort.updatedAt || new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
        alternates: getAlternates(escortPath),
      });
    });
  });

  return sitemapEntries;
}
