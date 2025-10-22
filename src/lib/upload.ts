import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Initialize Cloudflare R2 client (S3-compatible)
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

interface FileMetadata {
  url: string;
  width?: number;
  height?: number;
  duration?: number;
  size: number;
  mimeType: string;
  thumbnailUrl?: string;
}

export async function uploadFile(
  file: File,
  userId: string,
  type: 'image' | 'video'
): Promise<FileMetadata> {
  // Validate file type
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
  }

  // Validate file size
  const maxSize = type === 'image' ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  if (file.size > maxSize) {
    throw new Error(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
  }

  // Generate unique filename
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = file.name.split('.').pop();
  const filename = `${userId}/${type}s/${timestamp}-${randomString}.${extension}`;

  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to R2
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: buffer,
    ContentType: file.type,
  });

  try {
    await r2Client.send(command);
  } catch (error: any) {
    console.error('R2 upload failed:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }

  // Return URL for our proxy endpoint
  // Format: /api/media/{userId}/{type}/{filename}
  const url = `/api/media/${filename}`;
  
  return {
    url,
    size: file.size,
    mimeType: file.type,
  };
}

export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    // Extract filename from URL
    const urlParts = fileUrl.split('/');
    const filename = urlParts.slice(-3).join('/'); // userId/type/filename

    // Delete from R2
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    await r2Client.send(command);
  } catch (error) {
    console.error('Error deleting file from R2:', error);
    throw new Error('Failed to delete file');
  }
}
