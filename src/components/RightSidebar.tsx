'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Search, ChevronDown, Crown, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { locations } from '@/data/locations';

export default function RightSidebar() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ka' | 'ru';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize state from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    gender: searchParams.get('gender') || '',
    city: searchParams.get('city') || 'all',
    district: searchParams.get('district') || 'all',
    gold: searchParams.get('gold') === 'true',
    top: searchParams.get('top') === 'true',
    silver: searchParams.get('silver') === 'true',
    featured: searchParams.get('featured') === 'true',
    verifiedPhotos: searchParams.get('verifiedPhotos') === 'true',
    new: searchParams.get('new') === 'true',
    online: searchParams.get('online') === 'true',
  });

  // Sync state with URL params
  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      gender: searchParams.get('gender') || '',
      city: searchParams.get('city') || 'all',
      district: searchParams.get('district') || 'all',
      gold: searchParams.get('gold') === 'true',
      top: searchParams.get('top') === 'true',
      silver: searchParams.get('silver') === 'true',
      featured: searchParams.get('featured') === 'true',
      verifiedPhotos: searchParams.get('verifiedPhotos') === 'true',
      new: searchParams.get('new') === 'true',
      online: searchParams.get('online') === 'true',
    });
  }, [searchParams]);

  // Get districts for selected city
  const selectedCityData = locations.find(c => c.id === filters.city);
  const districts = selectedCityData?.districts || [];

  const handleCheckboxChange = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const pathname = usePathname();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.city && filters.city !== 'all') params.set('city', filters.city);
    if (filters.district && filters.district !== 'all') params.set('district', filters.district);
    if (filters.gold) params.set('gold', 'true');
    if (filters.top) params.set('top', 'true');
    if (filters.silver) params.set('silver', 'true');
    if (filters.featured) params.set('featured', 'true');
    if (filters.verifiedPhotos) params.set('verifiedPhotos', 'true');
    if (filters.new) params.set('new', 'true');
    if (filters.online) params.set('online', 'true');

    router.push(`${pathname}?${params.toString()}`);
  };

  // Reset district when city changes
  const handleCityChange = (cityId: string) => {
    setFilters(prev => ({ ...prev, city: cityId, district: '' }));
  };

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg">
      {/* Header - Clickable on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-6 flex items-center justify-between lg:cursor-default"
      >
        <h3 className="text-lg sm:text-xl font-bold text-red-700">{t('search.search')}</h3>
        <ChevronDown
          className={`lg:hidden transition-transform text-red-700 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>

      {/* Search Content - Collapsible on mobile, always open on desktop */}
      <div className={`px-4 pb-4 sm:px-6 sm:pb-6 space-y-3 sm:space-y-4 ${isOpen ? 'block' : 'hidden'} lg:block`}>

        {/* Search by Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Search by Name</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search escorts..."
            className="w-full px-2 py-2 bg-white border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          />
        </div>

        {/* Location Filters */}
        <div className="grid grid-cols-2 gap-2">
          {/* City Dropdown */}
          <div>
            <label htmlFor="city-select" className="block text-xs font-medium text-gray-700 mb-1">{t('search.city')}</label>
            <select
              id="city-select"
              value={filters.city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-2 py-2 bg-white border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
            >
              {locations.map(city => (
                <option key={city.id} value={city.id}>{city.name[locale]}</option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <label htmlFor="district-select" className="block text-xs font-medium text-gray-700 mb-1">{t('search.district')}</label>
            <select
              id="district-select"
              value={filters.district}
              onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
              disabled={!filters.city || districts.length === 0}
              className="w-full px-2 py-2 bg-white border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {districts.map(district => (
                <option key={district.id} value={district.id}>{district.name[locale]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gender Dropdown */}
        <div>
          <label htmlFor="gender-select" className="block text-sm font-medium text-gray-700 mb-1.5">{t('search.gender')}</label>
          <select
            id="gender-select"
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          >
            <option value="">{t('search.allGenders')}</option>
            <option value="female">{t('gender.female')}</option>
            <option value="male">{t('gender.male')}</option>
            <option value="trans">{t('gender.trans')}</option>
          </select>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-red-300 transition">
            <input
              type="checkbox"
              checked={filters.top}
              onChange={() => handleCheckboxChange('top')}
              className="w-4 h-4 text-red-600 accent-red-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.top')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-red-300 transition">
            <input
              type="checkbox"
              checked={filters.gold}
              onChange={() => handleCheckboxChange('gold')}
              className="w-4 h-4 text-red-600 accent-red-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.gold')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-red-300 transition">
            <input
              type="checkbox"
              checked={filters.silver}
              onChange={() => handleCheckboxChange('silver')}
              className="w-4 h-4 text-red-600 accent-red-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.silver')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-red-300 transition">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={() => handleCheckboxChange('featured')}
              className="w-4 h-4 text-red-600 accent-red-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.featured')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-red-300 transition">
            <input
              type="checkbox"
              checked={filters.verifiedPhotos}
              onChange={() => handleCheckboxChange('verifiedPhotos')}
              className="w-4 h-4 text-red-600 accent-red-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.verifiedPhotos')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-red-300 transition">
            <input
              type="checkbox"
              checked={filters.new}
              onChange={() => handleCheckboxChange('new')}
              className="w-4 h-4 text-red-600 accent-red-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.new')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-red-300 transition">
            <input
              type="checkbox"
              checked={filters.online}
              onChange={() => handleCheckboxChange('online')}
              className="w-4 h-4 text-red-600 accent-red-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.online')}</span>
          </label>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-md"
        >
          <Search size={18} className="sm:w-5 sm:h-5" />
          {t('search.searchButton')}
        </button>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            setFilters({
              search: '',
              gender: '',
              city: '',
              district: '',
              gold: false,
              top: false,
              silver: false,
              featured: false,
              verifiedPhotos: false,
              new: false,
              online: false,
            });
            router.push('/');
          }}
          className="w-full text-gray-500 hover:text-gray-700 underline text-sm transition-colors mt-2"
        >
          {t('search.clearFilters')}
        </button>


      </div>
    </div>
  );
}
