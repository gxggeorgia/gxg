import { NextRequest, NextResponse } from 'next/server';
import { requireUser, requireAdmin, requireEscort } from '@/lib/middleware';

// Example: Endpoint that requires any authenticated user
export async function GET(request: NextRequest) {
  const authResult = await requireUser(request);
  
  // If authResult is a NextResponse, it means authentication failed
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  const { user } = authResult;
  
  return NextResponse.json({
    message: 'This is a protected endpoint',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}

// Example: Endpoint that requires admin role
export async function POST(request: NextRequest) {
  const authResult = await requireAdmin(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  const { user } = authResult;
  
  return NextResponse.json({
    message: 'This endpoint is only accessible to admins',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}

// Example: Endpoint that requires escort role
export async function PUT(request: NextRequest) {
  const authResult = await requireEscort(request);
  
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  
  const { user } = authResult;
  
  return NextResponse.json({
    message: 'This endpoint is only accessible to escorts and admins',
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
}
