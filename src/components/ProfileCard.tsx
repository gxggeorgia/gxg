'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Heart, MapPin, MessageCircle, Crown, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProfileCardProps {
  profile: {
    id: string | number;
    slug?: string; // SEO-friendly URL slug
    name: string;
    city: string;
    district?: string;
    isGold?: boolean;
    isTop?: boolean;
    isSilver?: boolean;
    verifiedPhotos?: boolean;
    isNew?: boolean;
    isOnline?: boolean;
    lastActive?: string | Date | null;
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
  const [onlineStatus, setOnlineStatus] = useState<{ isOnline: boolean; text: string } | null>(null);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteEscorts') || '[]');
    setIsFavorite(favorites.includes(profile.id));
  }, [profile.id]);

  useEffect(() => {
    if (!profile.lastActive) {
      setOnlineStatus(null);
      return;
    }

    const calculateStatus = () => {
      const lastActiveDate = new Date(profile.lastActive!);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - lastActiveDate.getTime()) / 1000);

      if (diffInSeconds <= 30) {
        setOnlineStatus({ isOnline: true, text: t('profile.online') });
      } else {
        let timeText = '';
        if (diffInSeconds < 60) {
          timeText = `${diffInSeconds}s`;
        } else if (diffInSeconds < 3600) {
          timeText = `${Math.floor(diffInSeconds / 60)}m`;
        } else if (diffInSeconds < 86400) {
          timeText = `${Math.floor(diffInSeconds / 3600)}h`;
        } else {
          timeText = `${Math.floor(diffInSeconds / 86400)}d`;
        }
        setOnlineStatus({ isOnline: false, text: `${t('profile.lastSeen')} ${timeText}` });
      }
    };

    calculateStatus();
    // Update status every minute to keep "last seen" relatively fresh
    const interval = setInterval(calculateStatus, 60000);
    return () => clearInterval(interval);
  }, [profile.lastActive]);

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
        <div className="relative w-full aspect-[3/4]">
          {/* Profile Image or Placeholder */}
          {profile.coverImage ? (
            <>
              <img
                src={profile.coverImage}
                alt={profile.name}
                className="h-full w-full object-cover bg-gray-100"
              />
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
                <img
                  src="/icons/logo-bgless.png"
                  alt="Watermark"
                  className="w-1/4 h-auto object-contain"
                />
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-linear-to-br from-pink-200 to-red-200 flex items-center justify-center">
              <span className="text-6xl">👤</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 md:top-2 md:left-2 flex flex-col gap-0.5 z-10">
            {profile.isSilver && (
              <span className="bg-gray-400 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                {t('profile.silver')}
              </span>
            )}
            {profile.isGold && (
              <span className="bg-yellow-500 text-white text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                {t('profile.gold')}
              </span>
            )}
          </div>

          {/* Premium Right-Side Badges */}
          <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
            {profile.isTop && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-md shadow-purple-900/20 backdrop-blur-sm">
                <Crown size={12} className="fill-white/20" />
                {t('profile.top')}
              </span>
            )}
            {profile.isNew && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-md shadow-emerald-900/20 backdrop-blur-sm">
                <Sparkles size={12} className="fill-white/20" />
                {t('profile.new')}
              </span>
            )}

            {/* Online Status (Moved below premium badges) */}
          </div>







          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute bottom-2 right-2 md:right-3 p-1.5 md:p-2 rounded-full transition backdrop-blur-sm ${isFavorite
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-black/40 hover:bg-red-500 text-white hover:text-white'
              }`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              size={18}
              className={`transition ${isFavorite ? 'fill-white text-white' : 'text-gray-400 group-hover:text-white'
                }`}
            />
          </button>

          {/* Save Message */}
          {showMessage && (
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              Saving locally in browser
            </div>
          )}
          {/* Verified Badge - Bottom Left */}
          {profile.verifiedPhotos && (
            <div className="absolute bottom-2 left-2">
              <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                100% Photos
              </span>
            </div>
          )}
        </div>
        {/* Profile Info */}
        <div className="p-2.5 bg-white border-t border-gray-100 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs">
            <h4 className="font-semibold text-gray-900 truncate flex-1 text-sm">{profile.name}</h4>
            <div className="flex items-center gap-0.5 text-gray-500 shrink-0 text-[11px]">
              <MapPin size={11} />
              <span className="truncate max-w-[120px]">{profile.city}{profile.district ? `, ${profile.district}` : ''}</span>
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

          {/* Online/Last Seen Status */}
          {onlineStatus && (
            <div className={`text-[10px] flex items-center gap-1 ${onlineStatus.isOnline ? 'justify-end' : 'justify-start'}`}>
              {onlineStatus.isOnline ? (
                <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-200 font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                  {onlineStatus.text}
                </span>
              ) : (
                <div className="flex items-center gap-1 text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                  {onlineStatus.text}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
