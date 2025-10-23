import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { reports } from '@/db/schema/general';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { profileId, profileUrl, reason, description, reporterName, reporterEmail } = body;

        // Validate required fields
        if (!reason) {
            return NextResponse.json(
                { error: 'Reason is required' },
                { status: 400 }
            );
        }

        // Get reporter IP
        const reporterIp = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown';

        // Create report
        const [newReport] = await db
            .insert(reports)
            .values({
                profileId: profileId || null,
                profileUrl: profileUrl || null,
                reason,
                description: description || null,
                reporterName: reporterName || null,
                reporterEmail: reporterEmail || null,
                reporterIp,
                status: 'pending',
            })
            .returning();

        return NextResponse.json(
            {
                message: 'Report submitted successfully',
                reportId: newReport.id
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Report submission error:', error);
        return NextResponse.json(
            { error: 'Failed to submit report' },
            { status: 500 }
        );
    }
}
