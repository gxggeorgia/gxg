import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { inArray, eq } from 'drizzle-orm';

export async function POST(request: Request) {
    try {
        const { userIds } = await request.json();

        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return NextResponse.json({ statuses: {} });
        }

        const results = await db
            .select({
                id: users.id,
                lastActive: users.lastActive,
            })
            .from(users)
            .where(inArray(users.id, userIds));

        const statuses = results.reduce((acc, user) => {
            acc[user.id] = user.lastActive;
            return acc;
        }, {} as Record<string, Date | null>);

        return NextResponse.json({ statuses });
    } catch (error) {
        console.error('Error fetching user statuses:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statuses' },
            { status: 500 }
        );
    }
}
