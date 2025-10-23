import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq, and, ilike, or, count } from 'drizzle-orm';
import { locations } from '@/data/locations';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const district = searchParams.get('district') || '';
    const gender = searchParams.get('gender') || '';
    const featured = searchParams.get('featured') === 'true';
    const vipOnly = searchParams.get('vip') === 'true';
    const vipEliteOnly = searchParams.get('vipElite') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build WHERE conditions
    const conditions: any[] = [
      eq(users.role, 'escort'),
      eq(users.status, 'public'),
    ];

    // Convert city ID to city name
    let cityName = '';
    if (city) {
      const cityObj = locations.find(c => c.id === city);
      cityName = cityObj?.name.en || city;
    }

    console.log('API Filters:', { search, city, cityName, district, gender, featured, vipOnly, vipEliteOnly });

    if (featured) {
      conditions.push(eq(users.isFeatured, true));
    }

    if (vipOnly) {
      conditions.push(eq(users.isVip, true));
    }

    if (vipEliteOnly) {
      conditions.push(eq(users.isVipElite, true));
    }

    if (cityName) {
      conditions.push(eq(users.city, cityName));
    }

    if (district) {
      conditions.push(eq(users.district, district));
    }

    if (gender) {
      conditions.push(eq(users.gender, gender as any));
    }

    if (search) {
      conditions.push(
        or(
          ilike(users.name, `%${search}%`),
          ilike(users.city, `%${search}%`)
        )
      );
    }

    // Get total count of matching records
    const countResult = await db
      .select({ count: count() })
      .from(users)
      .where(and(...conditions));
    
    const total = countResult[0]?.count || 0;

    // Get paginated results
    const escorts = await db
      .select()
      .from(users)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    return NextResponse.json({
      escorts,
      pagination: {
        total,
        limit,
        offset,
        currentPage,
        totalPages,
        hasNextPage: offset + limit < total,
        hasPreviousPage: offset > 0
      },
      meta: {
        timestamp: new Date().toISOString(),
        filters: {
          search: search || null,
          city: city || null,
          district: district || null,
          gender: gender || null,
          featured,
          vipOnly,
          vipEliteOnly
        }
      }
    });
  } catch (error) {
    console.error('Error fetching escorts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch escorts' },
      { status: 500 }
    );
  }
}
