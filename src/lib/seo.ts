import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';
const siteName = 'GOGO XGEORGIA';



export const defaultMetadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Gogo xgeorgia, ესკორტ გოგოები, Escort gogoebi, ესკორტი xgeorgia, escort batumi, Tbilisi escort, Escort Georgia, Xgeorgia, Gogoxgeorgia",
    template: `%s | ${siteName}`,
  },
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
    title: "Gogo xgeorgia, ესკორტ გოგოები, Escort gogoebi, ესკორტი xgeorgia, escort batumi, Tbilisi escort, Escort Georgia, Xgeorgia, Gogoxgeorgia",
    description: "Gogoxgeorgia - Leading ესკორტ გოგოები platform. Verified Escort gogoebi, Tbilisi escort & escort batumi profiles. Premium ესკორტი xgeorgia in Escort Georgia.",
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
    title: "Gogo xgeorgia, ესკორტ გოგოები, Escort gogoebi, ესკორტი xgeorgia, escort batumi, Tbilisi escort, Escort Georgia, Xgeorgia, Gogoxgeorgia",
    description: "Gogoxgeorgia - Leading ესკორტ გოგოები platform. Verified Escort gogoebi, Tbilisi escort & escort batumi profiles. Premium ესკორტი xgeorgia.",
    images: [`${baseUrl}/icons/logo.png`],
    creator: '@gogoxgeorgia',
  },
  icons: {
    icon: [
      { url: '/icons/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon/favicon.ico', type: 'image/x-icon' },
    ],
    apple: { url: '/icons/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      {
        rel: 'icon',
        url: '/icons/favicon/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'icon',
        url: '/icons/favicon/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
  manifest: '/icons/favicon/site.webmanifest',
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
  noIndex: boolean = false,
  locale?: string
): Metadata {
  // If locale is provided, path is relative to locale root (e.g. /escort/slug)
  // If no locale, assume path is full path (legacy behavior)
  const finalPath = locale ? `/${locale}${path}` : path;
  const url = `${baseUrl}${finalPath}`;
  const ogImage = image || `${baseUrl}/icons/logo.png`;

  // Base alternates with canonical
  const alternates: Metadata['alternates'] = {
    canonical: url,
  };

  // If we have a locale and this is a localized page, add hreflangs
  if (locale && (locale === 'en' || locale === 'ka' || locale === 'ru')) {
    alternates.languages = {
      en: `${baseUrl}/en${path}`,
      ka: `${baseUrl}/ka${path}`,
      ru: `${baseUrl}/ru${path}`,
    };
  }

  // Map locale to OG locale
  let ogLocale = 'en_US';
  if (locale === 'ka') ogLocale = 'ka_GE';
  else if (locale === 'ru') ogLocale = 'ru_RU';

  return {
    title,
    description,
    alternates,
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
      locale: ogLocale,
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
