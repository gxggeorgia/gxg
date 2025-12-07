'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Search, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { locations } from '@/data/locations';

export default function RightSidebar() {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ka' | 'ru';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Initialize state from URL params
  const [filters, setFilters] = useState({
    gender: searchParams.get('gender') || '',
    city: searchParams.get('city') || '',
    district: searchParams.get('district') || '',
    vipOnly: searchParams.get('vip') === 'true',
    vipEliteOnly: searchParams.get('vipElite') === 'true',
    topOnly: searchParams.get('top') === 'true',
    verifiedOnly: searchParams.get('verified') === 'true',
    newOnly: searchParams.get('new') === 'true',
    onlineOnly: searchParams.get('online') === 'true',
  });

  // Get districts for selected city
  const selectedCityData = locations.find(c => c.id === filters.city);
  const districts = selectedCityData?.districts || [];

  const handleCheckboxChange = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.city) params.set('city', filters.city);
    if (filters.district) params.set('district', filters.district);
    if (filters.vipOnly) params.set('vip', 'true');
    if (filters.vipEliteOnly) params.set('vipElite', 'true');
    if (filters.topOnly) params.set('top', 'true');
    if (filters.verifiedOnly) params.set('verified', 'true');
    if (filters.newOnly) params.set('new', 'true');
    if (filters.onlineOnly) params.set('online', 'true');

    router.push(`/?${params.toString()}`);
  };

  // Reset district when city changes
  const handleCityChange = (cityId: string) => {
    setFilters(prev => ({ ...prev, city: cityId, district: '' }));
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg">
      {/* Header - Clickable on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-6 flex items-center justify-between lg:cursor-default"
      >
        <h3 className="text-lg sm:text-xl font-bold text-purple-700">Search</h3>
        <ChevronDown
          className={`lg:hidden transition-transform text-purple-700 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>

      {/* Search Content - Collapsible on mobile, always open on desktop */}
      <div className={`px-4 pb-4 sm:px-6 sm:pb-6 space-y-3 sm:space-y-4 ${isOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Location Filters */}
        <div className="grid grid-cols-2 gap-2">
          {/* City Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
            <select
              value={filters.city}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full px-2 py-2 bg-white border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            >
              <option value="">All Cities</option>
              {locations.map(city => (
                <option key={city.id} value={city.id}>{city.name[locale]}</option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
            <select
              value={filters.district}
              onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value }))}
              disabled={!filters.city || districts.length === 0}
              className="w-full px-2 py-2 bg-white border-2 border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">All Districts</option>
              {districts.map(district => (
                <option key={district.id} value={district.id}>{district.name[locale]}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gender Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
          >
            <option value="">All Genders</option>
            <option value="female">{t('gender.female')}</option>
            <option value="male">{t('gender.male')}</option>
            <option value="trans">Trans</option>
          </select>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
            <input
              type="checkbox"
              checked={filters.vipOnly}
              onChange={() => handleCheckboxChange('vipOnly')}
              className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">VIP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
            <input
              type="checkbox"
              checked={filters.vipEliteOnly}
              onChange={() => handleCheckboxChange('vipEliteOnly')}
              className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">VIP Elite</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
            <input
              type="checkbox"
              checked={filters.topOnly}
              onChange={() => handleCheckboxChange('topOnly')}
              className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">TOP</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
            <input
              type="checkbox"
              checked={filters.verifiedOnly}
              onChange={() => handleCheckboxChange('verifiedOnly')}
              className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.verifiedOnly')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
            <input
              type="checkbox"
              checked={filters.newOnly}
              onChange={() => handleCheckboxChange('newOnly')}
              className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">New</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
            <input
              type="checkbox"
              checked={filters.onlineOnly}
              onChange={() => handleCheckboxChange('onlineOnly')}
              className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
            />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">Online</span>
          </label>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2 text-sm sm:text-base shadow-md"
        >
          <Search size={18} className="sm:w-5 sm:h-5" />
          {t('search.searchButton')}
        </button>

      
      </div>
    </div>
  );
}
