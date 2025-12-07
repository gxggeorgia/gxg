'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Phone, MapPin, Edit2, Globe, Ruler, Heart, Languages as LanguagesIcon, DollarSign, Star, Crown, MessageCircle, Clock, Zap, ExternalLink, Instagram, Facebook, Twitter, Flag } from 'lucide-react';
import Image from 'next/image';
import ImageLightbox from './ImageLightbox';
import Link from 'next/link';
import ReportModal from './ReportModal';

interface EscortProfile {
    id: string;
    name: string | null;
    phone: string;
    whatsappAvailable: boolean | null;
    viberAvailable: boolean | null;
    city: string;
    district: string | null;
    gender: string;
    dateOfBirth: Date | string;
    ethnicity: string;
    hairColor: string | null;
    bustSize: string | null;
    height: number;
    weight: string;
    build: string | null;
    incallAvailable: boolean | null;
    outcallAvailable: boolean | null;
    aboutYou: string;
    languages: Array<{ name: string; level: string }> | null;
    currency: string;
    rates: {
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
    } | null;
    services: string[] | null;
    tags: string[] | null;
    images: Array<{ url: string; width?: number; height?: number; size: number; mimeType: string }> | null;
    videos: Array<{ url: string; thumbnailUrl?: string }> | null;
    website?: string | null;
    instagram?: string | null;
    snapchat?: string | null;
    twitter?: string | null;
    facebook?: string | null;
    isVip: boolean;
    isVipElite: boolean;
    isFeatured: boolean;
    status?: string;
    email?: string;
}

interface EscortProfileDisplayProps {
    profile: EscortProfile;
    isOwnProfile?: boolean;
}

