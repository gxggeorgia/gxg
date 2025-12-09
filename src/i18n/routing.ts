import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'ka', 'ru'],

  // Used when no locale matches
  defaultLocale: (process.env.NEXT_PUBLIC_DEFAULT_LOCALE as 'en' | 'ka' | 'ru') || 'ka',

  // Locale prefix strategy
  localePrefix: 'always'
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
