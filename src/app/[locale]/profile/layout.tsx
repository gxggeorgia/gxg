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
        t('dashboardTitle'),
        '',
        '/profile',
        undefined,
        true, // noIndex
        locale
    );
}

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
