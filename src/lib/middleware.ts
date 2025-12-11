import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './auth';

export type UserRole = 'escort' | 'admin';

/**
 * Authentication Middleware Functions
 * 
 * Usage in API routes:
 * 
 * import { requireAuth, requireAdmin, requireEscort } from '@/lib/middleware';
 * 
 * export async function GET(request: NextRequest) {
 *   const authResult = await requireAuth(request);
 *   if (authResult instanceof NextResponse) return authResult;
 *   const { user } = authResult;
 *   // ... your logic
 * }
 */

// Middleware to require any authenticated user
export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please login.' },
      { status: 401 }
    );
  }

  return { user };
}

// Middleware to require admin role
export async function requireAdmin(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please login.' },
      { status: 401 }
    );
  }

  if (user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden. Admin access required.' },
      { status: 403 }
    );
  }

  return { user };
}

// Middleware to require escort role (or admin)
export async function requireEscort(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized. Please login.' },
      { status: 401 }
    );
  }

  if (user.role !== 'escort') {
    return NextResponse.json(
      { error: 'Forbidden. Escort or Admin access required.' },
      { status: 403 }
    );
  }

  return { user };
}
