'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'xgeorgia.me';
    const domain = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').toUpperCase();
    const year = new Date().getFullYear();

    return (
        <footer className="bg-black py-8 mt-auto border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-sm leading-relaxed">
                    {t('copyright', { year, domain })}
                </p>
            </div>
        </footer>
    );
}
