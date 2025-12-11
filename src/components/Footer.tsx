'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { usePathname } from 'next/navigation';

import { Link } from '@/i18n/routing';

export default function Footer() {
    const pathname = usePathname();
    const t = useTranslations('footer');
    const tCommon = useTranslations('common');

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

                {/* Telegram Link */}
                <div className="flex justify-center mb-6">
                    <div className="flex items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-800">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <p className="text-xs text-gray-400">{tCommon('contactUsOn')}</p>
                            <a
                                href={process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/gogoxgeorgia'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 font-semibold hover:text-blue-300 transition-colors text-sm"
                            >
                                {process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || (process.env.NEXT_PUBLIC_TELEGRAM_LINK ? `@${process.env.NEXT_PUBLIC_TELEGRAM_LINK.split('/').pop()}` : '@gogoxgeorgia')}
                            </a>
                        </div>
                    </div>
                </div>

                <p className="text-sm leading-relaxed text-gray-500">
                    {t('copyright', { year, domain })}
                </p>
            </div>
        </footer >
    );
}
