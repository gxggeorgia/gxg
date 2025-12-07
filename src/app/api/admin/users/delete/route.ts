import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { deleteFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
    try {
        // Verify admin access
        const authResult = await requireAdmin(request);
        if (authResult instanceof NextResponse) return authResult;

        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'userId is required' },
                { status: 400 }
            );
        }

        // Fetch user to get associated files
        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

        if (user) {
            // Delete images from R2
            if (user.images && Array.isArray(user.images)) {
                for (const image of user.images) {
                    if (image.url) {
                        try {
                            await deleteFile(image.url);
                        } catch (error) {
                            console.error(`Failed to delete image ${image.url}:`, error);
                        }
                    }
                }
            }

            // Delete videos from R2
            if (user.videos && Array.isArray(user.videos)) {
                for (const video of user.videos) {
                    if (video.url) {
                        try {
                            await deleteFile(video.url);
                        } catch (error) {
                            console.error(`Failed to delete video ${video.url}:`, error);
                        }
                    }
                }
            }
        }

        // Delete user from database
        await db.delete(users).where(eq(users.id, userId));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
