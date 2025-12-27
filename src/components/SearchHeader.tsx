'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { X, Filter, RotateCcw } from 'lucide-react';
import { locations } from '@/data/locations';

export default function SearchHeader() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const t = useTranslations();
    const locale = useLocale() as 'en' | 'ka' | 'ru';

    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const gender = searchParams.get('gender');
    const featured = searchParams.get('featured') === 'true';
    const gold = searchParams.get('gold') === 'true';
    const silver = searchParams.get('silver') === 'true';
    const top = searchParams.get('top') === 'true';
    const verifiedPhotos = searchParams.get('verifiedPhotos') === 'true';
    const isNew = searchParams.get('new') === 'true';
    const online = searchParams.get('online') === 'true';

    // Check if any filter is active
    const hasFilters = search || (city && city !== 'all') || (district && district !== 'all') || gender || featured || gold || silver || top || verifiedPhotos || isNew || online;

    if (!hasFilters) return null;

    const handleClearAll = () => {
        router.push('/');
    };

    const getCityName = (id: string) => {
        const cityData = locations.find(l => l.id === id);
        return cityData ? cityData.name[locale] : id;
    };

    const getDistrictName = (cityId: string, districtId: string) => {
        const cityData = locations.find(l => l.id === cityId);
        if (!cityData) return districtId;
        const districtData = cityData.districts.find(d => d.id === districtId);
        return districtData ? districtData.name[locale] : districtId;
    };

    return (
        <div className="bg-white border-b border-gray-200 py-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                {/* Title & Badges */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-900">
                        <Filter size={20} className="text-red-600" />
                        <h1 className="text-lg font-bold">
                            {search ? (
                                <span>{t('search.searchResultsFor')} <span className="text-red-600">"{search}"</span></span>
                            ) : (
                                <span>{t('search.filteredResults')}</span>
                            )}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {city && city !== 'all' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                {getCityName(city)}
                            </span>
                        )}
                        {district && district !== 'all' && city && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                {getDistrictName(city, district)}
                            </span>
                        )}
                        {gender && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800 border border-pink-200 capitalize">
                                {t(`gender.${gender}`)}
                            </span>
                        )}
                        {verifiedPhotos && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                {t('common.verified')}
                            </span>
                        )}
                        {/* Add more badges as needed for badges like Gold, VIP etc if relevant to show textually, or keep concise */}
                        {gold && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                                {t('search.gold')}
                            </span>
                        )}
                        {silver && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                {t('search.silver')}
                            </span>
                        )}
                        {top && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {t('search.top')}
                            </span>
                        )}
                        {featured && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                                {t('search.featured')}
                            </span>
                        )}
                        {isNew && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                {t('search.new')}
                            </span>
                        )}
                        {online && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                {t('search.online')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Clear Button */}
                <button
                    onClick={handleClearAll}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium text-sm whitespace-nowrap"
                >
                    <RotateCcw size={16} />
                    {t('search.clearFilters')}
                </button>
            </div>
        </div>
    );
}
