import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { deleteFile } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    // Check if user is verified (public profile is active)
    const isVerified = user.publicExpiry && new Date(user.publicExpiry) > new Date();
    if (isVerified) {
      return NextResponse.json(
        { error: 'Cannot delete media. Your profile is verified. Please contact support to remove photos.' },
        { status: 403 }
      );
    }
    const { url, type } = await request.json();

    if (!url || !type) {
      return NextResponse.json({ error: 'Missing url or type' }, { status: 400 });
    }

    if (type === 'image') {
      // Remove image from array
      const images = (user.images as any[]) || [];
      const updatedImages = images.filter((img: any) => img.url !== url);

      // Also clear coverImage if it was the deleted image
      const updateData: any = { images: updatedImages };
      if (user.coverImage === url) {
        updateData.coverImage = null;
      }

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, user.id));
    } else if (type === 'video') {
      // Remove video from videos array
      const videos = (user.videos as any[]) || [];
      const updatedVideos = videos.filter((vid: any) => vid.url !== url);

      await db
        .update(users)
        .set({ videos: updatedVideos })
        .where(eq(users.id, user.id));
    }

    // Delete file from R2
    try {
      await deleteFile(url);
    } catch (error) {
      console.error('Failed to delete file from R2:', error);
      // Continue even if R2 deletion fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete media error:', error);
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    );
  }
}
