import { generatePageMetadata } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import { locations } from '@/data/locations';
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gogoxgeorgia.ge";

type SearchMetadataProps = {
    locale: string;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateSearchMetadata({ locale, searchParams }: SearchMetadataProps): Promise<Metadata> {
    const { search, city, district } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'seo' });
    const searchT = await getTranslations({ locale, namespace: 'search' });
    const common = await getTranslations({ locale, namespace: 'common' });

    // Helper to get localized name
    const getCityName = (id: string) => {
        const c = locations.find(l => l.id === id);
        return c?.name[locale as keyof typeof c.name] || id;
    };

    const getDistrictName = (cityId: string, districtId: string) => {
        const c = locations.find(l => l.id === cityId);
        const d = c?.districts.find(d => d.id === districtId);
        return d?.name[locale as keyof typeof d.name] || districtId;
    };

    let title = '';
    let description = '';
    let canonical = '/';

    // 1. Search + Filters
    if (search && typeof search === 'string') {
        title = `${searchT('searchResultsFor')} "${search}"`;
        description = searchT('searchDescription', { search });
        canonical = `/?search=${search}`;
        if (city && city !== 'all') {
            const cityName = getCityName(city as string);
            let locationSuffix = cityName;

            if (district && district !== 'all') {
                const districtName = getDistrictName(city as string, district as string);
                locationSuffix = `${districtName}, ${cityName}`;
                canonical += `&city=${city}&district=${district}`;
            } else {
                canonical += `&city=${city}`;
            }

            title += ` | ${locationSuffix}`;
        }
    }
    // 2. City Filter (and optional District)
    else if (city && city !== 'all' && typeof city === 'string') {
        const cityName = getCityName(city);
        let districtName = '';

        if (district && district !== 'all' && typeof district === 'string') {
            districtName = getDistrictName(city, district);
            title = `${common('escorts')} ${districtName}, ${cityName}`;
            description = `Find the best escorts in ${districtName}, ${cityName}. Verified profiles, photos and reviews.`;
            canonical = `/?city=${city}&district=${district}`;
        } else {
            title = `${common('escorts')} ${cityName}`;
            description = `Find the best escorts in ${cityName}. Verified profiles, photos and reviews.`;
            canonical = `/?city=${city}`;
        }
    }

    if (title) {
        return generatePageMetadata(
            title,
            description,
            canonical,
            undefined,
            false,
            locale
        );
    }

    // Default Homepage Metadata
    return generatePageMetadata(
        t('homeTitle'),
        t('homeDesc'),
        '/',
        undefined,
        false,
        locale
    );
}

export function generateOrganizationSchema(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'GOGO XGEORGIA',
        url: `${baseUrl}/${locale}`,
        logo: `${baseUrl}/icons/logo.png`,
        description: 'GOGOXGEORGIA.GE | Escort Girls, Companions & VIP Services in Georgia',
        sameAs: [
            'https://www.facebook.com/escortdirectoryga',
            'https://www.twitter.com/escortdirectoryga',
            'https://www.instagram.com/escortdirectoryga',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            email: 'support@gogoxgeorgia.ge',
        },
    };
}

export function generateWebsiteSchema(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'GOGO XGEORGIA',
        url: `${baseUrl}/${locale}`,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/${locale}?search={search_term_string}`,
            },
            query_input: 'required name=search_term_string',
        },
    };
}