export default function EscortProfileDisplay({ profile, isOwnProfile = false }: EscortProfileDisplayProps) {
    const tAuth = useTranslations('auth');
    const tCommon = useTranslations('common');
    const tProfile = useTranslations('profile');
    const tServices = useTranslations('services');
    const router = useRouter();
    const pathname = usePathname();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const locale = useLocale();

    const getWhatsAppMessage = () => {
        // Always use the production URL to avoid hydration mismatches (server vs client)
        const profileUrl = `https://gogoxgeorgia.ge/${locale}/escort/${profile.id}`;

        const messages = {
            ka: `გამარჯობა, თქვენი პროფილი აღმოჩნდა აქ და მსურდა დაკავშირება.\n${profileUrl}`,
            ru: `Здравствуйте, я увидел ваш профиль здесь и решил написать вам.\n${profileUrl}`,
            en: `Hello, I saw your profile here and wanted to reach out.\n${profileUrl}`
        };

        return messages[locale as keyof typeof messages] || messages.en;
    };

    const calculateAge = (dob: Date | string) => {
        const birthDate = typeof dob === 'string' ? new Date(dob) : dob;
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(profile.dateOfBirth);

    const durationLabels: Record<string, string> = {
        thirtyMin: tAuth('thirtyMin'),
        oneHour: tAuth('oneHour'),
        twoHours: tAuth('twoHours'),
        threeHours: tAuth('threeHours'),
        sixHours: tAuth('sixHours'),
        twelveHours: tAuth('twelveHours'),
        twentyFourHours: tAuth('twentyFourHours'),
    };

    return (
        <div className="min-h-screen bg-white py-6">
            <div className="max-w-6xl mx-auto px-4">
                {/* Profile Header Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-4 md:p-5">
                        <div className="flex flex-col lg:flex-row gap-5 items-start">
                            {/* Left: Image + Info */}
                            <div className="flex-1 w-full">
                                {/* First Row: Image + Name, Location, Age, Gender */}
                                <div className="flex flex-row gap-4 items-center mb-5">
                                    {/* Profile Image */}
                                    {profile.images?.[0]?.url && (
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-gray-100 shadow-md shrink-0 relative">
                                            <img
                                                src={profile.images[0].url}
                                                alt={profile.name || 'Profile'}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Watermark */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
                                                <img
                                                    src="/icons/logo-bgless.png"
                                                    alt="Watermark"
                                                    className="w-1/2 h-auto object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Name, Location, Age, Gender */}
                                    <div className="flex-1 min-w-0">
                                        {/* Name and Badges */}
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                                                {profile.name}
                                            </h1>
                                            {profile.isVipElite && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                                    VIP ELITE
                                                </span>
                                            )}
                                            {profile.isVip && !profile.isVipElite && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                                                    VIP
                                                </span>
                                            )}
                                            {profile.isFeatured && (
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                                    FEATURED
                                                </span>
                                            )}
                                        </div>

                                        {/* Location, Age, Gender in one line */}
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-1 text-red-500" />
                                                <span className="font-medium">
                                                    {profile.city}{profile.district && `, ${profile.district}`}
                                                </span>
                                            </div>
                                            <span className="text-gray-400">•</span>
                                            <span className="font-medium">{age} {tProfile('years')}</span>
                                            <span className="text-gray-400">•</span>
                                            <span className="font-medium capitalize">{profile.gender}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Second Row: Additional Details */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                    {profile.bustSize && (
                                        <div className="bg-pink-50 rounded-lg p-2.5 border border-pink-100">
                                            <div className="text-xs font-semibold text-pink-600">{tAuth('bustSize')}</div>
                                            <div className="text-sm font-bold text-pink-900 uppercase">{profile.bustSize.replace('_', ' ')}</div>
                                        </div>
                                    )}
                                    {profile.height && (
                                        <div className="bg-teal-50 rounded-lg p-2.5 border border-teal-100">
                                            <div className="text-xs font-semibold text-teal-600">{tAuth('height')}</div>
                                            <div className="text-sm font-bold text-teal-900">{profile.height} cm</div>
                                        </div>
                                    )}
                                    {profile.build && (
                                        <div className="bg-amber-50 rounded-lg p-2.5 border border-amber-100">
                                            <div className="text-xs font-semibold text-amber-600">{tAuth('build')}</div>
                                            <div className="text-sm font-bold text-amber-900 capitalize">{profile.build}</div>
                                        </div>
                                    )}
                                    {profile.hairColor && (
                                        <div className="bg-indigo-50 rounded-lg p-2.5 border border-indigo-100">
                                            <div className="text-xs font-semibold text-indigo-600">{tAuth('hairColor')}</div>
                                            <div className="text-sm font-bold text-indigo-900 capitalize">{profile.hairColor}</div>
                                        </div>
                                    )}
                                    {profile.ethnicity && (
                                        <div className="bg-rose-50 rounded-lg p-2.5 border border-rose-100">
                                            <div className="text-xs font-semibold text-rose-600">{tAuth('ethnicity')}</div>
                                            <div className="text-sm font-bold text-rose-900 capitalize">{profile.ethnicity}</div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Contact & Actions */}
                            <div className="w-full lg:w-64 shrink-0">
                                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Phone size={18} className="text-blue-600" />
                                        {tCommon('contactInfo')}
                                    </h3>
                                    <div className="space-y-2">
                                        {profile.phone && (
                                            <a
                                                href={`tel:${profile.phone}`}
                                                className="flex items-center gap-2 text-gray-700 p-2.5 bg-white rounded-lg hover:bg-gray-100 text-sm"
                                            >
                                                <Phone size={16} className="text-blue-600" />
                                                <span className="font-medium flex-1">{profile.phone}</span>
                                                <ExternalLink size={12} className="text-gray-400" />
                                            </a>
                                        )}
                                        {profile.whatsappAvailable && (
                                            <a
                                                href={`https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(getWhatsAppMessage())}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-700 p-2.5 bg-green-50 rounded-lg hover:bg-green-100 text-sm"
                                            >
                                                <MessageCircle size={16} className="text-green-600" />
                                                <span className="font-medium flex-1">{tCommon('whatsapp')}</span>
                                                <ExternalLink size={12} className="text-gray-400" />
                                            </a>
                                        )}
                                        {profile.viberAvailable && (
                                            <a
                                                href={`viber://chat?number=${profile.phone?.replace(/[^0-9+]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-gray-700 p-2.5 bg-purple-50 rounded-lg hover:bg-purple-100 text-sm"
                                            >
                                                <Image src="/icons/viber_logo-170x170.png" alt="Viber" width={16} height={16} />
                                                <span className="font-medium flex-1">{tCommon('viber')}</span>
                                                <ExternalLink size={12} className="text-gray-400" />
                                            </a>
                                        )}
                                    </div>

                                    {isOwnProfile ? (
                                        <button
                                            onClick={() => router.push('/profile/edit')}
                                            className="w-full mt-3 bg-white text-purple-700 hover:bg-purple-50 transition-colors py-2.5 px-4 rounded-lg font-medium text-sm border border-purple-200 flex items-center justify-center gap-2"
                                        >
                                            <Edit2 size={14} />
                                            {tCommon('editProfile')}
                                        </button>
                                    ) : (
                                        <>
                                            <Link
                                                href={`/escort/${profile.id}/chat`}
                                                className="block w-full mt-3 text-center bg-purple-600 hover:bg-purple-700 text-white transition-colors py-2.5 px-4 rounded-lg font-medium text-sm"
                                            >
                                                {tCommon('sendMessage')}
                                            </Link>
                                            <button
                                                onClick={() => setReportModalOpen(true)}
                                                className="w-full mt-2 bg-white text-red-600 hover:bg-red-50 transition-colors py-2.5 px-4 rounded-lg font-medium text-sm border border-red-200 flex items-center justify-center gap-2"
                                            >
                                                <Flag size={14} />
                                                Report Profile
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Report Modal */}
                <ReportModal
                    isOpen={reportModalOpen}
                    onClose={() => setReportModalOpen(false)}
                    profileId={profile.id}
                    profileUrl={typeof window !== 'undefined' ? window.location.href : pathname}
                    profileName={profile.name || 'Unknown'}
                />

                {/* Images & Videos Section */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-200 mb-6">
                    <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {tProfile('publicGallery')} ({(profile.images?.length || 0) + (profile.videos?.length || 0)})
                    </h3>

                    {(profile.images && profile.images.length > 0) || (profile.videos && profile.videos.length > 0) ? (
                        <div className="flex flex-wrap justify-center gap-3">
                            {/* Videos */}
                            {profile.videos?.map((video, index) => (
                                <div
                                    key={`vid-${index}`}
                                    className="relative group overflow-hidden rounded-lg w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(50%-0.5rem)] border-2 border-purple-300"
                                >
                                    <video
                                        src={video.url}
                                        controls
                                        className="w-full h-auto rounded-lg bg-black"
                                        preload="metadata"
                                        poster={video.thumbnailUrl}
                                    >
                                        Your browser does not support the video tag.
                                    </video>
                                    {/* Video Badge */}
                                    <div className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm font-bold flex items-center gap-1.5">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                        {tProfile('video')}
                                    </div>
                                </div>
                            ))}

                            {/* Images */}
                            {profile.images?.map((image, index) => (
                                <div
                                    key={`img-${index}`}
                                    className="relative group overflow-hidden rounded-lg w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.5rem)] md:w-[calc(25%-0.75rem)]"
                                >
                                    <img
                                        src={image.url}
                                        alt={`${profile.name || 'Profile'} image ${index + 1}`}
                                        width={image.width || 400}
                                        height={image.height || 400}
                                        className="w-full h-full object-cover cursor-pointer transition-transform duration-200 hover:scale-105 rounded-lg"
                                        onClick={() => {
                                            setLightboxIndex(index);
                                            setLightboxOpen(true);
                                        }}
                                    />
                                    {/* Watermark */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
                                        <img
                                            src="/icons/logo-bgless.png"
                                            alt="Watermark"
                                            className="w-1/4 h-auto object-contain"
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            setLightboxIndex(index);
                                            setLightboxOpen(true);
                                        }}
                                        className="hidden md:flex absolute inset-0 items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition rounded-lg"
                                    >
                                        <div className="bg-white rounded-full p-3 shadow-xl">
                                            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full h-40 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm text-gray-500">{tProfile('noPhotos')}</p>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* About */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Heart size={24} className="text-amber-500" />
                                {tProfile('about')}
                            </h2>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{profile.aboutYou}</p>
                        </div>


                        {/* Services */}
                        {profile.services && profile.services.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Star className="w-6 h-6 text-purple-600" />
                                    {tAuth('services')}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {profile.services.map((service, index) => (
                                        <div key={service} className="flex items-start gap-3 p-3 bg-linear-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100 hover:shadow-md transition-shadow">
                                            <span className="shrink-0 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </span>
                                            <span className="flex-1 text-gray-800 font-medium text-sm leading-relaxed">
                                                {tServices(service)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {profile.tags && profile.tags.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">{tProfile('tags')}</h2>
                                <div className="flex flex-wrap gap-2">
                                    {profile.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Rates */}
                        {(profile.incallAvailable || profile.outcallAvailable) && profile.rates && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <DollarSign size={24} className="text-green-600" />
                                    {tAuth('rates')}
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">{tAuth('duration')}</th>
                                                {profile.incallAvailable && <th className="text-center py-3 px-4 font-semibold text-purple-700">{tAuth('incall')}</th>}
                                                {profile.outcallAvailable && <th className="text-center py-3 px-4 font-semibold text-blue-700">{tAuth('outcall')}</th>}
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
                                                        <td className="py-3 px-4 text-gray-900 font-medium">{durationLabels[duration]}</td>
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

                    {/* Right Column */}
                    <div className="space-y-6">

                        {/* Languages */}
                        {profile.languages && profile.languages.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <LanguagesIcon size={20} className="text-purple-600" />
                                    {tAuth('languagesSpoken')}
                                </h2>
                                <div className="space-y-2">
                                    {profile.languages.map((lang, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                                            <span className="font-medium text-gray-900">{lang.name}</span>
                                            <span className="text-sm text-purple-700 capitalize font-medium">{lang.level}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact */}


                        {/* Availability */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Clock size={20} className="text-amber-600" />
                                {tProfile('availability')}
                            </h3>
                            <div className="space-y-2">
                                {profile.incallAvailable && (
                                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                                        <Zap size={16} />
                                        <span className="font-medium">{tAuth('incallAvailable')}</span>
                                    </div>
                                )}
                                {profile.outcallAvailable && (
                                    <div className="flex items-center gap-2 text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <Zap size={16} />
                                        <span className="font-medium">{tAuth('outcallAvailable')}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Social Media */}
                        {(profile.website || profile.instagram || profile.twitter || profile.facebook || profile.snapchat) && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Globe size={20} className="text-blue-600" />
                                    {tAuth('socialMedia')}
                                </h3>
                                <div className="space-y-2">
                                    {profile.website && (
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition">
                                            <Globe size={16} />
                                            <span className="text-sm font-medium">{tAuth('website')}</span>
                                        </a>
                                    )}
                                    {profile.instagram && (
                                        <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-600 hover:text-pink-700 p-2 hover:bg-pink-50 rounded transition">
                                            <Instagram size={16} />
                                            <span className="text-sm font-medium">{tAuth('instagram')}</span>
                                        </a>
                                    )}
                                    {profile.twitter && (
                                        <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-600 hover:text-sky-700 p-2 hover:bg-sky-50 rounded transition">
                                            <Twitter size={16} />
                                            <span className="text-sm font-medium">{tAuth('twitter')}</span>
                                        </a>
                                    )}
                                    {profile.facebook && (
                                        <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-700 hover:text-blue-800 p-2 hover:bg-blue-50 rounded transition">
                                            <Facebook size={16} />
                                            <span className="text-sm font-medium">{tAuth('facebook')}</span>
                                        </a>
                                    )}
                                    {profile.snapchat && (
                                        <a href={`https://snapchat.com/add/${profile.snapchat}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-yellow-500 hover:text-yellow-600 p-2 hover:bg-yellow-50 rounded transition">
                                            <MessageCircle size={16} />
                                            <span className="text-sm font-medium">{tAuth('snapchat')}</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Lightbox */}
            {profile.images && profile.images.length > 0 && (
                <ImageLightbox
                    images={profile.images}
                    initialIndex={lightboxIndex}
                    isOpen={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                />
            )}
        </div>
    );
}
