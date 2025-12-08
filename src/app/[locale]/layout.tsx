import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UserStatusBar from '@/components/UserStatusBar';
import ScrollToTop from '@/components/ScrollToTop';
import Providers from '@/components/Providers';
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://escortdirectorygeorgia.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Escort Directory Georgia | Verified Escorts & Companions",
  description: "Find verified escorts and companions in Georgia. Browse profiles, rates, and services. Safe, discreet, and professional escort directory.",
  keywords: ["escorts Georgia", "companions Georgia", "escort services", "verified escorts"],
  authors: [{ name: "Escort Directory Georgia" }],
  creator: "Escort Directory Georgia",
  publisher: "Escort Directory Georgia",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Escort Directory Georgia",
    title: "Escort Directory Georgia | Verified Escorts & Companions",
    description: "Find verified escorts and companions in Georgia. Browse profiles, rates, and services.",
    images: [
      {
        url: `${baseUrl}/icons/logo.jpeg`,
        width: 1200,
        height: 630,
        alt: "Escort Directory Georgia Logo",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Escort Directory Georgia | Verified Escorts & Companions",
    description: "Find verified escorts and companions in Georgia.",
    images: [`${baseUrl}/icons/logo.jpeg`],
    creator: "@escortdirectoryga",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", type: "image/x-icon" },
    ],
    apple: { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/favicon/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Escort Directory Georgia",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as 'en' | 'ka' | 'ru')) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Escort Directory Georgia',
    url: baseUrl,
    logo: `${baseUrl}/icons/logo.jpeg`,
    description: 'Find verified escorts and companions in Georgia',
    sameAs: [
      'https://www.facebook.com/escortdirectoryga',
      'https://www.twitter.com/escortdirectoryga',
      'https://www.instagram.com/escortdirectoryga',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@escortdirectorygeorgia.com',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Escort Directory Georgia',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      query_input: 'required name=search_term_string',
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          suppressHydrationWarning
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers messages={messages} locale={locale}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <UserStatusBar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        </Providers>
      </body>
    </html>
  );
}
