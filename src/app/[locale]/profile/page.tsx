'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Link } from '@/i18n/routing';
import { User, Mail, Phone, MapPin, Edit2, Save, X, Globe, Instagram, MessageCircle, Twitter, Facebook, Calendar, Ruler, Weight, Heart, Languages as LanguagesIcon, DollarSign, Star, Crown } from 'lucide-react';
import { locations } from '@/data/locations';
import { services as allServices } from '@/data/services';
import type { RegisterFormData } from '@/types/auth';

interface UserProfile extends Omit<RegisterFormData, 'password' | 'confirmPassword' | 'incallRates' | 'outcallRates'> {
  id: string;
  email: string;
  emailVerified: boolean;
  role: 'user' | 'escort' | 'admin';
  isVip: boolean;
  isTop: boolean;
  isVipElite: boolean;
  createdAt: string;
  rates?: {
    incall?: {
      thirtyMin?: string;
      oneHour?: string;
      twoHours?: string;
      threeHours?: string;
      sixHours?: string;
      twelveHours?: string;
      twentyFourHours?: string;
    };
    outcall?: {
      thirtyMin?: string;
      oneHour?: string;
      twoHours?: string;
      threeHours?: string;
      sixHours?: string;
      twelveHours?: string;
      twentyFourHours?: string;
    };
  };
}

