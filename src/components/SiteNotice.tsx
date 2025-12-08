'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export default function SiteNotice() {
    const t = useTranslations('siteNotice');
    const telegramUsername = process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || '@gogoxgeorgia';
    const telegramLink = process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/gogoxgeorgia';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'gogoxgeorgia.ge';
    const domain = siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '').toUpperCase();

    const [isExpanded, setIsExpanded] = useState(true);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const savedState = localStorage.getItem('siteNoticeExpanded');
        if (savedState !== null) {
            setIsExpanded(savedState === 'true');
        }
    }, []);

    const toggleNotice = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);
        localStorage.setItem('siteNoticeExpanded', String(newState));
    };

    if (!isMounted) return null;

    return (
        <div className="bg-red-50 border-t border-b border-red-200">
            {/* Header / Toggle */}
            <div
                onClick={toggleNotice}
                className="max-w-7xl mx-auto py-3 px-3 flex items-center justify-between cursor-pointer hover:bg-red-100/50 transition-colors"
            >
                <div className="flex items-center gap-2 text-red-800 font-bold">
                    <AlertTriangle size={20} className="text-red-600" />
                    <span>{t('vpnWarning')}</span>
                </div>
                <button className="text-red-700 hover:text-red-900 transition-colors flex items-center gap-1 text-sm font-medium">
                    <span>{isExpanded ? t('hide') : t('more')}</span>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {/* Content */}
            {isExpanded && (
                <div className="max-w-7xl mx-auto px-3 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
                    {/* VPN Warning Details */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-600 text-sm">
                            {t('vpnInstructions')}
                        </p>
                    </div>

                    {/* Telegram Info */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
                        <svg className="w-8 h-8 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                        </svg>
                        <p className="text-blue-800 font-medium">
                            {t('telegramInfo', { telegramUsername })}
                        </p>
                    </div>

                    {/* Site Info */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-green-800 font-medium">
                            {t('siteInfo', { domain })} <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="text-green-600 underline font-bold ml-1">{telegramUsername}</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
