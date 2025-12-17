import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';
const siteName = 'GOGO X GEORGIA';
const description = 'GOGOXGEORGIA.GE | GOGOXGEORGIA.GE Escort Girls, eskort gogoebi, gogoxgeorgia, batumi escort, eskort batumi, escort girls, escort tbilisi, whores tbilisi, eskortebi, escorts, gogoxgeorgia tbilisi, escortebi, escort batumi, escort kutaisi, bozebis saiti, eskortebi Telavi, georgian escort, gogoxgeorgia vip, escort, intim gacnoba, gogoebi tbilisi batumi kutaisi, georgian intim dating site, bozebis nomrebi, bozebi batumi gamodzaxebit, escort Georgia.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} | Escort Girls, Companions & VIP Services in Georgia`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "eskort gogoebi", "gogoxgeorgia", "batumi escort", "eskort batumi", "escort girls",
    "escort tbilisi", "whores tbilisi", "eskortebi", "escorts", "gogoxgeorgia tbilisi",
    "escortebi", "escort batumi", "escort kutaisi", "bozebis saiti", "eskortebi Telavi",
    "georgian escort", "gogoxgeorgia vip", "escort", "intim gacnoba",
    "gogoebi tbilisi batumi kutaisi", "georgian intim dating site", "bozebis nomrebi",
    "bozebi batumi gamodzaxebit", "escort Georgia"
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName,
    title: `${siteName} | Escort Girls, Companions & VIP Services in Georgia`,
    description: "Find verified escorts and companions in Georgia. Browse profiles, rates, and services.",
    images: [
      {
        url: `${baseUrl}/icons/logo.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} Logo`,
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} | Escort Girls, Companions & VIP Services in Georgia`,
    description: "Find verified escorts and companions in Georgia.",
    images: [`${baseUrl}/icons/logo.png`],
    creator: '@gogoxgeorgia',
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', type: 'image/x-icon' },
    ],
    apple: { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      {
        rel: 'icon',
        url: '/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/favicon/site.webmanifest',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: siteName,
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '',
  image?: string,
  noIndex: boolean = false
): Metadata {
  const url = `${baseUrl}${path}`;
  const ogImage = image || `${baseUrl}/icons/logo.png`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
      creator: '@gogoxgeorgia',
    },
  };
}
