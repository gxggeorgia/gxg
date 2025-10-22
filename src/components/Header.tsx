'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { Search, Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-black text-white w-full sticky top-0 z-50">
      <div className="w-full px-3 sm:px-4 md:px-8 lg:px-12">
        <div className="flex items-center justify-between py-2 sm:py-3 gap-2">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl font-bold whitespace-nowrap">
            <span className="text-red-600">X</span>GEORGIA.ME
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link href="/" className="hover:text-red-500 transition text-sm">
              {t('common.home')}
            </Link>
            <Link href="/escorts" className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition text-sm">
              Escorts
            </Link>
            <Link href="/contact" className="hover:text-red-500 transition text-sm">
              {t('common.contactUs')}
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Language Dropdown */}
            <select 
              value={locale}
              className="bg-red-600 text-white px-2 sm:px-3 py-1 rounded text-xs sm:text-sm cursor-pointer"
              onChange={(e) => {
                const newLocale = e.target.value as 'en' | 'ka' | 'ru';
                router.replace(pathname, { locale: newLocale });
              }}
            >
              <option value="en">English</option>
              <option value="ka">ქართული</option>
              <option value="ru">Русский</option>
            </select>

            {/* Icons - Always visible */}
            <button className="hover:text-red-500 transition p-1">
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button className="hover:text-red-500 transition p-1">
              <Mail size={18} className="sm:w-5 sm:h-5" />
            </button>

            {/* Auth Buttons - Hidden on mobile */}
            <button className="hidden md:block bg-red-600 px-3 md:px-4 py-1 rounded text-xs sm:text-sm hover:bg-red-700 transition">
              {t('common.register')}
            </button>
            <button className="hidden md:block bg-red-600 px-3 md:px-4 py-1 rounded text-xs sm:text-sm hover:bg-red-700 transition">
              {t('common.login')}
            </button>

            {/* Hamburger Menu - Mobile only */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-red-600 rounded transition"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <nav className="flex flex-col gap-3">
              <Link 
                href="/" 
                className="px-4 py-2 hover:bg-red-600 rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <Link 
                href="/escorts" 
                className="px-4 py-2 hover:bg-red-600 rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Escorts
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 hover:bg-red-600 rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.contactUs')}
              </Link>
              
              <div className="border-t border-gray-700 my-2"></div>
              
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition font-semibold">
                {t('common.register')}
              </button>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition font-semibold">
                {t('common.login')}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
