import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const { user } = authResult;

    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
