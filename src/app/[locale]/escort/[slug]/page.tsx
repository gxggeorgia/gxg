import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { profileViews } from '@/db/schema/analytics';
import { eq, count, gt, and } from 'drizzle-orm';
import EscortProfileDisplay from '@/components/EscortProfileDisplay';
import { checkSubscriptionStatus } from '@/lib/subscription';
import Script from 'next/script';
import { defaultMetadata } from '@/lib/seo';

interface EscortDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

import { getTranslations } from 'next-intl/server';

import { locations } from '@/data/locations';

export async function generateMetadata({ params }: EscortDetailPageProps) {
  const { slug, locale } = await params;
  const rawEscort = await db.select().from(users).where(eq(users.slug, slug)).limit(1).then(res => res[0]);

  if (!rawEscort) {
    return {};
  }

  const escort = checkSubscriptionStatus(rawEscort);
  const t = await getTranslations({ locale, namespace: 'seo' });

  // Helper to get localized city name
  const getCityName = (id: string) => {
    const c = locations.find(l => l.id === id);
    return c?.name[locale as keyof typeof c.name] || id;
  };

  const localizedCity = escort.city ? getCityName(escort.city) : 'Georgia';
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';
  const ogImage = escort.coverImage ? `${siteUrl}${escort.coverImage}` : undefined;

  // Variables for templates
  const variables = {
    name: escort.name,
    age: escort.age ? escort.age.toString() : '',
    ethnicity: escort.ethnicity || '',
    city: localizedCity,
    services: escort.services ? escort.services.slice(0, 5).join(', ') : ''
  };

  const title = t('profileTitle', variables);
  const description = t('profileDescription', variables);

  // Specific Keywords
  const specificKeywords = [
    `${escort.name} escort`,
    `${localizedCity} escort`, // Localized keyword
    `${escort.city} escort`, // Keep English ID as keyword too? Maybe prudent.
    `escort in ${localizedCity}`,
    `${escort.ethnicity} escort`,
    ...(escort.services || []).map((s: string) => `${s} ${localizedCity}`),
    "verified profile",
    "real photos"
  ];

  // Merge with default keywords to ensure coverage
  const baseMeta = generatePageMetadata(
    title,
    description,
    `/escort/${slug}`,
    ogImage,
    false,
    locale // Pass locale here
  );

  return {
    ...baseMeta,
    keywords: [...(defaultMetadata.keywords as string[] || []), ...specificKeywords],
  };
}



export default async function EscortDetailPage({ params }: EscortDetailPageProps) {
  const { slug, locale } = await params;
  const rawEscort = await db.select().from(users).where(eq(users.slug, slug)).limit(1).then(res => res[0]);

  if (!rawEscort || !rawEscort.publicExpiry || new Date(rawEscort.publicExpiry) <= new Date()) {
    notFound();
  }

  const escort = checkSubscriptionStatus(rawEscort);

  // Fetch analytics
  const [totalViewsResult] = await db
    .select({ count: count() })
    .from(profileViews)
    .where(eq(profileViews.profileId, escort.id));

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [dailyViewsResult] = await db
    .select({ count: count() })
    .from(profileViews)
    .where(and(
      eq(profileViews.profileId, escort.id),
      gt(profileViews.viewedAt, startOfDay)
    ));

  const totalViews = totalViewsResult?.count || 0;
  const dailyViews = dailyViewsResult?.count || 0;

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';

  // Extract Price Range if available
  let priceRange = "Contact for rates";
  if (escort.rates && typeof escort.rates === 'object') {
    const incall = escort.rates.incall;
    const outcall = escort.rates.outcall;
    const prices: number[] = [];

    // Helper to parse rate strings like "150", "200 GEL", etc.
    const extractPrice = (val: string | undefined): number | null => {
      if (!val) return null;
      const num = parseInt(val.replace(/[^0-9]/g, ''));
      return isNaN(num) ? null : num;
    };

    if (incall?.oneHour) { const p = extractPrice(incall.oneHour); if (p) prices.push(p); }
    if (outcall?.oneHour) { const p = extractPrice(outcall.oneHour); if (p) prices.push(p); }

    if (prices.length > 0) {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) priceRange = `${min} ${escort.currency}`;
      else priceRange = `${min} - ${max} ${escort.currency}`;
    }
  }

  // 1. Breadcrumb Schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/${locale}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Escorts',
        item: `${siteUrl}/${locale}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: escort.name,
        item: `${siteUrl}/${locale}/escort/${slug}`
      }
    ]
  };

  // 2. Enhanced Person/Product Schema
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: escort.name,
    image: escort.coverImage ? `${siteUrl}${escort.coverImage}` : undefined,
    description: escort.aboutYou,
    gender: escort.gender,
    url: `${siteUrl}/${locale}/escort/${slug}`,
    height: escort.height ? `${escort.height} cm` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: escort.city,
      addressCountry: 'GE'
    },
    knowsLanguage: escort.languages?.map((l: { name: string }) => l.name) || [],
    priceRange: priceRange !== "Contact for rates" ? priceRange : undefined,
    offers: {
      '@type': 'Offer',
      priceCurrency: escort.currency || 'GEL',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/${locale}/escort/${slug}` // Deep link to offer
    }
  };

  return (
    <>
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Script
        id="person-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <EscortProfileDisplay profile={escort} isOwnProfile={false} totalViews={totalViews} dailyViews={dailyViews} />
    </>
  );
}