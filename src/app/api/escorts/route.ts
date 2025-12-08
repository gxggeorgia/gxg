import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq, and, ilike, or, count, gt, desc } from 'drizzle-orm';
import { locations } from '@/data/locations';

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
      eq(users.status, 'verified'),
    ];

    // Convert city ID to city name
    let cityName = '';
    if (city) {
      const cityObj = locations.find(c => c.id === city);
      cityName = cityObj?.name.en || city;
    }

    console.log('API Filters:', { search, city, cityName, district, gender, featured, gold, silver, verifiedPhotos });

    const now = new Date();

    if (featured) {
      conditions.push(and(eq(users.isFeatured, true), gt(users.featuredExpiresAt, now)));
    }

    if (gold) {
      conditions.push(and(eq(users.isGold, true), gt(users.goldExpiresAt, now)));
    }

    if (silver) {
      conditions.push(and(eq(users.isSilver, true), gt(users.silverExpiresAt, now)));
    }

    if (verifiedPhotos) {
      conditions.push(eq(users.verifiedPhotos, true));
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
      const fifteenMinutesAgo = new Date();
      fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);
      conditions.push(gt(users.lastActive, fifteenMinutesAgo));
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
      orderByClauses.push(desc(users.isGold), desc(users.isSilver), desc(users.createdAt));
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
