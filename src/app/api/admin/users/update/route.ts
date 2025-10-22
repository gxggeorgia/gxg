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
      'status', 'statusMessage', 'role', 'isVip', 'isTop', 'isVipElite',
      'vipExpiresAt', 'topExpiresAt', 'vipEliteExpiresAt',
      'name', 'phone', 'city', 'district', 'emailVerified'
    ];

    const updateData: any = {};
    
    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        // Handle subscription toggles - set expiration date
        if ((key === 'isVip' || key === 'isTop' || key === 'isVipElite') && value === true) {
          updateData[key] = value;
          // Set expiration to 30 days from now
          const expiresAtKey = key.replace('is', '').toLowerCase() + 'ExpiresAt';
          if (expiresAtKey === 'vipExpiresAt' || expiresAtKey === 'topExpiresAt' || expiresAtKey === 'vipeliteExpiresAt') {
            const correctKey = expiresAtKey === 'vipeliteExpiresAt' ? 'vipEliteExpiresAt' : expiresAtKey;
            updateData[correctKey] = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          }
        } else if ((key === 'isVip' || key === 'isTop' || key === 'isVipElite') && value === false) {
          updateData[key] = value;
          // Clear expiration date
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
