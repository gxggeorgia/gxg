'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';



interface Escort {
  id: string;
  slug: string;
  name: string;
  city: string;
  isGold?: boolean;
  isSilver?: boolean;
  images: Array<{ url: string; isPrimary?: boolean }>;
  coverImage?: string;
}

export default function FavoritesPage() {
  const t = useTranslations('favorites');
  const [favorites, setFavorites] = useState<Escort[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        const favoriteIds = JSON.parse(localStorage.getItem('favoriteEscorts') || '[]');
        console.log('Favorite IDs from localStorage:', favoriteIds);

        if (favoriteIds.length === 0) {
          setFavorites([]);
          setLoading(false);
          return;
        }

        // Fetch all escorts with high limit to get all data
        const res = await fetch('/api/escorts?limit=200&offset=0');
        if (res.ok) {
          const data = await res.json();
          console.log('All escorts fetched:', data.escorts.length);
          console.log('Filtering for IDs:', favoriteIds);

          const favoriteEscorts = data.escorts.filter((escort: Escort) => {
            const escortIdStr = String(escort.id);
            const match = favoriteIds.includes(escortIdStr);
            console.log(`Checking ${escort.name} (${escortIdStr}): ${match}`);
            return match;
          });

          console.log('Matched favorites:', favoriteEscorts.length);
          setFavorites(favoriteEscorts);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Heart size={32} className="text-red-500 fill-red-500" />
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{t('title')}</h1>
            </div>
            <p className="text-gray-600">
              {favorites.length === 0
                ? t('noFavorites')
                : t('count', { count: favorites.length })}
            </p>
          </div>

          {/* Favorites Grid */}
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('emptyTitle')}</h2>
              <p className="text-gray-600 mb-6">
                {t('emptyDesc')}
              </p>
              <a
                href="/"
                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                {t('browseEscorts')}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {favorites.map((escort) => (
                <ProfileCard
                  key={escort.id}
                  profile={{
                    id: escort.id,
                    slug: escort.slug,
                    name: escort.name,
                    city: escort.city,
                    isGold: escort.isGold,
                    isSilver: escort.isSilver,

                    isNew: false,
                    isOnline: true,
                    coverImage: (escort.images?.some(img => img.url === escort.coverImage) ? escort.coverImage : null) || (escort.images as any)?.[0]?.url,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
