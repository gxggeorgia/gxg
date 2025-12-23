import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
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

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://gogoxgeorgia.ge";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Gogo xgeorgia, ესკორტ გოგოები, Escort gogoebi, ესკორტი xgeorgia, escort batumi, Tbilisi escort, Escort Georgia, Xgeorgia, Gogoxgeorgia",
  description: "Gogoxgeorgia - Leading ესკორტ გოგოები platform. Verified Escort gogoebi, Tbilisi escort & escort batumi profiles. Premium ესკორტი xgeorgia in Escort Georgia. Find Gogo xgeorgia today.",
  keywords: [
    "Gogo xgeorgia",
    "Gogoxgeorgia",
    "gogoxgeorgia",
    "Xgeorgia",
    "ესკორტ გოგოები",
    "ესკორტი xgeorgia",
    "Escort gogoebi",
    "eskort gogoebi",
    "escort batumi",
    "batumi escort",
    "eskort batumi",
    "Tbilisi escort",
    "escort tbilisi",
    "Escort Georgia",
    "escort Georgia",
    "georgian escort",
    "gogoxgeorgia vip",
    "escort girls",
    "escorts",
    "eskortebi",
    "escortebi",
    "gogoxgeorgia tbilisi",
    "escort kutaisi",
    "eskortebi Telavi",
    "bozebis saiti",
    "gogoebi tbilisi batumi kutaisi",
    "whores tbilisi",
    "escort",
    "intim gacnoba",
    "georgian intim dating site",
    "bozebis nomrebi",
    "bozebi batumi gamodzaxebit"
  ],
  authors: [{ name: "GOGO XGEORGIA" }],
  creator: "GOGO XGEORGIA",
  publisher: "GOGO XGEORGIA",
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "GOGO XGEORGIA",
    title: "Gogo xgeorgia, ესკორტ გოგოები, Escort gogoebi, ესკორტი xgeorgia, escort batumi, Tbilisi escort, Escort Georgia, Xgeorgia, Gogoxgeorgia",
    description: "Gogoxgeorgia - Leading ესკორტ გოგოები platform. Verified Escort gogoebi, Tbilisi escort & escort batumi profiles. Premium ესკორტი xgeorgia in Escort Georgia.",
    images: [
      {
        url: `/icons/logo.png`,
        width: 1200,
        height: 630,
        alt: "GOGO XGEORGIA Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gogo xgeorgia, ესკორტ გოგოები, Escort gogoebi, ესკორტი xgeorgia, escort batumi, Tbilisi escort, Escort Georgia, Xgeorgia, Gogoxgeorgia",
    description: "Gogoxgeorgia - Leading ესკორტ გოგოები platform. Verified Escort gogoebi, Tbilisi escort & escort batumi profiles. Premium ესკორტი xgeorgia.",
    images: [`/icons/logo.png`],
    creator: "@gogoxgeorgia",
  },
  icons: {
    icon: [
      { url: "/icons/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon/favicon.ico", type: "image/x-icon" },
    ],
    apple: { url: "/icons/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
  manifest: "/icons/favicon/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "GOGO XGEORGIA",
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
    name: 'GOGO XGEORGIA',
    url: baseUrl,
    logo: `${baseUrl}/icons/logo.png`,
    description: 'GOGOXGEORGIA.GE | Escort Girls, Companions & VIP Services in Georgia',
    sameAs: [
      'https://www.facebook.com/escortdirectoryga',
      'https://www.twitter.com/escortdirectoryga',
      'https://www.instagram.com/escortdirectoryga',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@gogoxgeorgia.ge',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GOGO XGEORGIA',
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
