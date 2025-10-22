import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAuth } from '@/lib/middleware';

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return error response
    }

    const { user } = authResult;
    const userId = user.id;

    const body = await request.json();

    // Only update allowed fields (exclude email, password, role, etc.)
    const allowedFields: any = {
      name: body.name || null,
      phone: body.phone,
      whatsappAvailable: body.whatsappAvailable || false,
      viberAvailable: body.viberAvailable || false,
      website: body.website || null,
      instagram: body.instagram || null,
      snapchat: body.snapchat || null,
      twitter: body.twitter || null,
      facebook: body.facebook || null,
      city: body.city,
      district: body.district || null,
      gender: body.gender,
      dateOfBirth: body.dateOfBirth,
      ethnicity: body.ethnicity,
      height: body.height ? parseInt(body.height) : null,
      weight: body.weight ? body.weight.toString() : null,
      aboutYou: body.aboutYou,
      hairColor: body.hairColor || null,
      bustSize: body.bustSize || null,
      build: body.build || null,
      incallAvailable: body.incallAvailable || false,
      outcallAvailable: body.outcallAvailable || false,
      currency: body.currency || 'GEL',
      rates: {
        incall: body.incallRates || {},
        outcall: body.outcallRates || {},
      },
      languages: (body.languages || []).filter((l: any) => l.name && l.level),
      services: body.services || [],
      tags: body.tags || [],
      updatedAt: new Date(),
    };

    // Update user with allowed fields
    const [updatedUser] = await db
      .update(users)
      .set(allowedFields)
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
