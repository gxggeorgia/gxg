'use client';

import { useTranslations } from 'next-intl';
import { Heart } from 'lucide-react';

interface ProfileCardProps {
  profile: {
    id: number;
    name: string;
    city: string;
    isVip: boolean;
    isVerified: boolean;
    isNew: boolean;
    isOnline: boolean;
  };
  compact?: boolean;
}

export default function ProfileCard({ profile, compact = false }: ProfileCardProps) {
  const t = useTranslations();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer group">
      {/* Image Container */}
      <div className="relative">
        {/* Placeholder Image */}
        <div className={`${compact ? 'h-48' : 'h-64'} bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center`}>
          <span className="text-6xl">👤</span>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {profile.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              {t('profile.new')}
            </span>
          )}
          {profile.isVip && (
            <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
              {t('profile.vip')}
            </span>
          )}
        </div>

        {/* Verified Badge */}
        {profile.isVerified && (
          <div className="absolute top-2 right-2">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              ✓ {t('profile.verified')}
            </span>
          </div>
        )}

        {/* Online Status */}
        {profile.isOnline && (
          <div className="absolute bottom-2 left-2">
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              {t('profile.online')}
            </span>
          </div>
        )}

        {/* Like Button */}
        <button className="absolute bottom-2 right-2 bg-white/90 hover:bg-red-500 hover:text-white p-2 rounded-full transition group">
          <Heart size={18} className="group-hover:fill-current" />
        </button>

        {/* 100% PHOTOS Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
          <span className="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg">
            100% PHOTOS
          </span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-3 bg-white">
        <h4 className="font-bold text-lg mb-1 text-gray-900">{profile.name}</h4>
        <p className="text-sm text-gray-600 mb-2">
          {profile.city}
        </p>
        <p className="text-xs text-gray-500">
          {t('profile.lastActive')}: 5 min ago
        </p>
      </div>
    </div>
  );
}
