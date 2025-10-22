import { NextRequest, NextResponse } from 'next/server';
import B2 from 'backblaze-b2';

const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID!,
  applicationKey: process.env.B2_APPLICATION_KEY!,
});

const BUCKET_NAME = process.env.B2_BUCKET_NAME!;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Await params as required by Next.js 15
    const { path } = await params;
    
    // Reconstruct the filename from path segments
    const filename = path.join('/');
    
    console.log('Serving file:', filename);

    // Authorize with B2
    await b2.authorize();

    // Get download authorization
    const { downloadUrl } = b2 as any;
    
    if (!downloadUrl) {
      throw new Error('Download URL not available');
    }

    // Construct the file URL
    const fileUrl = `${downloadUrl}/file/${BUCKET_NAME}/${filename}`;
    
    // Fetch the file from B2
    const fileResponse = await fetch(fileUrl, {
      headers: {
        Authorization: (b2 as any).authorizationToken || '',
      },
    });

    if (!fileResponse.ok) {
      console.error('Failed to fetch file from B2:', fileResponse.status);
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Get the file data
    const fileData = await fileResponse.arrayBuffer();
    const contentType = fileResponse.headers.get('content-type') || 'application/octet-stream';

    // Return the file with appropriate headers
    return new NextResponse(fileData, {
      headers: {
        'Content-Type': contentType,
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
