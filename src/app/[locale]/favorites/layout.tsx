import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/seo';

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'seo' });

    return generatePageMetadata(
        t('favoritesTitle'),
        t('favoritesDesc'),
        '/favorites',
        undefined,
        false,
        locale
    );
}

import Script from 'next/script';

export default async function FavoritesLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${siteUrl}/${locale}`
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Favorites',
                item: `${siteUrl}/${locale}/favorites`
            }
        ]
    };

    return (
        <>
            <Script
                id="breadcrumb-favorites"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            {children}
        </>
    );
}
