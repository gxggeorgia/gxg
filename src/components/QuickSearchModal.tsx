'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Search } from 'lucide-react';
import { locations } from '@/data/locations';

type FiltersState = {
  gender: string;
  city: string;
  district: string;
  vipOnly: boolean;
  vipEliteOnly: boolean;
  topOnly: boolean;
  verifiedOnly: boolean;
  newOnly: boolean;
  onlineOnly: boolean;
};

interface QuickSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultFilters: FiltersState = {
  gender: '',
  city: '',
  district: '',
  vipOnly: false,
  vipEliteOnly: false,
  topOnly: false,
  verifiedOnly: false,
  newOnly: false,
  onlineOnly: false,
};

export default function QuickSearchModal({ open, onClose }: QuickSearchModalProps) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ka' | 'ru';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

  useEffect(() => {
    if (!open) return;

    setFilters({
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
  }, [open, searchParams]);

  const selectedCityData = useMemo(
    () => locations.find((city) => city.id === filters.city),
    [filters.city]
  );

  const districts = selectedCityData?.districts || [];

  const setFilterValue = <K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckboxToggle = (key: keyof FiltersState) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
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
    onClose();
  };

  const handleClearAll = () => {
    setFilters(defaultFilters);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('gender');
    params.delete('city');
    params.delete('district');
    params.delete('vip');
    params.delete('vipElite');
    params.delete('top');
    params.delete('verified');
    params.delete('new');
    params.delete('online');
    router.push(`/?${params.toString()}`);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center bg-slate-900/80 backdrop-blur-sm px-4 py-6 sm:py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-purple-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-purple-100 bg-purple-50">
          <div className="flex items-center gap-2">
            <Search className="text-purple-700" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-purple-800">
              {t('search.quickSearch')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white text-purple-700 hover:bg-purple-100 transition p-2"
            aria-label="Close search modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 sm:px-6 sm:py-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('search.city')}</label>
              <select
                value={filters.city}
                onChange={(event) => {
                  const cityId = event.target.value;
                  setFilters((prev) => ({ ...prev, city: cityId, district: '' }));
                }}
                className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
              >
                <option value="">{t('search.allCities')}</option>
                {locations.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name[locale]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('search.district')}</label>
              <select
                value={filters.district}
                onChange={(event) => setFilterValue('district', event.target.value)}
                disabled={!filters.city || districts.length === 0}
                className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">{t('search.allDistricts')}</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name[locale]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('search.gender')}</label>
            <select
              value={filters.gender}
              onChange={(event) => setFilterValue('gender', event.target.value)}
              className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition"
            >
              <option value="">{t('search.allGenders')}</option>
              <option value="female">{t('gender.female')}</option>
              <option value="male">{t('gender.male')}</option>
              <option value="trans">{t('gender.trans')}</option>
            </select>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-800 mb-3">{t('search.quickFilters')}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.vipOnly}
                  onChange={() => handleCheckboxToggle('vipOnly')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.vipOnly')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.vipEliteOnly}
                  onChange={() => handleCheckboxToggle('vipEliteOnly')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.vipEliteOnly')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.topOnly}
                  onChange={() => handleCheckboxToggle('topOnly')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.topOnly')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.verifiedOnly}
                  onChange={() => handleCheckboxToggle('verifiedOnly')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.verifiedOnly')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.newOnly}
                  onChange={() => handleCheckboxToggle('newOnly')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.newOnly')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.onlineOnly}
                  onChange={() => handleCheckboxToggle('onlineOnly')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.onlineOnly')}</span>
              </label>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 sm:px-6 sm:py-5 border-t border-purple-100 bg-purple-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={handleClearAll}
            className="w-full sm:w-auto px-4 py-2.5 bg-white text-purple-700 border border-purple-200 rounded-lg font-semibold hover:bg-purple-100 transition"
          >
            {t('search.clearFilters')}
          </button>
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-5 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
          >
            <Search size={18} />
            {t('search.searchButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
