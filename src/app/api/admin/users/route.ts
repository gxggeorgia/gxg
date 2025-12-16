import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { db } from '@/db';
import { users } from '@/db/schema/users';

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    // Fetch all users
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      phone: users.phone,
      role: users.role,
      publicExpiry: users.publicExpiry,
      verifiedPhotosExpiry: users.verifiedPhotosExpiry,
      goldExpiresAt: users.goldExpiresAt,
      featuredExpiresAt: users.featuredExpiresAt,
      silverExpiresAt: users.silverExpiresAt,
      topExpiresAt: users.topExpiresAt,
      newExpiresAt: users.newExpiresAt,
      city: users.city,
      createdAt: users.createdAt,
    }).from(users);

    return NextResponse.json({ users: allUsers });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
