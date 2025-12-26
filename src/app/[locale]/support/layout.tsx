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
        t('supportTitle'),
        t('supportDesc'),
        '/support',
        undefined,
        false,
        locale
    );
}

export default function SupportLayout({ children }: Props) {
    return children;
}
