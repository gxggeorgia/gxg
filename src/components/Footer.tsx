'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/routing';

export default function Footer() {
    const pathname = usePathname();
    const t = useTranslations('footer');

    // Don't show footer on admin pages
    if (pathname.includes('/admin')) {
        return null;
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'gogoxgeorgia.ge';
    const domain = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').toUpperCase();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-black py-8 mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="flex justify-center gap-6 mb-4 text-sm text-gray-400">
                    <Link href="/terms" className="hover:text-white transition-colors">{t('termsOfService')}</Link>
                    <Link href="/privacy" className="hover:text-white transition-colors">{t('privacyPolicy')}</Link>
                </div>
                <p className="text-sm leading-relaxed text-gray-500">
                    {t('copyright', { year, domain })}
                </p>
            </div>
        </footer >
    );
}
