import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { profileViews } from '@/db/schema/analytics';
import { eq, count, gt, sql } from 'drizzle-orm';
import EscortProfileDisplay from '@/components/EscortProfileDisplay';

interface EscortDetailPageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EscortDetailPageProps) {
  const { slug } = await params;
  const escort = await db.select().from(users).where(eq(users.slug, slug)).limit(1).then(res => res[0]);

  if (!escort) {
    return {};
  }

  const title = `${escort.name} - Verified Escort in ${escort.city}`;
  const description = escort.aboutYou || `Professional escort ${escort.name} in ${escort.city}. Verified profile.`;

  return generatePageMetadata(
    title,
    description,
    `/escort/${slug}`,
    escort.coverImage || undefined
  );
}

export default async function EscortDetailPage({ params }: EscortDetailPageProps) {
  const { slug } = await params;
  const escort = await db.select().from(users).where(eq(users.slug, slug)).limit(1).then(res => res[0]);

  if (!escort || escort.status !== 'verified') {
    notFound();
  }

  // Fetch analytics
  const [totalViewsResult] = await db
    .select({ count: count() })
    .from(profileViews)
    .where(eq(profileViews.profileId, escort.id));

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [dailyViewsResult] = await db
    .select({ count: count() })
    .from(profileViews)
    .where(sql`${profileViews.profileId} = ${escort.id} AND ${profileViews.viewedAt} > ${oneDayAgo}`);

  const totalViews = totalViewsResult?.count || 0;
  const dailyViews = dailyViewsResult?.count || 0;

  return <EscortProfileDisplay profile={escort} isOwnProfile={false} totalViews={totalViews} dailyViews={dailyViews} />;
}