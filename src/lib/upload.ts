import B2 from 'backblaze-b2';

const ACCOUNT_ID = process.env.B2_ACCOUNT_ID?.trim();

const APPLICATION_KEY = (() => {
  const value = process.env.B2_APPLICATION_KEY?.trim();
  if (!value) {
    throw new Error('B2_APPLICATION_KEY is not set in environment variables');
  }
  return value;
})();

const APPLICATION_KEY_ID = (() => {
  const explicit = process.env.B2_APPLICATION_KEY_ID?.trim();
  const candidate = explicit || ACCOUNT_ID;

  if (!candidate) {
    throw new Error('B2_APPLICATION_KEY_ID is not set in environment variables');
  }

  if (candidate === APPLICATION_KEY) {
    if (!ACCOUNT_ID) {
      throw new Error(
        'B2_APPLICATION_KEY_ID equals the application key secret, and no B2_ACCOUNT_ID is available to fall back to.'
      );
    }
    console.warn(
      'B2_APPLICATION_KEY_ID matches the application key secret. Falling back to B2_ACCOUNT_ID because this looks like a master key.'
    );
    return ACCOUNT_ID;
  }

  return candidate;
})();

const BUCKET_NAME = (() => {
  const value = process.env.B2_BUCKET_NAME?.trim();
  if (!value) {
    throw new Error('B2_BUCKET_NAME is not set in environment variables');
  }
  return value;
})();

const BUCKET_ID = (() => {
  const value = process.env.B2_BUCKET_ID?.trim();
  if (!value) {
    throw new Error('B2_BUCKET_ID is not set in environment variables');
  }
  return value;
})();

const b2 = new B2({
  applicationKeyId: APPLICATION_KEY_ID,
  applicationKey: APPLICATION_KEY,
  ...(ACCOUNT_ID ? { accountId: ACCOUNT_ID } : {}),
});

if (process.env.NODE_ENV !== 'production') {
  console.log('B2 Native API Config:', {
    keyId: APPLICATION_KEY_ID,
    accountId: ACCOUNT_ID,
    keyLength: APPLICATION_KEY.length,
  });
}
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
  downloadAuthorizationToken?: string;
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

  // Authorize with B2
  try {
    await b2.authorize();
  } catch (error: any) {
    console.error('B2 authorization failed', error?.response?.data ?? error);
    if (error?.response?.status === 401) {
      throw new Error(
        'Backblaze credentials were rejected (401). Verify B2_APPLICATION_KEY_ID/B2_ACCOUNT_ID and B2_APPLICATION_KEY.'
      );
    }
    throw new Error('Unable to authorize with Backblaze B2');
  }

  // List buckets to find the correct bucket ID
  let bucketId = BUCKET_ID;
  try {
    const bucketsResponse = await b2.listBuckets();
    const bucket = bucketsResponse.data.buckets.find((b: any) => b.bucketName === BUCKET_NAME);
    if (bucket) {
      bucketId = bucket.bucketId;
      console.log('Found bucket:', { name: BUCKET_NAME, id: bucketId });
    } else {
      console.warn('Bucket not found in list, using configured ID:', BUCKET_ID);
    }
  } catch (error) {
    console.warn('Failed to list buckets, using configured ID:', error);
  }

  // Get upload URL
  let uploadUrlResponse;
  try {
    uploadUrlResponse = await b2.getUploadUrl({ bucketId });
  } catch (error: any) {
    console.error('Failed to get upload URL:', error?.response?.data ?? error);
    console.error('Bucket ID used:', bucketId);
    throw new Error(`Failed to get upload URL: ${error?.response?.data?.message || error.message}`);
  }

  // Upload to B2
  const uploadResponse = await b2.uploadFile({
    uploadUrl: uploadUrlResponse.data.uploadUrl,
    uploadAuthToken: uploadUrlResponse.data.authorizationToken,
    fileName: filename,
    data: buffer,
    contentType: file.type,
  });

  // For private buckets, store the B2 file path
  // We'll serve files through our own API endpoint with authorization
  // This allows geo-restriction and domain-only access
  const fileId = uploadResponse.data.fileId;
  
  // Store the internal B2 path - we'll create a proxy endpoint to serve these
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

    // Authorize with B2
    await b2.authorize();

    // Get file info
    const fileList = await b2.listFileNames({
      bucketId: BUCKET_ID,
      prefix: filename,
      maxFileCount: 1,
    });

    if (fileList.data.files.length > 0) {
      const fileId = fileList.data.files[0].fileId;
      await b2.deleteFileVersion({
        fileId,
        fileName: filename,
      });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}
