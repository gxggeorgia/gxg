'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, Clock } from 'lucide-react';

interface StatusBarProps {
  status?: 'public' | 'private';
}

export default function StatusBar({ status }: StatusBarProps) {
  const t = useTranslations('common');
  const telegramLink = process.env.NEXT_PUBLIC_TELEGRAM_LINK || '';

  const isPrivate = status === 'private';
  const isVisible = isPrivate;
  const showTelegram = isPrivate && telegramLink;

  if (!isVisible) return null;

  return (
    <div className="sticky top-0 z-40 w-full py-3 px-4 text-white font-semibold text-center border-b-2 bg-linear-to-r from-amber-500 to-orange-500 border-amber-600">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-3">
        <Clock size={20} className="shrink-0 animate-spin" />
        <div className="flex-1">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
            <p className="text-sm md:text-base">
              {`⏳ ${t('accountPending')}`}
            </p>
            {showTelegram && (
              <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition">
                {t('openTelegramChannel')}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
