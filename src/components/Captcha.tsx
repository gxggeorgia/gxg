"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";

interface CaptchaProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

export default function Captcha({ onSuccess, onError, onExpire }: CaptchaProps) {
    const { theme } = useTheme();
    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;

    if (!siteKey) {
        console.error("NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY is not defined");
        return <div className="text-red-500 text-sm">Error: Captcha Site Key Missing</div>;
    }

    return (
        <div className="w-full flex justify-center my-4">
            <Turnstile
                siteKey={siteKey}
                onSuccess={onSuccess}
                onError={onError}
                onExpire={onExpire}
                options={{
                    theme: theme === "dark" ? "dark" : "light",
                }}
            />
        </div>
    );
}
