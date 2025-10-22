'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { Search, Mail, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import LoginModal from './auth/LoginModal';
import { getCachedUser, setCachedUser, clearCachedUser } from '@/lib/userCache';

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'escort' | 'admin';
  status: 'private' | 'public' | 'suspended' | 'pending';
}

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white w-full sticky top-0 z-50 shadow-lg border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-lg sm:text-xl font-bold whitespace-nowrap bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-blue-300 transition">
            {process.env.NEXT_PUBLIC_SITE_NAME || 'EG'}
          </Link>

          {/* Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link 
              href="/" 
              className={`text-base hover:text-purple-400 transition-colors ${pathname === '/' ? 'text-purple-400 font-semibold' : ''}`}
            >
              {t('common.home')}
            </Link>
            <Link 
              href="/escorts" 
              className={`text-base hover:text-purple-400 transition-colors ${pathname === '/escorts' ? 'text-purple-400 font-semibold' : ''}`}
            >
              Escorts
            </Link>
            <Link 
              href="/contact" 
              className={`text-base hover:text-purple-400 transition-colors ${pathname === '/contact' ? 'text-purple-400 font-semibold' : ''}`}
            >
              {t('common.contactUs')}
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Dropdown */}
            <select
              value={locale}
              className="bg-slate-700/50 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded text-xs sm:text-sm border border-slate-600 hover:bg-slate-700 transition"
              onChange={(e) => {
                const newLocale = e.target.value as 'en' | 'ka' | 'ru';
                router.replace(pathname, { locale: newLocale });
              }}
            >
              <option value="en">English</option>
              <option value="ka">ქართული</option>
              <option value="ru">Русский</option>
            </select>

            <button className="hover:text-purple-400 transition p-1.5 sm:p-2 hover:bg-slate-700/50 rounded">
              <Search size={18} className="sm:w-5 sm:h-5" />
            </button>
            <button className="hidden md:block hover:text-purple-400 transition p-2 hover:bg-slate-700/50 rounded">
              <Mail size={20} />
            </button>

            {/* Auth Buttons / User Menu - Hidden on mobile */}
            {user ? (
              <div className="hidden md:block relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-700 px-3 py-2 rounded text-sm transition border border-slate-600"
                >
                  <User size={16} />
                  <span className="max-w-[100px] truncate">{user.name || user.email}</span>
                  <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-900">{user.name || 'User'}</p>
                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-600 text-white rounded-full capitalize">
                          {user.role}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User size={16} />
                        My Profile
                      </Link>
                      {user.status === 'pending' && (
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
                        className="w-full text-left px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 font-medium flex items-center gap-2 transition"
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
                <Link
                  href="/register"
                  className="hidden md:flex items-center bg-purple-600 px-4 py-2 rounded text-sm hover:bg-purple-700 transition font-medium"
                >
                  {t('common.register')}
                </Link>
                
                {/* Login Dropdown */}
                <div className="hidden md:block relative" ref={loginDropdownRef}>
                  <button
                    onClick={() => setIsLoginModalOpen(!isLoginModalOpen)}
                    className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded text-sm hover:bg-slate-700 transition border border-slate-600"
                  >
                    {t('common.login')}
                    <ChevronDown size={16} className={`transition-transform ${isLoginModalOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </>
            )}

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
                className="px-4 py-2 hover:bg-slate-700 rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <Link 
                href="/escorts" 
                className="px-4 py-2 hover:bg-slate-700 rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                Escorts
              </Link>
              <Link 
                href="/contact" 
                className="px-4 py-2 hover:bg-slate-700 rounded transition"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('common.contactUs')}
              </Link>
              <button className="px-4 py-2 hover:bg-slate-700 rounded transition flex items-center gap-2">
                <Mail size={18} />
                Messages
              </button>
              <div className="border-t border-gray-700 my-2"></div>
              
              {user ? (
                <>
                  <div className="px-4 py-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-white">{user.name || 'User'}</p>
                      <span className="px-2 py-0.5 text-xs font-semibold bg-purple-600 text-white rounded-full capitalize">
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
                  {user.status === 'pending' && (
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
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded transition font-semibold block text-center"
                  >
                    {t('common.register')}
                  </Link>
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
    
    {/* Login Modal - Works for both mobile and desktop */}
    {isLoginModalOpen && (
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          fetchCurrentUser();
          setIsLoginModalOpen(false);
        }}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          router.push('/register');
        }}
      />
    )}
    </>
  );
}
