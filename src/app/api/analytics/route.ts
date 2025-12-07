import { NextResponse } from 'next/server';
import { db } from '@/db';
import { profileViews, profileInteractions } from '@/db/schema/analytics';
import { z } from 'zod';

// Schema for validation
const analyticsSchema = z.object({
    type: z.enum(['view', 'interaction']),
    profileId: z.string().uuid(),
    interactionType: z.string().optional(), // Required if type is 'interaction'
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = analyticsSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const { type, profileId, interactionType } = validation.data;

        // Get IP address (simplified)
        const ip = request.headers.get('x-forwarded-for') || 'unknown';

        if (type === 'view') {
            await db.insert(profileViews).values({
                profileId,
                viewerIp: ip,
            });
        } else if (type === 'interaction') {
            if (!interactionType) {
                return NextResponse.json({ error: 'Interaction type is required' }, { status: 400 });
            }

            await db.insert(profileInteractions).values({
                profileId,
                type: interactionType,
                interactorIp: ip,
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
