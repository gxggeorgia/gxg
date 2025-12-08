'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, Link } from '@/i18n/routing';
import { Globe, Instagram, MessageCircle, Twitter, Facebook, Phone, X, Eye, EyeOff } from 'lucide-react';
import Captcha from '../Captcha';
import Image from 'next/image';
import type { RegisterFormData } from '@/types/auth';
import { locations } from '@/data/locations';
import { services } from '@/data/services';
import { setCachedUser } from '@/lib/userCache';

const FORM_STORAGE_KEY = 'registration_form_draft';

interface RegisterFormProps {
  onSuccess?: () => void;
  isEditMode?: boolean;
}

export default function RegisterForm({ onSuccess, isEditMode = false }: RegisterFormProps) {
  const t = useTranslations();
  const locale = useLocale() as 'en' | 'ka' | 'ru';
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
    whatsappAvailable: false,
    viberAvailable: false,
    website: '',
    instagram: '',
    snapchat: '',
    twitter: '',
    facebook: '',
    city: '',
    district: '',
    gender: 'female',
    dateOfBirth: '',
    ethnicity: 'georgian',
    height: '',
    weight: '',
    aboutYou: '',
    hairColor: undefined,
    bustSize: undefined,
    build: undefined,
    incallAvailable: true,
    outcallAvailable: true,
    currency: 'GEL',
    incallRates: {
      thirtyMin: '',
      oneHour: '',
      twoHours: '',
      threeHours: '',
      sixHours: '',
      twelveHours: '',
      twentyFourHours: '',
    },
    outcallRates: {
      thirtyMin: '',
      oneHour: '',
      twoHours: '',
      threeHours: '',
      sixHours: '',
      twelveHours: '',
      twentyFourHours: '',
    },
    languages: [{ name: '', level: '' }, { name: '', level: '' }, { name: '', level: '' }],
    services: [],

  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);

  const selectedCityDistricts = useMemo(() => {
    const city = locations.find(loc => loc.id === formData.city);
    return city?.districts || [];
  }, [formData.city]);

  // Load profile data in edit mode or form data from localStorage
  useEffect(() => {
    if (isEditMode) {
      // Load existing profile
      fetch('/api/profile')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            const user = data.user;

            // Convert null values to empty strings or undefined
            const cleanedData = Object.entries(user).reduce((acc, [key, value]) => {
              if (value === null) {
                // Keep undefined for optional enum fields
                if (key === 'hairColor' || key === 'bustSize' || key === 'build') {
                  acc[key] = undefined;
                } else {
                  acc[key] = '';
                }
              } else {
                acc[key] = value;
              }
              return acc;
            }, {} as any);

            setFormData(prev => ({
              ...prev,
              ...cleanedData,
              password: '',
              confirmPassword: '',
              // Extract rates from nested structure
              incallRates: user.rates?.incall || prev.incallRates,
              outcallRates: user.rates?.outcall || prev.outcallRates,
            }));
          }
        })
        .catch(err => console.error('Failed to load profile:', err));
    } else {
      // Load from localStorage for register
      const savedData = localStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setFormData(prev => ({ ...prev, ...parsed }));
        } catch (error) {
          console.error('Failed to load saved form data:', error);
        }
      }
    }
  }, [isEditMode]);

  // Auto-save form data to localStorage (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        // Don't save password to localStorage for security
        const { password, confirmPassword, ...dataToSave } = formData;
        localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Error saving form data to localStorage:', error);
      }
    }, 1000); // Save after 1 second of inactivity

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Scroll to error when it appears
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData(prev => {
      // If city changes, reset district
      if (name === 'city') {
        return {
          ...prev,
          city: value,
          district: ''
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted!', { acceptedTerms, formData });
    setIsLoading(true);
    setError('');

    // Skip terms validation in edit mode
    if (!isEditMode && !acceptedTerms) {
      setError(t('auth.pleaseAcceptTerms'));
      setIsLoading(false);
      return;
    }

    // Validate required fields (skip password fields in edit mode)
    const requiredFields = isEditMode ? [
      { field: 'phone', label: t('auth.phone') },
      { field: 'city', label: t('auth.city') },
      { field: 'gender', label: t('auth.gender') },
      { field: 'dateOfBirth', label: t('auth.dateOfBirth') },
      { field: 'ethnicity', label: t('auth.ethnicity') },
      { field: 'height', label: t('auth.height') },
      { field: 'weight', label: t('auth.weight') },
      { field: 'aboutYou', label: t('auth.aboutYou') },
    ] : [
      { field: 'email', label: t('auth.email') },
      { field: 'password', label: t('auth.password') },
      { field: 'confirmPassword', label: t('auth.confirmPassword') },
      { field: 'phone', label: t('auth.phone') },
      { field: 'city', label: t('auth.city') },
      { field: 'gender', label: t('auth.gender') },
      { field: 'dateOfBirth', label: t('auth.dateOfBirth') },
      { field: 'ethnicity', label: t('auth.ethnicity') },
      { field: 'height', label: t('auth.height') },
      { field: 'weight', label: t('auth.weight') },
      { field: 'aboutYou', label: t('auth.aboutYou') },
    ];

    const missingFields = requiredFields.filter(({ field }) => !formData[field as keyof RegisterFormData]);

    if (missingFields.length > 0) {
      const fieldNames = missingFields.map(f => f.label).join(', ');
      setError(`${t('auth.pleaseProvide')}: ${fieldNames}`);
      setIsLoading(false);
      return;
    }

    // Validate password match (skip in edit mode)
    if (!isEditMode && formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      setIsLoading(false);
      return;
    }

    // Validate services
    if (!formData.services || formData.services.length === 0) {
      setError(t('auth.pleaseSelectServices'));
      setIsLoading(false);
      return;
    }

    // Validate rates if incall/outcall is available
    if (formData.incallAvailable || formData.outcallAvailable) {
      const hasIncallRates = formData.incallAvailable && formData.incallRates && Object.values(formData.incallRates).some(rate => rate && rate.trim() !== '');
      const hasOutcallRates = formData.outcallAvailable && formData.outcallRates && Object.values(formData.outcallRates).some(rate => rate && rate.trim() !== '');

      if (formData.incallAvailable && !hasIncallRates) {
        setError(t('auth.pleaseProvideIncallRates'));
        setIsLoading(false);
        return;
      }

      if (formData.outcallAvailable && !hasOutcallRates) {
        setError(t('auth.pleaseProvideOutcallRates'));
        setIsLoading(false);
        return;
      }
    }

    try {
      const apiUrl = isEditMode ? '/api/profile/update' : '/api/auth/register';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Auth fields
          email: formData.email,
          password: formData.password,

          // Basic Info
          phone: formData.phone,
          name: formData.name || undefined,
          whatsappAvailable: formData.whatsappAvailable || false,
          viberAvailable: formData.viberAvailable || false,

          // Location
          city: formData.city,
          district: formData.district || undefined,

          // Personal Info (required)
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          ethnicity: formData.ethnicity,
          height: formData.height,
          weight: formData.weight,
          aboutYou: formData.aboutYou,

          // Optional Personal Info
          hairColor: formData.hairColor || undefined,
          bustSize: formData.bustSize || undefined,
          build: formData.build || undefined,

          // Availability & Rates
          incallAvailable: formData.incallAvailable,
          outcallAvailable: formData.outcallAvailable,
          currency: formData.currency,
          incallRates: formData.incallRates,
          outcallRates: formData.outcallRates,

          // Services
          services: formData.services || [],

          // Languages
          languages: (formData.languages || []).filter(l => l.name && l.level),

          // Social Media
          website: formData.website || undefined,
          instagram: formData.instagram || undefined,
          snapchat: formData.snapchat || undefined,
          twitter: formData.twitter || undefined,
          facebook: formData.facebook || undefined,
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t('auth.registrationFailed'));
        setIsLoading(false);
        return;
      }

      // Success - store token in cookie (already set by API, but also store in document.cookie for client access)
      if (data.token) {
        document.cookie = `auth_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }

      // Store user data in cache if available
      if (data.user) {
        setCachedUser(data.user);
      }

      // Clear form data from localStorage
      try {
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (error) {
      }
      if (isEditMode) {
        // Redirect to profile page after update
        router.push('/profile');
      } else {
        // Clear form data from localStorage on successful registration
        localStorage.removeItem(FORM_STORAGE_KEY);

        // Call onSuccess callback if provided
        onSuccess?.();

        // Small delay to ensure cookie is set, then redirect and reload
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
    } catch (err) {
      setError(t('auth.errorOccurred'));
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Error Toast - Fixed at top of page */}
      {error && (
        <div ref={errorRef} className="fixed top-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:right-auto z-50 sm:w-full sm:max-w-md bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg shadow-2xl animate-in slide-in-from-top">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <p className="font-semibold text-sm">{t('auth.errorTitle')}</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError('')}
              className="text-red-700 hover:text-red-900 transition shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-white pb-32">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-3">
              {isEditMode ? t('common.editProfile') : t('common.register')}
            </h1>
            <p className="text-slate-300 text-lg">
              {isEditMode ? 'Update your profile information and preferences' : 'Create your professional account to get started'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white">
          <div className="max-w-5xl mx-auto px-6 py-6 space-y-6">

            {/* Account Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-red-600 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{t('auth.accountInfo')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.email')} {!isEditMode && t('auth.required')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required={!isEditMode}
                    disabled={isLoading || isEditMode}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                  />
                </div>

                {/* Password */}
                {!isEditMode && (
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.password')} {t('auth.required')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Confirm Password */}
                {!isEditMode && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('auth.confirmPassword')} {t('auth.required')}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="text-gray-500" />
                    {t('auth.phone')} {t('auth.required')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* WhatsApp Available */}
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="whatsappAvailable"
                    name="whatsappAvailable"
                    checked={formData.whatsappAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, whatsappAvailable: e.target.checked }))}
                    disabled={isLoading}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="whatsappAvailable" className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                    <MessageCircle size={16} className="text-green-600" />
                    {t('auth.whatsappAvailable')}
                  </label>
                </div>

                {/* Viber Available */}
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="viberAvailable"
                    name="viberAvailable"
                    checked={formData.viberAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, viberAvailable: e.target.checked }))}
                    disabled={isLoading}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="viberAvailable" className="ml-2 text-sm text-gray-700 flex items-center gap-1">
                    <Image src="/icons/viber_logo-170x170.png" alt="Viber" width={16} height={16} />
                    {t('auth.viberAvailable')}
                  </label>
                </div>
              </div>
            </div>


            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-red-600 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{t('auth.personalInfo')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.gender')} {t('auth.required')}
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="transsexual">Transsexual</option>
                  </select>
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.dateOfBirth')} {t('auth.required')}
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* Ethnicity */}
                <div>
                  <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.ethnicity')} {t('auth.required')}
                  </label>
                  <select
                    id="ethnicity"
                    name="ethnicity"
                    value={formData.ethnicity}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  >
                    <option value="georgian">Georgian</option>
                    <option value="russian">Russian</option>
                    <option value="black">Black</option>
                    <option value="turk">Turkish</option>
                    <option value="armenian">Armenian</option>
                    <option value="azerbaijan">Azerbaijani</option>
                    <option value="kazakh">Kazakh</option>
                    <option value="greek">Greek</option>
                    <option value="ukraine">Ukrainian</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Height */}
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.height')} {t('auth.required')}
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    min="100"
                    max="250"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.weight')} {t('auth.required')}
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    min="30"
                    max="200"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* Hair Color */}
                <div>
                  <label htmlFor="hairColor" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.hairColor')}
                  </label>
                  <select
                    id="hairColor"
                    name="hairColor"
                    value={formData.hairColor || ''}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  >
                    <option value="">{t('auth.select')}</option>
                    <option value="black">Black</option>
                    <option value="blonde">Blonde</option>
                    <option value="brown">Brown</option>
                    <option value="brunette">Brunette</option>
                    <option value="chestnut">Chestnut</option>
                    <option value="auburn">Auburn</option>
                    <option value="dark_blonde">Dark Blonde</option>
                    <option value="golden">Golden</option>
                    <option value="red">Red</option>
                    <option value="grey">Grey</option>
                    <option value="silver">Silver</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Bust Size */}
                <div>
                  <label htmlFor="bustSize" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.bustSize')}
                  </label>
                  <select
                    id="bustSize"
                    name="bustSize"
                    value={formData.bustSize || ''}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  >
                    <option value="">{t('auth.select')}</option>
                    <option value="very_small">Very Small</option>
                    <option value="small_a">Small (A)</option>
                    <option value="medium_b">Medium (B)</option>
                    <option value="large_c">Large (C)</option>
                    <option value="very_large_d">Very Large (D)</option>
                    <option value="enormous_e_plus">Enormous (E+)</option>
                  </select>
                </div>

                {/* Build */}
                <div>
                  <label htmlFor="build" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.build')}
                  </label>
                  <select
                    id="build"
                    name="build"
                    value={formData.build || ''}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  >
                    <option value="">{t('auth.select')}</option>
                    <option value="skinny">Skinny</option>
                    <option value="slim">Slim</option>
                    <option value="regular">Regular</option>
                    <option value="sport">Sport</option>
                    <option value="fat">Fat</option>
                  </select>
                </div>
              </div>

              {/* About You */}
              <div>
                <label htmlFor="aboutYou" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.aboutYou')} {t('auth.required')}
                </label>
                <textarea
                  id="aboutYou"
                  name="aboutYou"
                  value={formData.aboutYou}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                  placeholder={t('auth.aboutYouPlaceholder')}
                />
              </div>
            </div>


            {/* Social Media Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-red-600 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{t('auth.socialMedia')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

                {/* Website */}
                <div>
                  <label htmlFor="website" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Globe size={16} className="text-blue-600" />
                    {t('auth.website')}
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="https://"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <label htmlFor="instagram" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Instagram size={16} className="text-pink-600" />
                    {t('auth.instagram')}
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="@username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* Snapchat */}
                <div>
                  <label htmlFor="snapchat" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <MessageCircle size={16} className="text-yellow-500" />
                    {t('auth.snapchat')}
                  </label>
                  <input
                    type="text"
                    id="snapchat"
                    name="snapchat"
                    value={formData.snapchat}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label htmlFor="twitter" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Twitter size={16} className="text-sky-500" />
                    {t('auth.twitter')}
                  </label>
                  <input
                    type="text"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="@username"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>

                {/* Facebook */}
                <div>
                  <label htmlFor="facebook" className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Facebook size={16} className="text-blue-700" />
                    {t('auth.facebook')}
                  </label>
                  <input
                    type="text"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="Profile URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-red-600 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{t('auth.location')}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.city')} {t('auth.required')}
                  </label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                  >
                    <option value="">{t('auth.selectCity')}</option>
                    {locations.map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name[locale]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.district')} {selectedCityDistricts.length > 0 && t('auth.required')}
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    disabled={isLoading || !formData.city || selectedCityDistricts.length === 0}
                    required={selectedCityDistricts.length > 0}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 text-gray-900"
                  >
                    <option value="">
                      {!formData.city
                        ? t('auth.pleaseSelectCityFirst')
                        : selectedCityDistricts.length === 0
                          ? t('auth.noDistricts')
                          : t('auth.selectDistrict')}
                    </option>
                    {selectedCityDistricts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name[locale]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-red-600 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{t('auth.languagesSpoken')}</h3>
              </div>
              <div className="space-y-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder={t('auth.language')}
                      value={formData.languages?.[index]?.name || ''}
                      onChange={(e) => {
                        const newLangs = [...(formData.languages || [])];
                        newLangs[index] = { ...newLangs[index], name: e.target.value };
                        setFormData(prev => ({ ...prev, languages: newLangs }));
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
                    />
                    <select
                      value={formData.languages?.[index]?.level || ''}
                      onChange={(e) => {
                        const newLangs = [...(formData.languages || [])];
                        newLangs[index] = { ...newLangs[index], level: e.target.value };
                        setFormData(prev => ({ ...prev, languages: newLangs }));
                      }}
                      className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
                    >
                      <option value="" className="text-gray-500">{t('auth.selectLevel')}</option>
                      <option value="minimal" className="text-gray-900">{t('auth.minimal')}</option>
                      <option value="conversational" className="text-gray-900">{t('auth.conversational')}</option>
                      <option value="fluent" className="text-gray-900">{t('auth.fluent')}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-red-600 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{t('auth.availabilityRates')}</h3>
              </div>
              <div className="flex flex-wrap gap-4">

                {/* Incall Available */}
                <div className="flex items-center p-3 border border-gray-300 rounded-lg flex-1 min-w-[150px]">
                  <input
                    type="checkbox"
                    id="incallAvailable"
                    name="incallAvailable"
                    checked={formData.incallAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, incallAvailable: e.target.checked }))}
                    disabled={isLoading}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="incallAvailable" className="ml-3 text-sm font-medium text-gray-700">
                    {t('auth.incallAvailable')}
                  </label>
                </div>

                {/* Outcall Available */}
                <div className="flex items-center p-3 border border-gray-300 rounded-lg flex-1 min-w-[150px]">
                  <input
                    type="checkbox"
                    id="outcallAvailable"
                    name="outcallAvailable"
                    checked={formData.outcallAvailable}
                    onChange={(e) => setFormData(prev => ({ ...prev, outcallAvailable: e.target.checked }))}
                    disabled={isLoading}
                    className="w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="outcallAvailable" className="ml-3 text-sm font-medium text-gray-700">
                    {t('auth.outcallAvailable')}
                  </label>
                </div>
              </div>

              {/* Rates */}
              {(formData.incallAvailable || formData.outcallAvailable) && (
                <div className="space-y-3 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-medium text-gray-700">{t('auth.rates')}</p>
                      {/* Currency Selector */}
                      <select
                        id="currency"
                        name="currency"
                        value={formData.currency || 'GEL'}
                        onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                        className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-red-500 text-gray-900 bg-white"
                      >
                        <option value="GEL">GEL (₾)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="RUB">RUB (₽)</option>
                      </select>
                    </div>
                    <p className="text-xs text-gray-500">{t('auth.atLeastOneRate')}</p>
                  </div>

                  <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-gray-700">{t('auth.duration')}</th>
                          {formData.incallAvailable && <th className="px-3 py-2 text-center font-medium text-gray-700">{t('auth.incall')}</th>}
                          {formData.outcallAvailable && <th className="px-3 py-2 text-center font-medium text-gray-700">{t('auth.outcall')}</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700">{t('auth.thirtyMin')}</td>
                          {formData.incallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.incallRates?.thirtyMin || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, incallRates: { ...prev.incallRates, thirtyMin: e.target.value } }))} />
                            </td>
                          )}
                          {formData.outcallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.outcallRates?.thirtyMin || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, outcallRates: { ...prev.outcallRates, thirtyMin: e.target.value } }))} />
                            </td>
                          )}
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700">{t('auth.oneHour')}</td>
                          {formData.incallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.incallRates?.oneHour || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, incallRates: { ...prev.incallRates, oneHour: e.target.value } }))} />
                            </td>
                          )}
                          {formData.outcallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.outcallRates?.oneHour || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, outcallRates: { ...prev.outcallRates, oneHour: e.target.value } }))} />
                            </td>
                          )}
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700">{t('auth.twoHours')}</td>
                          {formData.incallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.incallRates?.twoHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, incallRates: { ...prev.incallRates, twoHours: e.target.value } }))} />
                            </td>
                          )}
                          {formData.outcallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.outcallRates?.twoHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, outcallRates: { ...prev.outcallRates, twoHours: e.target.value } }))} />
                            </td>
                          )}
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700">{t('auth.threeHours')}</td>
                          {formData.incallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.incallRates?.threeHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, incallRates: { ...prev.incallRates, threeHours: e.target.value } }))} />
                            </td>
                          )}
                          {formData.outcallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.outcallRates?.threeHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, outcallRates: { ...prev.outcallRates, threeHours: e.target.value } }))} />
                            </td>
                          )}
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700">{t('auth.sixHours')}</td>
                          {formData.incallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.incallRates?.sixHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, incallRates: { ...prev.incallRates, sixHours: e.target.value } }))} />
                            </td>
                          )}
                          {formData.outcallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.outcallRates?.sixHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, outcallRates: { ...prev.outcallRates, sixHours: e.target.value } }))} />
                            </td>
                          )}
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700">{t('auth.twelveHours')}</td>
                          {formData.incallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.incallRates?.twelveHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, incallRates: { ...prev.incallRates, twelveHours: e.target.value } }))} />
                            </td>
                          )}
                          {formData.outcallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.outcallRates?.twelveHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, outcallRates: { ...prev.outcallRates, twelveHours: e.target.value } }))} />
                            </td>
                          )}
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 text-gray-700">{t('auth.twentyFourHours')}</td>
                          {formData.incallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.incallRates?.twentyFourHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, incallRates: { ...prev.incallRates, twentyFourHours: e.target.value } }))} />
                            </td>
                          )}
                          {formData.outcallAvailable && (
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="1" className="w-full px-2 py-1 text-sm border border-gray-300 rounded text-gray-900"
                                value={formData.outcallRates?.twentyFourHours || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, outcallRates: { ...prev.outcallRates, twentyFourHours: e.target.value } }))} />
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Services Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-1 bg-gradient-to-b from-red-600 to-blue-600 rounded-full"></div>
                <h3 className="text-xl font-bold text-gray-900">{t('auth.services')} <span className="text-red-600">*</span></h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {services.map((service) => (
                  <label key={service} className="flex items-center p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.services?.includes(service) || false}
                      onChange={(e) => {
                        const newServices = e.target.checked
                          ? [...(formData.services || []), service]
                          : (formData.services || []).filter(s => s !== service);
                        setFormData(prev => ({ ...prev, services: newServices }));
                      }}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-gray-700">{t(`services.${service}`)}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer - Fixed */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200" style={{ zIndex: 9999 }}>
          <div className="max-w-5xl mx-auto px-6 py-3">
            <form onSubmit={handleSubmit}>
              {/* Captcha - Only show in register mode */}
              {!isEditMode && (
                <Captcha
                  onSuccess={(token: string) => setTurnstileToken(token)}
                  onExpire={() => setTurnstileToken('')}
                />
              )}

              {/* Terms and Conditions - Hide in edit mode */}
              {!isEditMode && (
                <label className="flex items-start mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    disabled={isLoading}
                    className="w-4 h-4 text-slate-700 border-gray-300 rounded focus:ring-slate-500 mt-0.5"
                  />
                  <span className="ml-2 text-xs text-gray-600">
                    {t('auth.termsAgree')}{' '}
                    <Link href="/terms" target="_blank" className="text-slate-700 hover:text-slate-900 font-medium underline">
                      {t('auth.termsOfService')}
                    </Link>{' '}
                    {t('auth.and')}{' '}
                    <Link href="/privacy" target="_blank" className="text-slate-700 hover:text-slate-900 font-medium underline">
                      {t('auth.privacyPolicy')}
                    </Link>{' '}
                    {t('auth.ofThisWebsite')}
                  </span>
                </label>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isLoading}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('auth.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isEditMode ? 'Saving...' : t('auth.creatingAccount')}
                    </>
                  ) : (
                    isEditMode ? t('common.saveChanges') : t('common.register')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
