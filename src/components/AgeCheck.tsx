"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AgeCheck({ children }: { children: React.ReactNode }) {
    const [verified, setVerified] = useState(false);
    const [mounted, setMounted] = useState(false);
    const t = useTranslations();

    useEffect(() => {
        setMounted(true);
        // Check if already verified (localStorage persists across sessions/tabs)
        const isVerified = localStorage.getItem("age_verified");
        if (isVerified === "true") {
            setVerified(true);
        }
    }, []);

    const handleVerify = () => {
        localStorage.setItem("age_verified", "true");
        setVerified(true);
    };

    const handleExit = () => {
        // Redirect to Google or close tab
        window.location.href = "https://www.google.com";
    };

    // ALWAYS render children for SEO bots to index content
    // The overlay will block interaction for humans until verified
    return (
        <>
            {/* The actual site content - always visible to bots */}
            {children}

            {/* Age Verification Overlay - Only for unverified humans */}
            {mounted && !verified && (
                <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-300">

                        {/* Logo */}
                        <div className="flex justify-center mb-2">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden p-1 border-2 border-gray-100">
                                <Image
                                    src="/icons/logo.png"
                                    alt="GogoXGeorgia"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {t('common.ageVerificationTitle', { defaultMessage: '18+ Age Verification' })}
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                {t('common.ageVerificationText', { defaultMessage: 'This website contains material that is restricted to adults only. You must be 18 years of age or older to enter.' })}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                            <button
                                onClick={handleExit}
                                className="px-8 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors duration-200"
                            >
                                {t('common.exit', { defaultMessage: 'Exit' })}
                            </button>
                            <button
                                onClick={handleVerify}
                                className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-200 transition-all duration-200 transform hover:scale-105"
                            >
                                {t('common.enter', { defaultMessage: 'I am 18+ - Enter' })}
                            </button>
                        </div>

                        <p className="text-xs text-gray-400 mt-4">
                            {t('common.ageVerificationDisclaimer', { defaultMessage: 'By entering this site you agree to our Terms of Service and Privacy Policy.' })}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
