import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware';
import { db } from '@/db';
import { reports } from '@/db/schema/general';
import { eq } from 'drizzle-orm';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await requireAdmin(request);
    if (adminCheck instanceof NextResponse) return adminCheck;

    const { id } = await params;
    const body = await request.json();
    const { status, adminNotes } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const [updatedReport] = await db
      .update(reports)
      .set({
        status: status as any,
        adminNotes: adminNotes || null,
        updatedAt: new Date(),
      })
      .where(eq(reports.id, id))
      .returning();

    if (!updatedReport) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ report: updatedReport });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    );
  }
}
