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
    // Start with fresh params to remove any existing search or filter from rightside or search modal
    const params = new URLSearchParams();

    // Update city
    if (cityId === 'all') {
      // Nothing to set for "All" city
    } else if (currentCity === cityId && !districtId) {
      // Toggle off if clicking the same city without district - params stays empty
    } else {
      params.set('city', cityId);
      if (districtId && districtId !== 'all') {
        params.set('district', districtId);
      }
    }

    // Reset pagination
    params.delete('offset');

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);

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


    </div>
  );
}
