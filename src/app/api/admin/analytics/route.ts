import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { profileViews, profileInteractions } from '@/db/schema/analytics';
import { eq, and, gte, sql, desc, count } from 'drizzle-orm';
import { requireAdmin } from '@/lib/middleware';

export async function GET(req: NextRequest) {
    try {
        // 1. Verify Admin Auth
        const authResult = await requireAdmin(req);
        if (authResult instanceof NextResponse) return authResult;
        const { user } = authResult;

        // 2. Parse Query Params
        const { searchParams } = new URL(req.url);
        const timeRange = searchParams.get('timeRange') || 'all';

        // 3. Determine Date Filter
        let dateFilter = undefined;
        const now = new Date();

        if (timeRange === 'today') {
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            dateFilter = startOfDay;
        } else if (timeRange === 'week') {
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFilter = oneWeekAgo;
        } else if (timeRange === 'month') {
            const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            dateFilter = oneMonthAgo;
        }

        // Helper to apply date filter
        const withDateFilter = (column: any) => {
            return dateFilter ? gte(column, dateFilter) : undefined;
        };

        // 4. Fetch Filtered Data (Raw)
        const allViews = await db
            .select()
            .from(profileViews)
            .where(withDateFilter(profileViews.viewedAt))
            .orderBy(desc(profileViews.viewedAt));

        const allInteractions = await db
            .select()
            .from(profileInteractions)
            .where(withDateFilter(profileInteractions.interactedAt))
            .orderBy(desc(profileInteractions.interactedAt));

        const allUsers = await db
            .select({
                id: users.id,
                name: users.name,
                slug: users.slug,
                publicExpiry: users.publicExpiry,
                role: users.role,
            })
            .from(users);

        return NextResponse.json({
            views: allViews,
            interactions: allInteractions,
            users: allUsers,
        });

    } catch (error) {
        console.error('Analytics API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
