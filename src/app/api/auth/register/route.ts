import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';
import { verifyTurnstileToken } from '@/lib/turnstile';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      phone,
      name,
      whatsappAvailable,
      viberAvailable,
      website,
      instagram,
      snapchat,
      twitter,
      facebook,
      city,
      district,
      gender,
      dateOfBirth,
      ethnicity,
      height,
      weight,
      aboutYou,
      hairColor,
      bustSize,
      build,
      incallAvailable,
      outcallAvailable,
      currency,
      incallRates,
      outcallRates,
      languages,
      services,
      tags,
      turnstileToken
    } = body;

    // Verify Turnstile Token
    if (process.env.NODE_ENV === 'production' || turnstileToken) {
      const verification = await verifyTurnstileToken(turnstileToken);
      if (!verification.success) {
        return NextResponse.json(
          { error: 'Captcha verification failed' },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    if (!email || !password || !phone || !city || !gender || !dateOfBirth || !ethnicity || !height || !weight || !aboutYou) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate unique slug (8 random chars makes collisions extremely unlikely)
    const slug = generateSlug(name || email.split('@')[0], city);

    // Create user with all fields from schema
    const [newUser] = await db
      .insert(users)
      .values({
        // Auth fields
        email,
        password: hashedPassword,
        slug,
        role: 'user', // Default role
        status: 'pending', // New users start as pending
        statusMessage: 'Waiting for admin verification. Please send a message on Telegram for verification.',

        // Basic Info
        phone,
        name: name || null,
        whatsappAvailable: whatsappAvailable || false,
        viberAvailable: viberAvailable || false,

        // Social Media
        website: website || null,
        instagram: instagram || null,
        snapchat: snapchat || null,
        twitter: twitter || null,
        facebook: facebook || null,

        // Location
        city,
        district: district || null,

        // Personal Info (required)
        gender,
        dateOfBirth: dateOfBirth,
        ethnicity,
        height: parseInt(height),
        weight: weight.toString(),
        aboutYou,

        // Optional Personal Info
        hairColor: hairColor || null,
        bustSize: bustSize || null,
        build: build || null,

        // Availability
        incallAvailable: incallAvailable || false,
        outcallAvailable: outcallAvailable || false,

        // Rates
        currency: currency || 'GEL',
        rates: {
          incall: incallRates || {},
          outcall: outcallRates || {},
        },

        // Languages
        languages: (languages || []).filter((l: any) => l.name && l.level),

        // Services & Tags
        services: services || [],
        tags: tags || [],

        // Images
        images: [],
        videos: [],
      })
      .returning();

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    // Set cookie
    await setAuthCookie(token);

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: 'Registration successful',
        user: userWithoutPassword,
        token: token
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
