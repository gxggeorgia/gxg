import { notFound } from 'next/navigation';
import { generatePageMetadata } from '@/lib/seo';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import EscortProfileDisplay from '@/components/EscortProfileDisplay';

interface EscortDetailPageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export async function generateMetadata({ params }: EscortDetailPageProps) {
  const { id } = await params;
  const escort = await db.select().from(users).where(eq(users.id, id)).limit(1).then(res => res[0]);

  if (!escort) {
    return {};
  }

  const title = `${escort.name} - Verified Escort in ${escort.city}`;
  const description = escort.aboutYou || `Professional escort ${escort.name} in ${escort.city}. VIP verified profile.`;

  return generatePageMetadata(
    title,
    description,
    `/escort/${id}`,
    escort.coverImage || undefined
  );
}

export default async function EscortDetailPage({ params }: EscortDetailPageProps) {
  const { id } = await params;
  const escort = await db.select().from(users).where(eq(users.id, id)).limit(1).then(res => res[0]);

  if (!escort || escort.status !== 'public') {
    notFound();
  }

  return <EscortProfileDisplay profile={escort} isOwnProfile={false} />;
}