export default function ProfilePage() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        router.push('/login');
        return;
      }
      const data = await response.json();
      setProfile(data.user);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const cityName = locations.find(l => l.id === profile.city)?.name[locale as 'en' | 'ka' | 'ru'];
  const districtName = locations.find(l => l.id === profile.city)?.districts.find(d => d.id === profile.district)?.name[locale as 'en' | 'ka' | 'ru'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-8">
      <div className="max-w-6xl mx-auto px-4">

        {/* Premium Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-6 border border-gray-200">
          <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-8 py-12">
            {/* Subscription Badges */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4 flex flex-nowrap gap-1 md:gap-2 overflow-x-auto max-w-[calc(100%-1rem)] md:max-w-none scrollbar-hide">
              {/* Verified Badge */}
              <div className={`px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 md:gap-1.5 shadow-lg ${
                profile.emailVerified 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gray-400 opacity-50'
              }`}>
                <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-bold text-[10px] md:text-xs">VERIFIED</span>
              </div>
              
              {/* VIP Elite Badge */}
              <div className={`px-2 py-1 md:px-4 md:py-2 rounded-full flex items-center gap-1 md:gap-2 shadow-lg ${
                profile.isVipElite 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                  : 'bg-gray-400 opacity-50'
              }`}>
                <Crown size={14} className="text-white md:w-[18px] md:h-[18px]" />
                <span className="text-white font-bold text-[10px] md:text-sm">VIP ELITE</span>
              </div>
              
              {/* VIP Badge */}
              <div className={`px-2 py-1 md:px-4 md:py-2 rounded-full flex items-center gap-1 md:gap-2 shadow-lg ${
                profile.isVip 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gray-400 opacity-50'
              }`}>
                <Star size={14} className="text-white md:w-[18px] md:h-[18px]" />
                <span className="text-white font-bold text-[10px] md:text-sm">VIP</span>
              </div>
              
              {/* TOP Badge */}
              <div className={`px-2 py-1 md:px-4 md:py-2 rounded-full flex items-center gap-1 md:gap-2 shadow-lg ${
                profile.isTop 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500' 
                  : 'bg-gray-400 opacity-50'
              }`}>
                <Star size={14} className="text-white md:w-[18px] md:h-[18px]" />
                <span className="text-white font-bold text-[10px] md:text-sm">TOP</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/30">
                <User size={48} className="text-purple-600 md:w-16 md:h-16" />
              </div>
              <div className="text-white flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-2">
                  <h1 className="text-2xl md:text-4xl font-bold">{profile.name || t('common.user')}</h1>
                  <span className="px-3 py-1 bg-amber-500/20 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold capitalize border border-amber-400/30">
                    {profile.role}
                  </span>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-gray-300 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="md:w-5 md:h-5" />
                    <span className="break-all">{profile.email}</span>
                  </div>
                  {cityName && (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="md:w-5 md:h-5" />
                      <span>{cityName}{districtName && `, ${districtName}`}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.push('/profile/edit')}
                className="w-full md:w-auto bg-white text-purple-600 px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2 shadow-lg text-sm md:text-base"
              >
                <Edit2 size={18} className="md:w-5 md:h-5" />
                {t('common.editProfile')}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Verification Alert */}
        {!profile.emailVerified && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 mb-6 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {t('common.accountNotVerified')}
                </h3>
                <p className="text-amber-800 mb-4">
                  {t('common.accountNotVerifiedDesc')}
                </p>
                <Link
                  href="/profile/verify"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-md"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('common.getVerifiedNow')}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Media Upload - Images and Video in Single Row - FULL WIDTH */}
        <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Images Section */}
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Public Gallery (10 max)
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">Upload up to 10 images</p>
              <div className="w-full h-32 md:h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-purple-400 transition cursor-pointer mb-3">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs md:text-sm text-gray-500">No images uploaded</p>
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition text-xs md:text-sm">
                Upload Images
              </button>
            </div>

            {/* Video Section */}
            <div className="flex-1">
              <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Public Video (1 max)
              </h3>
              <p className="text-xs md:text-sm text-gray-600 mb-3">Upload 1 video</p>
              <div className="w-full h-32 md:h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-400 transition cursor-pointer mb-3">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                <p className="text-xs md:text-sm text-gray-500">No video uploaded</p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition text-xs md:text-sm">
                Upload Video
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column - Personal Info */}
          <div className="lg:col-span-2 space-y-6">

            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Heart size={24} className="text-amber-500" />
                {t('auth.aboutYou')}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.aboutYou}</p>
            </div>

            {/* Physical Attributes */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Ruler size={24} className="text-amber-500" />
                {t('auth.personalInfo')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.gender')}</p>
                  <p className="font-semibold text-gray-900 capitalize">{profile.gender}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.dateOfBirth')}</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(profile.dateOfBirth).toLocaleDateString(locale, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.ethnicity')}</p>
                  <p className="font-semibold text-gray-900 capitalize">{profile.ethnicity}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.height')}</p>
                  <p className="font-semibold text-gray-900">{profile.height} cm</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">{t('auth.weight')}</p>
                  <p className="font-semibold text-gray-900">{profile.weight} kg</p>
                </div>
                {profile.hairColor && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('auth.hairColor')}</p>
                    <p className="font-semibold text-gray-900 capitalize">{profile.hairColor.replace('_', ' ')}</p>
                  </div>
                )}
                {profile.bustSize && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('auth.bustSize')}</p>
                    <p className="font-semibold text-gray-900 uppercase">{profile.bustSize.replace('_', ' ')}</p>
                  </div>
                )}
                {profile.build && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">{t('auth.build')}</p>
                    <p className="font-semibold text-gray-900 capitalize">{profile.build}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Services */}
            {profile.services && profile.services.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('auth.services')}</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map((service) => (
                    <span
                      key={service}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {t(`services.${service}`)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {/* Rates */}
            {(profile.incallAvailable || profile.outcallAvailable) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign size={24} className="text-green-600" />
                  {t('auth.rates')}
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">{t('auth.duration')}</th>
                        {profile.incallAvailable && <th className="text-center py-3 px-4 font-semibold text-purple-700">{t('auth.incall')}</th>}
                        {profile.outcallAvailable && <th className="text-center py-3 px-4 font-semibold text-blue-700">{t('auth.outcall')}</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {(['thirtyMin', 'oneHour', 'twoHours', 'threeHours', 'sixHours', 'twelveHours', 'twentyFourHours'] as const).map((duration) => {
                        const incallPrice = profile.rates?.incall?.[duration];
                        const outcallPrice = profile.rates?.outcall?.[duration];
                        const hasPrice = (incallPrice && incallPrice !== '0') || (outcallPrice && outcallPrice !== '0');

                        if (!hasPrice) return null;

                        return (
                          <tr key={duration} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-900 font-medium">{t(`auth.${duration}`)}</td>
                            {profile.incallAvailable && (
                              <td className="py-3 px-4 text-center">
                                {incallPrice && incallPrice !== '0' ? (
                                  <span className="font-bold text-purple-900">{incallPrice} {profile.currency}</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            )}
                            {profile.outcallAvailable && (
                              <td className="py-3 px-4 text-center">
                                {outcallPrice && outcallPrice !== '0' ? (
                                  <span className="font-bold text-blue-900">{outcallPrice} {profile.currency}</span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact & Rates */}
          <div className="space-y-6">

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && profile.languages.some(l => l.name) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <LanguagesIcon size={20} className="text-purple-600" />
                  {t('auth.languagesSpoken')}
                </h2>
                <div className="space-y-2">
                  {profile.languages.filter(l => l.name).map((lang, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-3">
                      <span className="font-semibold text-gray-900">{lang.name}</span>
                      <span className="px-3 py-1 bg-purple-200 text-purple-700 rounded-full text-xs font-medium capitalize">
                        {t(`auth.${lang.level}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {t('common.contactInfo')}
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone size={20} className="text-purple-600" />
                  <span className="text-gray-900">{profile.phone}</span>
                </div>
                {profile.whatsappAvailable && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                    <MessageCircle size={20} className="text-green-600" />
                    <span className="text-gray-900">WhatsApp</span>
                  </div>
                )}
                {profile.viberAvailable && (
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-xl">
                    <MessageCircle size={20} className="text-purple-600" />
                    <span className="text-gray-900">Viber</span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Media */}
            {(profile.website || profile.instagram || profile.snapchat || profile.twitter || profile.facebook) && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t('auth.socialMedia')}</h2>
                <div className="space-y-3">
                  {profile.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                      <Globe size={20} className="text-blue-600" />
                      <span className="text-gray-900 truncate">{profile.website}</span>
                    </a>
                  )}
                  {profile.instagram && (
                    <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition">
                      <Instagram size={20} className="text-pink-600" />
                      <span className="text-gray-900">{profile.instagram}</span>
                    </a>
                  )}
                  {profile.snapchat && (
                    <a href={`https://snapchat.com/add/${profile.snapchat}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition">
                      <MessageCircle size={20} className="text-yellow-500" />
                      <span className="text-gray-900">{profile.snapchat}</span>
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={`https://twitter.com/${profile.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-sky-50 rounded-xl hover:bg-sky-100 transition">
                      <Twitter size={20} className="text-sky-600" />
                      <span className="text-gray-900">{profile.twitter}</span>
                    </a>
                  )}
                  {profile.facebook && (
                    <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition">
                      <Facebook size={20} className="text-blue-700" />
                      <span className="text-gray-900 truncate">Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Member Since */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-amber-500" />
                {t('common.memberSince')}
              </h2>
              <p className="text-gray-700 font-semibold">
                {new Date(profile.createdAt).toLocaleDateString(locale, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
