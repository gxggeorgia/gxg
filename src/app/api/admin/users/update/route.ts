import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await requireAdmin(request);
    if (authResult instanceof NextResponse) return authResult;

    const { userId, updates } = await request.json();

    if (!userId || !updates) {
      return NextResponse.json(
        { error: 'userId and updates are required' },
        { status: 400 }
      );
    }

    // Validate and prepare updates
    const allowedFields = [
      'status', 'statusMessage', 'role', 'isVip', 'isFeatured', 'isVipElite',
      'vipExpiresAt', 'featuredExpiresAt', 'vipEliteExpiresAt',
      'name', 'phone', 'city', 'district', 'emailVerified'
    ];

    const updateData: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // Handle date fields - convert string to Date if needed
        if (key.endsWith('ExpiresAt')) {
          if (value === null) {
            updateData[key] = null;
          } else if (typeof value === 'string') {
            updateData[key] = new Date(value);
          } else if (value instanceof Date) {
            updateData[key] = value;
          }
        }
        // Handle subscription toggles
        else if ((key === 'isVip' || key === 'isFeatured' || key === 'isVipElite') && value === false) {
          updateData[key] = value;
          // Clear expiration date when disabling subscription
          const expiresAtKey = key.replace('is', '').toLowerCase() + 'ExpiresAt';
          const correctKey = expiresAtKey === 'vipeliteExpiresAt' ? 'vipEliteExpiresAt' : expiresAtKey;
          updateData[correctKey] = null;
        } else {
          updateData[key] = value;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Update user
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true, updated: updateData });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}
