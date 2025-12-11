"use client"
import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { locations } from '@/data/locations';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';

export default function LeftSidebar() {
  const locale = useLocale() as 'en' | 'ka' | 'ru';
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const currentCity = searchParams.get('city');
  const currentDistrict = searchParams.get('district');

  // Auto-expand the city if it's selected in the URL
  useEffect(() => {
    if (currentCity) {
      setExpandedCity(currentCity);
    }
  }, [currentCity]);

  const handleFilter = (cityId: string, districtId?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update city
    if (currentCity === cityId && !districtId) {
      // Toggle off if clicking the same city without district
      params.delete('city');
      params.delete('district');
    } else {
      params.set('city', cityId);
      if (districtId) {
        params.set('district', districtId);
      } else {
        params.delete('district');
      }
    }

    // Reset pagination
    params.delete('offset');

    router.push(`${pathname}?${params.toString()}`);

    // On mobile, close sidebar after selection
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header - Clickable on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border-b border-gray-200 flex items-center justify-between lg:cursor-default"
      >
        <h3 className="font-bold text-base text-red-600">
          {t('common.escortsCityList')}
        </h3>
        <ChevronDown
          className={`lg:hidden transition-transform text-red-600 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>

      {/* City List - Collapsible on mobile, always open on desktop */}
      <ul className={`p-2 ${isOpen ? 'block' : 'hidden'} lg:block`}>
        {locations.map((city) => {
          const isCityActive = currentCity === city.id;
          return (
            <li key={city.id} className="mb-1">
              <div className="flex items-center">
                <div
                  onClick={() => city.districts.length > 0 && setExpandedCity(expandedCity === city.id ? null : city.id)}
                  className={`flex-1 flex items-center justify-between px-3 py-2 rounded text-left text-sm transition cursor-pointer ${isCityActive && !currentDistrict
                    ? 'bg-red-50 text-red-700 font-bold'
                    : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilter(city.id);
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    {city.name[locale]}
                  </span>
                  {city.districts.length > 0 && (
                    <div className="p-1">
                      <ChevronRight
                        size={16}
                        className={`transition-transform ${expandedCity === city.id ? 'rotate-90 text-red-600' : 'text-gray-400'}`}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Districts dropdown */}
              {expandedCity === city.id && city.districts.length > 0 && (
                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-red-100 pl-2">
                  {city.districts.map((district) => {
                    const isDistrictActive = currentDistrict === district.id;
                    return (
                      <li key={district.id}>
                        <button
                          onClick={() => handleFilter(city.id, district.id)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded transition ${isDistrictActive
                            ? 'text-red-700 font-bold bg-red-50'
                            : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
                            }`}
                        >
                          {district.name[locale]}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {/* Telegram Link */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-600">{t('common.contactUsOn')}</p>
            <a
              href={process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me/gogoxgeorgia'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline"
            >
              {process.env.NEXT_PUBLIC_TELEGRAM_USERNAME || (process.env.NEXT_PUBLIC_TELEGRAM_LINK ? `@${process.env.NEXT_PUBLIC_TELEGRAM_LINK.split('/').pop()}` : '@gogoxgeorgia')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
