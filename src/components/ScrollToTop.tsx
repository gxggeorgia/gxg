'use client';

import { useTranslations } from 'next-intl';
import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ScrollToTop() {
    const t = useTranslations('common');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 50) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-all duration-300 z-[100] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            aria-label="Scroll to top"
        >
            <ArrowUp size={20} className="sm:w-6 sm:h-6" />
            <span className="text-sm font-medium">{t('scrollToTop')}</span>
        </button>
    );
}
