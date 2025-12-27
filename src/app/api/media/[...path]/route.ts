import { NextRequest, NextResponse } from 'next/server';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Optional: Check referer to ensure request comes from your domain
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    // Allow requests from your domain or direct API calls (for testing)
    // In production, you might want to be stricter
    if (referer && !referer.includes(host || '')) {
      console.warn('Blocked request from external referer:', referer);
      // Uncomment to enable strict referer checking:
      // return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Await params as required by Next.js 15
    const { path } = await params;

    // Reconstruct the filename from path segments
    const filename = path.join('/');

    // Fetch file from R2
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(chunk);
    }
    const fileData = Buffer.concat(chunks);

    let contentType = response.ContentType || 'application/octet-stream';

    // Fallback: If content-type is octet-stream, try to guess from extension
    if (contentType === 'application/octet-stream') {
      const ext = filename.split('.').pop()?.toLowerCase();
      if (ext === 'jpg' || ext === 'jpeg') contentType = 'image/jpeg';
      else if (ext === 'png') contentType = 'image/png';
      else if (ext === 'gif') contentType = 'image/gif';
      else if (ext === 'webp') contentType = 'image/webp';
      else if (ext === 'mp4') contentType = 'video/mp4';
      else if (ext === 'mov') contentType = 'video/quicktime';
    }

    // Return the file with appropriate headers
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileData.byteLength.toString(),
        'Content-Disposition': 'inline', // Important for browsers/crawlers to treat as viewable media
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
