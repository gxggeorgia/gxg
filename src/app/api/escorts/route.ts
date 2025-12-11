import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq, and, ilike, or, count, gt, desc, sql } from 'drizzle-orm';
import { locations } from '@/data/locations';
import { checkSubscriptionStatus } from '@/lib/subscription';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const city = searchParams.get('city') || '';
    const district = searchParams.get('district') || '';
    const gender = searchParams.get('gender') || '';
    const featured = searchParams.get('featured') === 'true';
    const gold = searchParams.get('gold') === 'true';
    const silver = searchParams.get('silver') === 'true';
    const verifiedPhotos = searchParams.get('verifiedPhotos') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build WHERE conditions
    const conditions: any[] = [
      eq(users.role, 'escort'),
      gt(users.publicExpiry, new Date()),
    ];

    // Convert city ID to city name
    let cityName = '';
    if (city) {
      const cityObj = locations.find(c => c.id === city);
      cityName = cityObj?.name.en || city;
    }

    const now = new Date();

    if (featured) {
      conditions.push(gt(users.featuredExpiresAt, now));
    }

    if (gold) {
      conditions.push(gt(users.goldExpiresAt, now));
    }

    if (silver) {
      conditions.push(gt(users.silverExpiresAt, now));
    }

    if (verifiedPhotos) {
      conditions.push(gt(users.verifiedPhotosExpiry, now));
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

    if (searchParams.get('new') === 'true') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      conditions.push(gt(users.createdAt, thirtyDaysAgo));
    }

    if (searchParams.get('online') === 'true') {
      const thirtySecondsAgo = new Date();
      thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30);
      conditions.push(gt(users.lastActive, thirtySecondsAgo));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      const matchingCity = locations.find(c =>
        c.name.ka.toLowerCase().includes(searchLower) ||
        c.name.ru.toLowerCase().includes(searchLower)
      );

      const searchConditions = [
        ilike(users.name, `%${search}%`),
        ilike(users.city, `%${search}%`)
      ];

      if (matchingCity) {
        searchConditions.push(ilike(users.city, `%${matchingCity.name.en}%`));
      }

      conditions.push(or(...searchConditions));
    }

    // Get total count of matching records
    const countResult = await db
      .select({ count: count() })
      .from(users)
      .where(and(...conditions));

    const total = countResult[0]?.count || 0;

    // Check if any filters are applied
    const hasFilters = search || city || district || gender || featured || gold || silver || verifiedPhotos || searchParams.get('new') === 'true' || searchParams.get('online') === 'true';

    const orderByClauses = [];
    if (!hasFilters) {
      // Sort by valid gold/silver status (isGold/isSilver AND not expired)
      orderByClauses.push(
        desc(sql`CASE WHEN ${users.goldExpiresAt} > ${now} THEN 1 ELSE 0 END`),
        desc(sql`CASE WHEN ${users.silverExpiresAt} > ${now} THEN 1 ELSE 0 END`),
        desc(users.createdAt)
      );
    } else {
      orderByClauses.push(desc(users.createdAt));
    }

    // Get paginated results
    const escorts = await db
      .select()
      .from(users)
      .where(and(...conditions))
      .orderBy(...orderByClauses)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.floor(offset / limit) + 1;

    const escortsWithStatus = escorts.map(escort => checkSubscriptionStatus(escort));

    return NextResponse.json({
      escorts: escortsWithStatus,
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
          gold,
          silver,
          verifiedPhotos
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
