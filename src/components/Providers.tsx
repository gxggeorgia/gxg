"use client";

import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";

interface ProvidersProps {
    children: React.ReactNode;
    messages: AbstractIntlMessages;
    locale: string;
}

export default function Providers({ children, messages, locale }: ProvidersProps) {
    return (
        <NextIntlClientProvider messages={messages} locale={locale}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
            </ThemeProvider>
        </NextIntlClientProvider>
    );
}
