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
    // Only include fields that are actually provided to avoid setting required fields to null
    const allowedFields: any = {
      updatedAt: new Date(),
    };

    // Add optional fields if provided
    if (body.name !== undefined) allowedFields.name = body.name || null;
    if (body.phone !== undefined) allowedFields.phone = body.phone;
    if (body.whatsappAvailable !== undefined) allowedFields.whatsappAvailable = body.whatsappAvailable || false;
    if (body.viberAvailable !== undefined) allowedFields.viberAvailable = body.viberAvailable || false;
    if (body.website !== undefined) allowedFields.website = body.website || null;
    if (body.instagram !== undefined) allowedFields.instagram = body.instagram || null;
    if (body.snapchat !== undefined) allowedFields.snapchat = body.snapchat || null;
    if (body.twitter !== undefined) allowedFields.twitter = body.twitter || null;
    if (body.facebook !== undefined) allowedFields.facebook = body.facebook || null;
    if (body.city !== undefined) allowedFields.city = body.city;
    if (body.district !== undefined) allowedFields.district = body.district || null;
    if (body.gender !== undefined) allowedFields.gender = body.gender;
    if (body.dateOfBirth !== undefined) allowedFields.dateOfBirth = body.dateOfBirth;
    if (body.ethnicity !== undefined) allowedFields.ethnicity = body.ethnicity;
    if (body.height !== undefined) allowedFields.height = body.height ? parseInt(body.height) : null;
    if (body.weight !== undefined) allowedFields.weight = body.weight ? body.weight.toString() : null;
    if (body.aboutYou !== undefined) allowedFields.aboutYou = body.aboutYou;
    if (body.hairColor !== undefined) allowedFields.hairColor = body.hairColor || null;
    if (body.bustSize !== undefined) allowedFields.bustSize = body.bustSize || null;
    if (body.build !== undefined) allowedFields.build = body.build || null;
    if (body.incallAvailable !== undefined) allowedFields.incallAvailable = body.incallAvailable || false;
    if (body.outcallAvailable !== undefined) allowedFields.outcallAvailable = body.outcallAvailable || false;
    if (body.currency !== undefined) allowedFields.currency = body.currency || 'GEL';
    if (body.incallRates !== undefined || body.outcallRates !== undefined) {
      allowedFields.rates = {
        incall: body.incallRates || {},
        outcall: body.outcallRates || {},
      };
    }
    if (body.languages !== undefined) allowedFields.languages = (body.languages || []).filter((l: any) => l.name && l.level);
    if (body.services !== undefined) allowedFields.services = body.services || [];

    if (body.coverImage !== undefined) allowedFields.coverImage = body.coverImage || null;

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
