import { Turnstile } from "@marsidev/react-turnstile";
import { useTheme } from "next-themes";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface CaptchaProps {
    onSuccess: (token: string) => void;
    onError?: () => void;
    onExpire?: () => void;
}

export interface CaptchaRef {
    reset: () => void;
}

const Captcha = forwardRef<CaptchaRef, CaptchaProps>(({ onSuccess, onError, onExpire }, ref) => {
    const { theme } = useTheme();
    const siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY;
    const turnstileRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
        reset: () => {
            if (turnstileRef.current) {
                turnstileRef.current.reset();
            }
        }
    }));

    if (!siteKey) {
        console.error("NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY is not defined");
        return <div className="text-red-500 text-sm">Error: Captcha Site Key Missing</div>;
    }

    return (
        <div className="w-full flex justify-center my-4">
            <Turnstile
                ref={turnstileRef}
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
});

Captcha.displayName = "Captcha";

export default Captcha;
