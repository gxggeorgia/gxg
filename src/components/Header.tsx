'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { Search, Mail, Menu, X, User, LogOut, ChevronDown, Heart, Home, MessageCircle, Headset } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import LoginModal from './auth/LoginModal';
import RegistrationInfoModal from './auth/RegistrationInfoModal';
import QuickSearchModal from './QuickSearchModal';
import { getCachedUser, setCachedUser, clearCachedUser } from '@/lib/userCache';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'escort' | 'admin';

  publicExpiry: string | null;
}

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegistrationInfoModalOpen, setIsRegistrationInfoModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const loginDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch current user on mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  // Note: Modal now handles its own backdrop clicks, no need for outside click detection

  const fetchCurrentUser = async () => {
    // Try to get from cache first
    const cachedUser = getCachedUser();
    if (cachedUser) {
      setUser(cachedUser);
      return;
    }

    // If not in cache, fetch from API
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        // Cache the user data
        setCachedUser(data.user);
      }
    } catch (error) {
      // User not logged in
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsUserMenuOpen(false);
      // Clear cached user data
      clearCachedUser();
      // Redirect to home page
      router.push('/', { locale });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      <header className="bg-black text-white w-full   z-50 shadow-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile Header (2 Rows) */}
          <div className="md:hidden flex flex-col pb-2 gap-2">
            {/* Row 1: Logo */}
            <div className="flex justify-center border-b border-slate-800/50">
              <Link href="/" className="flex items-center">
                <img
                  src="/assets/logo-bgless.png"
                  alt={process.env.NEXT_PUBLIC_SITE_NAME || 'EG'}
                  className="h-36 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Row 2: Telegram, Language, Search */}
            <div className="flex items-center justify-between gap-2 px-1">
              <a
                href={process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md text-xs font-medium flex-1 justify-center h-[32px]"
              >
                <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
                <span className="truncate">{t('common.telegram')}</span>
              </a>

              <div className="relative flex-1 h-[32px]">
                <label htmlFor="language-switcher-mobile" className="sr-only">Select Language</label>
                <select
                  id="language-switcher-mobile"
                  value={locale}
                  className="w-full h-full bg-slate-700/50 text-white pl-2 pr-6 py-1.5 rounded text-xs font-medium border border-slate-600 appearance-none text-center"
                  onChange={(e) => {
                    const newLocale = e.target.value as 'en' | 'ka' | 'ru';
                    router.replace(pathname, { locale: newLocale });
                  }}
                >
                  <option value="en">English</option>
                  <option value="ka">ქართული</option>
                  <option value="ru">Русский</option>
                </select>
                <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none text-gray-400">
                  <ChevronDown size={12} />
                </div>
              </div>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 bg-slate-700/50 px-2 py-1.5 rounded text-xs font-medium border border-slate-600 h-[32px] flex-1 justify-center"
              >
                <Search size={14} className="shrink-0" />
                <span>Search</span>
              </button>
            </div>

            {/* Row 3: Menu, Login/User */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded text-sm font-medium flex-1 justify-center"
              >
                {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
                <span>{t('common.menu')}</span>
              </button>

              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded text-sm font-medium flex-1 justify-center truncate"
                >
                  <User size={16} />
                  <span className="truncate">{user.name || 'Profile'}</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 rounded text-sm font-medium flex-1 justify-center"
                  >
                    <span>{t('common.login')}</span>
                  </button>
                  <button
                    onClick={() => setIsRegistrationInfoModalOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded text-sm font-medium flex-1 justify-center"
                  >
                    <span>{t('common.register')}</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Desktop Header (Hidden on Mobile) */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Logo and Telegram */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center">
                <img
                  src="/assets/logo-bgless.png"
                  alt={process.env.NEXT_PUBLIC_SITE_NAME || 'EG'}
                  className="h-16 w-auto object-contain"
                />
              </Link>
              <a
                href={process.env.NEXT_PUBLIC_TELEGRAM_LINK || 'https://t.me'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg transition text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
                <span>{t('common.telegram')}</span>
              </a>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className={`flex items-center gap-2 text-base transition-colors text-white hover:text-gray-300 ${pathname === '/' ? 'font-semibold' : ''}`}
              >
                <Home size={18} />
                {t('common.home')}
              </Link>
              <Link
                href="/favorites"
                className={`flex items-center gap-2 text-base transition-colors text-white hover:text-gray-300 ${pathname === '/favorites' ? 'font-semibold' : ''}`}
              >
                <Heart size={18} />
                {t('common.favorites')}
              </Link>
              <Link
                href="/support"
                className={`flex items-center gap-2 text-base transition-colors text-white hover:text-gray-300 ${pathname === '/support' ? 'font-semibold' : ''}`}
              >
                <Headset size={18} />
                {t('common.support')}
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              <label htmlFor="language-switcher-desktop" className="sr-only">Select Language</label>
              <select
                id="language-switcher-desktop"
                value={locale}
                className="bg-slate-700/50 text-white px-4 py-2 rounded-lg text-sm border border-slate-600 hover:bg-slate-600 transition shadow-md cursor-pointer"
                onChange={(e) => {
                  const newLocale = e.target.value as 'en' | 'ka' | 'ru';
                  router.replace(pathname, { locale: newLocale });
                }}
              >
                <option value="en" className="bg-slate-800 text-white">English</option>
                <option value="ka" className="bg-slate-800 text-white">ქართული</option>
                <option value="ru" className="bg-slate-800 text-white">Русский</option>
              </select>

              <button
                onClick={() => setIsSearchOpen(true)}
                className="hover:text-red-400 transition p-2 hover:bg-slate-700/50 rounded"
                aria-label="Open quick search"
              >
                <Search size={20} />
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm transition border border-slate-600 shadow-md"
                  >
                    <User size={16} />
                    <span className="max-w-[100px] truncate">{user.name || user.email}</span>
                    <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                      <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-blue-50 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-900">{user.name || 'User'}</p>
                          <span className="px-2 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full capitalize">
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 transition"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User size={16} />
                          My Profile
                        </Link>
                        {(!user.publicExpiry || new Date(user.publicExpiry) <= new Date()) && (
                          <Link
                            href="/profile/verify"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition font-medium"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verify Profile
                          </Link>
                        )}
                        {user.role === 'admin' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 hover:text-red-800 transition font-medium"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="border-t border-gray-200">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium flex items-center gap-2 transition"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setIsRegistrationInfoModalOpen(true)}
                    className="flex items-center bg-red-600 px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition font-medium shadow-md text-white"
                  >
                    {t('common.register')}
                  </button>

                  <div className="relative" ref={loginDropdownRef}>
                    <button
                      onClick={() => setIsLoginModalOpen(!isLoginModalOpen)}
                      className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg text-sm hover:bg-slate-600 transition border border-slate-600 shadow-md"
                    >
                      {t('common.login')}
                      <ChevronDown size={16} className={`transition-transform ${isLoginModalOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-700 py-4">
              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  className="px-4 py-2 hover:bg-slate-700 rounded transition flex items-center gap-2 text-white hover:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home size={18} />
                  {t('common.home')}
                </Link>
                <Link
                  href="/favorites"
                  className="px-4 py-2 hover:bg-slate-700 rounded transition flex items-center gap-2 text-white hover:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={18} />
                  {t('common.favorites')}
                </Link>
                <Link
                  href="/support"
                  className="px-4 py-2 hover:bg-slate-700 rounded transition flex items-center gap-2 text-white hover:text-gray-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Headset size={18} />
                  {t('common.support')}
                </Link>
                <div className="border-t border-gray-700 my-2"></div>

                {user ? (
                  <>
                    <div className="px-4 py-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white">{user.name || 'User'}</p>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-red-600 text-white rounded-full capitalize">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-300">{user.email}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="px-4 py-2 hover:bg-slate-700 rounded transition flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      My Profile
                    </Link>
                    {(!user.publicExpiry || new Date(user.publicExpiry) <= new Date()) && (
                      <Link
                        href="/profile/verify"
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded transition flex items-center gap-2 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verify Profile
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition flex items-center gap-2 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition font-semibold flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsRegistrationInfoModalOpen(true);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition font-semibold block text-center w-full text-white"
                    >
                      {t('common.register')}
                    </button>
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition font-semibold"
                    >
                      {t('common.login')}
                    </button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <QuickSearchModal open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegistrationInfoModalOpen(true);
        }}
      />

      <RegistrationInfoModal
        isOpen={isRegistrationInfoModalOpen}
        onClose={() => setIsRegistrationInfoModalOpen(false)}
      />
    </>
  );
}
