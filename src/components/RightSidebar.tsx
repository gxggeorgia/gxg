'use client';

import { useTranslations } from 'next-intl';
import { Search, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function RightSidebar() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg lg:sticky lg:top-20">
      {/* Header - Clickable on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 sm:p-6 flex items-center justify-between lg:cursor-default"
      >
        <h3 className="text-lg sm:text-xl font-bold text-red-600">Quick Search:</h3>
        <ChevronDown 
          className={`lg:hidden transition-transform text-red-600 ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </button>
      
      {/* Search Content - Collapsible on mobile, always open on desktop */}
      <div className={`px-4 pb-4 sm:px-6 sm:pb-6 space-y-3 sm:space-y-4 ${isOpen ? 'block' : 'hidden'} lg:block`}>
        {/* Gender Selection */}
        <div className="grid grid-cols-2 sm:flex gap-2">
          <button className="flex-1 bg-pink-500 text-white py-2 px-2 rounded hover:bg-pink-600 transition text-xs sm:text-sm font-semibold">
            {t('gender.female')}
          </button>
          <button className="flex-1 bg-blue-500 text-white py-2 px-2 rounded hover:bg-blue-600 transition text-xs sm:text-sm font-semibold">
            {t('gender.male')}
          </button>
          <button className="flex-1 bg-purple-500 text-white py-2 px-2 rounded hover:bg-purple-600 transition text-xs sm:text-sm font-semibold">
            Trans
          </button>
          <button className="flex-1 bg-yellow-500 text-black py-2 px-2 rounded hover:bg-yellow-600 transition text-xs sm:text-sm font-semibold">
            TOP
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border hover:border-red-300 transition">
            <input type="checkbox" className="w-4 h-4 text-red-600 accent-red-600" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.vipOnly')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border hover:border-red-300 transition">
            <input type="checkbox" className="w-4 h-4 text-red-600 accent-red-600" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">{t('search.verifiedOnly')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border hover:border-red-300 transition">
            <input type="checkbox" className="w-4 h-4 text-red-600 accent-red-600" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">New</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-white p-2 rounded border hover:border-red-300 transition">
            <input type="checkbox" className="w-4 h-4 text-red-600 accent-red-600" />
            <span className="text-xs sm:text-sm text-gray-700 font-medium">Online</span>
          </label>
        </div>

        {/* Search Button */}
        <button className="w-full bg-red-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 text-sm sm:text-base">
          <Search size={18} className="sm:w-5 sm:h-5" />
          {t('search.searchButton')}
        </button>

        {/* Advanced Search Link */}
        <button className="w-full text-red-600 text-xs sm:text-sm hover:underline">
          {t('search.advancedSearch')}
        </button>
      </div>
    </div>
  );
}
