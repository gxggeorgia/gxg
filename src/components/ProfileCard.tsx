'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Heart, MapPin, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProfileCardProps {
  profile: {
    id: string | number;
    slug?: string; // SEO-friendly URL slug
    name: string;
    city: string;
    isVip: boolean;
    isVipElite?: boolean;
    isVerified: boolean;
    isNew?: boolean;
    isOnline: boolean;
    coverImage?: string;
    imageWidth?: number;
    imageHeight?: number;
    languages?: Array<{ name: string; level: string }>;
  };
  compact?: boolean;
}

export default function ProfileCard({ profile, compact = false }: ProfileCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteEscorts') || '[]');
    setIsFavorite(favorites.includes(profile.id));
  }, [profile.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favoriteEscorts') || '[]');
    const profileId = profile.id; // Store as number

    if (isFavorite) {
      const updated = favorites.filter((id: number) => id !== profileId);
      localStorage.setItem('favoriteEscorts', JSON.stringify(updated));
      setIsFavorite(false);
    } else {
      favorites.push(profileId);
      localStorage.setItem('favoriteEscorts', JSON.stringify(favorites));
      setIsFavorite(true);
      setShowMessage(true);
      setTimeout(() => setShowMessage(false), 2000);
    }
  };

  // Use slug if available, otherwise fall back to id
  const profileUrl = profile.slug ? `/${locale}/escort/${profile.slug}` : `/${locale}/escort/${profile.id}`;
  
  return (
    <Link href={profileUrl}>
      <div className="bg-white rounded-lg   hover:shadow-xl transition cursor-pointer group overflow-hidden">
      {/* Image Container - Relative for badges */}
      <div className="relative w-full" style={{ aspectRatio: profile.imageWidth && profile.imageHeight ? `${profile.imageWidth}/${profile.imageHeight}` : '3/4' }}>
        {/* Profile Image or Placeholder */}
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt={profile.name}
            className="h-full w-full object-contain bg-gray-100"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-pink-200 to-purple-200 flex items-center justify-center">
            <span className="text-6xl">👤</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 md:top-2 md:left-2 flex flex-col gap-0.5">
          {profile.isVipElite && (
            <span className="bg-purple-600 text-white text-[9px] md:text-[10px] font-bold px-1 md:px-1.5 py-0.5 rounded whitespace-nowrap">
              Elite VIP
            </span>
          )}
          {profile.isVip && !profile.isVipElite && (
            <span className="bg-yellow-400 text-black text-[9px] md:text-[10px] font-bold px-1 md:px-1.5 py-0.5 rounded whitespace-nowrap">
              VIP
            </span>
          )}
        </div>

        {/* Verified Badge */}
        {profile.isVerified && (
          <div className="absolute top-0 right-0 md:top-2 md:right-2">
            <span className="bg-green-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2.5 py-0.5 md:py-1 rounded whitespace-nowrap">
              verified
            </span>
          </div>
        )}

        {/* Online Status */}
        {profile.isOnline && (
          <div className="absolute bottom-2 left-2 md:left-2">
            <span className="bg-green-500 text-white text-[10px] md:text-xs font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex items-center gap-0.5 md:gap-1 whitespace-nowrap">
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse"></span>
              {t('profile.online')}
            </span>
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`absolute bottom-2 right-2 md:right-3 p-1.5 md:p-2 rounded-full transition backdrop-blur-sm ${
            isFavorite
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-black/40 hover:bg-red-500 text-white hover:text-white'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            size={18}
            className={`transition ${
              isFavorite ? 'fill-white text-white' : 'text-gray-400 group-hover:text-white'
            }`}
          />
        </button>

        {/* Save Message */}
        {showMessage && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            Saving locally in browser
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-2.5 bg-white border-t border-gray-100 space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs">
          <h4 className="font-semibold text-gray-900 truncate flex-1 text-sm">{profile.name}</h4>
          <div className="flex items-center gap-0.5 text-gray-500 shrink-0 text-[11px]">
            <MapPin size={11} />
            <span className="truncate max-w-[50px]">{profile.city}</span>
          </div>
        </div>
        {profile.languages && profile.languages.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <MessageCircle size={11} className="shrink-0" />
            <span className="truncate text-[11px]">
              {profile.languages.map(lang => lang.name).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
    </Link>
  );
}
