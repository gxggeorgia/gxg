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

export async function generateMetadata({ params }: EscortDetailPageProps) {
  const { slug } = await params;
  const rawEscort = await db.select().from(users).where(eq(users.slug, slug)).limit(1).then(res => res[0]);

  if (!rawEscort) {
    return {};
  }

  const escort = checkSubscriptionStatus(rawEscort);

  // Richer Description Logic
  const ageText = escort.age ? `${escort.age} years old` : 'Young';
  const cityText = escort.city ? `in ${escort.city}` : 'in Georgia';
  const ethnicityText = escort.ethnicity ? `${escort.ethnicity} ` : '';
  const servicesList = escort.services || [];
  const servicesText = servicesList.length > 0
    ? `. Specializing in: ${servicesList.slice(0, 5).join(', ')}`
    : '';

  const title = `${escort.name} | ${ethnicityText}Escort ${cityText} - Verified & Real Photos`;
  const description = `Meet ${escort.name}, a ${ageText} ${ethnicityText}verified escort ${cityText}. ${servicesText}. Available for Incall/Outcall. Book now on GOGOXGEORGIA.GE.`;

  // Specific Keywords
  const specificKeywords = [
    `${escort.name} escort`,
    `${escort.city} escort`,
    `escort in ${escort.city}`,
    `${escort.ethnicity} escort`,
    ...servicesList.map((s: string) => `${s} ${escort.city}`),
    "verified profile",
    "real photos"
  ];

  // Merge with default keywords to ensure coverage
  const baseMeta = generatePageMetadata(
    title,
    description,
    `/escort/${slug}`,
    escort.coverImage || undefined
  );

  return {
    ...baseMeta,
    keywords: [...(defaultMetadata.keywords as string[] || []), ...specificKeywords],
  };
}

export default async function EscortDetailPage({ params }: EscortDetailPageProps) {
  const { slug } = await params;
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
        item: siteUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Escorts',
        item: `${siteUrl}` // Technically home is the directory, or maybe /search
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: escort.name,
        item: `${siteUrl}/escort/${slug}`
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
    url: `${siteUrl}/escort/${slug}`,
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
      url: `${siteUrl}/escort/${slug}` // Deep link to offer
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