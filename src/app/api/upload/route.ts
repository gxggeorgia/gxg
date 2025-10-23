import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { uploadFile } from '@/lib/upload';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication using middleware
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) return authResult;
    const { user } = authResult;

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    const type = formData.get('type') as 'image' | 'video';
    const width = formData.get('width');
    const height = formData.get('height');
    const duration = formData.get('duration');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!type || (type !== 'image' && type !== 'video')) {
      return NextResponse.json({ error: 'Invalid type. Must be "image" or "video"' }, { status: 400 });
    }

    // Upload file and get metadata
    const fileMetadata = await uploadFile(file, user.id, type);

    // Add dimensions/duration from client
    if (width) fileMetadata.width = parseInt(width as string);
    if (height) fileMetadata.height = parseInt(height as string);
    if (duration) fileMetadata.duration = parseFloat(duration as string);

    // Get current user data
    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Save metadata to database
    if (type === 'image') {
      const currentImages = currentUser.images || [];
      
      // Check max limit (10 images)
      if (currentImages.length >= 10) {
        return NextResponse.json({ error: 'Maximum 10 images allowed' }, { status: 400 });
      }

      // Mark first image as primary
      const isPrimary = currentImages.length === 0;
      const imageMetadata = { ...fileMetadata, isPrimary };
      
      const updatedImages = [...currentImages, imageMetadata];

      await db
        .update(users)
        .set({ images: updatedImages })
        .where(eq(users.id, user.id));
    } else if (type === 'video') {
      const currentVideos = (currentUser.videos as any[]) || [];
      
      // Check max limit (1 video)
      if (currentVideos.length >= 1) {
        return NextResponse.json({ error: 'Maximum 1 video allowed. Delete existing video first.' }, { status: 400 });
      }
      
      const updatedVideos = [...currentVideos, fileMetadata];

      await db
        .update(users)
        .set({ videos: updatedVideos })
        .where(eq(users.id, user.id));
    }

    return NextResponse.json({
      success: true,
      metadata: fileMetadata,
      type,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
