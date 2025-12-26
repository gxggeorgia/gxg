import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { user: null },
        { status: 200 } // so it does not console errors
      );
    }

    // Update lastActive timestamp
    await db.update(users)
      .set({ lastActive: new Date() })
      .where(eq(users.id, user.id));

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
