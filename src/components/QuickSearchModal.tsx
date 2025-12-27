'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { X, Search } from 'lucide-react';
import { locations } from '@/data/locations';

type FiltersState = {
  search: string;
  gender: string;
  city: string;
  district: string;
  gold: boolean;
  top: boolean;
  silver: boolean;
  featured: boolean;
  verifiedPhotos: boolean;
  new: boolean;
  online: boolean;
};

interface QuickSearchModalProps {
  open: boolean;
  onClose: () => void;
}

const defaultFilters: FiltersState = {
  search: '',
  gender: '',
  city: 'all',
  district: 'all',
  gold: false,
  top: false,
  silver: false,
  featured: false,
  verifiedPhotos: false,
  new: false,
  online: false,
};

export default function QuickSearchModal({ open, onClose }: QuickSearchModalProps) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ka' | 'ru';
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);

  useEffect(() => {
    if (!open) return;

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
    if (filters.search) params.set('search', filters.search);
    if (filters.gender) params.set('gender', filters.gender);
    if (filters.city && filters.city !== 'all') params.set('city', filters.city);
    if (filters.district && filters.district !== 'all') params.set('district', filters.district);
    if (filters.gold) params.set('gold', 'true');
    if (filters.gold) params.set('gold', 'true');
    if (filters.top) params.set('top', 'true');
    if (filters.silver) params.set('silver', 'true');
    if (filters.featured) params.set('featured', 'true');
    if (filters.verifiedPhotos) params.set('verifiedPhotos', 'true');
    if (filters.new) params.set('new', 'true');
    if (filters.online) params.set('online', 'true');

    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

  const handleClearAll = () => {
    setFilters(defaultFilters);
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.delete('gender');
    params.delete('city');
    params.delete('district');
    params.delete('gold');
    params.delete('top');
    params.delete('silver');
    params.delete('featured');
    params.delete('verifiedPhotos');
    params.delete('new');
    params.delete('online');
    router.push(pathname);
    onClose();
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-60 flex items-start justify-center bg-slate-900/80 backdrop-blur-sm px-4 py-6 sm:py-10">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-red-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-5 border-b border-red-100 bg-red-50">
          <div className="flex items-center gap-2">
            <Search className="text-red-700" size={20} />
            <h2 className="text-lg sm:text-xl font-semibold text-red-800">{t('search.search')}</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white text-red-700 hover:bg-red-100 transition p-2"
            aria-label="Close search modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 sm:px-6 sm:py-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Search by Name</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search escorts..."
              className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="modal-city-select" className="block text-sm font-medium text-gray-700 mb-1.5">{t('search.city')}</label>
              <select
                id="modal-city-select"
                value={filters.city}
                onChange={(event) => {
                  const cityId = event.target.value;
                  setFilters((prev) => ({ ...prev, city: cityId, district: '' }));
                }}
                className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
              >
                {locations.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name[locale]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="modal-district-select" className="block text-sm font-medium text-gray-700 mb-1.5">{t('search.district')}</label>
              <select
                id="modal-district-select"
                value={filters.district}
                onChange={(event) => setFilterValue('district', event.target.value)}
                disabled={!filters.city || districts.length === 0}
                className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name[locale]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="modal-gender-select" className="block text-sm font-medium text-gray-700 mb-1.5">{t('search.gender')}</label>
            <select
              id="modal-gender-select"
              value={filters.gender}
              onChange={(event) => setFilterValue('gender', event.target.value)}
              className="w-full px-3 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
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
                  checked={!!filters.top}
                  onChange={() => handleCheckboxToggle('top')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.top')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.gold}
                  onChange={() => handleCheckboxToggle('gold')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.gold')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.silver}
                  onChange={() => handleCheckboxToggle('silver')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.silver')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={() => handleCheckboxToggle('featured')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">⭐ {t('search.featured')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.verifiedPhotos}
                  onChange={() => handleCheckboxToggle('verifiedPhotos')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.verifiedPhotos')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.new}
                  onChange={() => handleCheckboxToggle('new')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.new')}</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer bg-white p-2.5 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition">
                <input
                  type="checkbox"
                  checked={filters.online}
                  onChange={() => handleCheckboxToggle('online')}
                  className="w-4 h-4 text-purple-600 accent-purple-600 rounded"
                />
                <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.online')}</span>
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
