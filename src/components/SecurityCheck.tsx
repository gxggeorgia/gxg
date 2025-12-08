"use client";

import { useState, useEffect, useRef } from "react";
import Captcha from "./Captcha";
import { useTranslations } from "next-intl";

import Image from "next/image";

export default function SecurityCheck({ children }: { children: React.ReactNode }) {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(true);
    const t = useTranslations();

    useEffect(() => {
        // Check if already verified in this session
        const isVerified = sessionStorage.getItem("site_verified");
        if (isVerified === "true") {
            setVerified(true);
        }
        setLoading(false);
    }, []);

    const isVerifying = useRef(false);

    const handleSuccess = async (token: string) => {
        if (isVerifying.current) return;
        isVerifying.current = true;

        try {
            const response = await fetch('/api/verify-captcha', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("site_verified", "true");
                setVerified(true);
            } else {
                console.error('Captcha verification failed:', data.error || 'Unknown error');
                isVerifying.current = false;
                // Optionally reset the widget here if you had a ref to it
            }
        } catch (error) {
            console.error('Error verifying captcha:', error);
            isVerifying.current = false;
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (verified) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 text-center space-y-8">

                {/* Logo */}
                <div className="flex justify-center">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden p-1">
                        <Image
                            src="/icons/logo.png"
                            alt="GogoXGeorgia"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                        {t('common.securityCheck')}
                    </h1>
                    <p className="text-gray-500 text-sm font-medium">
                        {t('common.pleaseVerifyHuman')}
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className="">
                        <Captcha onSuccess={handleSuccess} />
                    </div>
                </div>
            </div>
        </div>
    );
}
