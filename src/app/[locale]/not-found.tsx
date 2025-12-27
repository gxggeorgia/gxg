'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/routing';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

export default function NotFound() {
    const t = useTranslations('notFound');
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            router.push(`/?search=${encodeURIComponent(searchValue.trim())}`);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-white">
            <div className="max-w-2xl w-full text-center">


                {/* Content */}
                <div className="space-y-6">

                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        {t('title')}
                    </h1>

                    <p className="text-slate-600 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                        {t('description')}
                    </p>
                </div>

                {/* Search Input */}
                <div className="mt-10 max-w-md mx-auto">
                    <form onSubmit={handleSearch} className="relative group">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            placeholder={t('searchPlaceholder')}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-medium text-slate-700 outline-none focus:border-red-500 focus:bg-white transition-all shadow-sm group-hover:shadow-md"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 px-5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <Search size={20} />
                            <span className="hidden sm:inline">{t('searchButton')}</span>
                        </button>
                    </form>
                </div>

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl font-bold shadow-xl shadow-red-100 hover:bg-red-700 hover:shadow-red-200 transition-all transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto justify-center"
                    >
                        <Home size={22} />
                        {t('backHome')}
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-200 transition-all transform hover:-translate-y-1 active:scale-95 w-full sm:w-auto justify-center group"
                    >
                        <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                        {t('goBack')}
                    </button>
                </div>

            </div>
        </div>
    );
}
