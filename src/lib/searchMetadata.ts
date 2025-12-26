import { generatePageMetadata } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gogoxgeorgia.ge";

type SearchMetadataProps = {
    locale: string;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateSearchMetadata({ locale, searchParams }: SearchMetadataProps): Promise<Metadata> {
    const { search } = await searchParams;
    const t = await getTranslations({ locale, namespace: 'search' });

    if (search && typeof search === 'string') {
        return generatePageMetadata(
            `${t('search')} results for "${search}"`,
            `Find the best escorts matching "${search}" in Georgia. Verified photos, reviews and more.`,
            `/?search=${search}`,
            undefined,
            false,
            locale
        );
    }

    return {};
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
