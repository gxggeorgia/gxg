import RegisterForm from '@/components/auth/RegisterForm';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'seo' });

  return generatePageMetadata(
    t('registerTitle'),
    t('registerDesc'),
    '/register',
    undefined,
    false,
    locale
  );
}

export default function RegisterPage() {
  return <RegisterForm />;
}
