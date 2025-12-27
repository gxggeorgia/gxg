
import FeaturedProfileSlider from '@/components/FeaturedProfileSlider';
import LeftSidebar from '@/components/LeftSidebar';
import ProfileGrid from '@/components/ProfileGrid';
import RightSidebar from '@/components/RightSidebar';
import SearchHeader from '@/components/SearchHeader';
import SiteNotice from '@/components/SiteNotice';

import AgeCheck from '@/components/AgeCheck';
import Script from 'next/script';
import { locations } from '@/data/locations';

import { generateSearchMetadata } from '@/lib/searchMetadata';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSearchMetadata({ locale, searchParams });
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const {
    search,
    city,
    district,
    gender,
    featured,
    gold,
    silver,
    top,
    verifiedPhotos,
    new: newFilter,
    online,
  } = await searchParams;

  const hasFilters =
    search ||
    (city && city !== 'all') ||
    (district && district !== 'all') ||
    gender ||
    featured === 'true' ||
    gold === 'true' ||
    silver === 'true' ||
    top === 'true' ||
    verifiedPhotos === 'true' ||
    newFilter === 'true' ||
    online === 'true';

  const showFeatured = !hasFilters;

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gogoxgeorgia.ge';

  // Helper to get localized names
  const getCityName = (id: string) => {
    const c = locations.find(l => l.id === id);
    return c?.name[locale as keyof typeof c.name] || id;
  };

  const getDistrictName = (cityId: string, districtId: string) => {
    const c = locations.find(l => l.id === cityId);
    const d = c?.districts.find(d => d.id === districtId);
    return d?.name[locale as keyof typeof d.name] || districtId;
  };

  // Breadcrumb Schema
  const breadcrumbElements = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${siteUrl}/${locale}`
    }
  ];

  if (city && city !== 'all' && typeof city === 'string') {
    breadcrumbElements.push({
      '@type': 'ListItem',
      position: 2,
      name: getCityName(city),
      item: `${siteUrl}/${locale}?city=${city}`
    });

    if (district && district !== 'all' && typeof district === 'string') {
      breadcrumbElements.push({
        '@type': 'ListItem',
        position: 3,
        name: getDistrictName(city, district),
        item: `${siteUrl}/${locale}?city=${city}&district=${district}`
      });
    }
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbElements
  };

  return (
    <AgeCheck>
      <Script
        id="breadcrumb-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-gray-50">
        <h1 className="sr-only">Gogoxgeorgia - Leading ესკორტ გოგოები platform. Verified Escort gogoebi, Tbilisi escort & escort batumi profiles.</h1>

        {/* Featured Slider - Full Width - Only show on main page */}
        {showFeatured && (
          <div className="w-full border-b border-gray-200 bg-white mb-6">
            <FeaturedProfileSlider />
          </div>
        )}

        <div className="mx-auto lg:px-8 pb-8">
          <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr_320px] lg:gap-6 items-start">

            {/* Left Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
              <LeftSidebar />
            </div>

            {/* Main Content */}
            <main className="space-y-6 min-w-0 w-full lg:px-0 p-2">

              {/* Right Sidebar - Mobile Only (Search) */}
              <div className="lg:hidden">
                <RightSidebar />
              </div>

              {/* Left Sidebar - Mobile Only (Cities) */}
              <div className="lg:hidden">
                <LeftSidebar />
              </div>

              <SiteNotice />
              <SearchHeader />
              <ProfileGrid />

              <aside aria-label="Authenticity Warning" className="mt-8 p-4 bg-red-50 border border-red-100 rounded-lg text-center space-y-2">
                <p className="font-bold text-red-600 text-lg">
                  ჩვენი 18+ საიტი არის მარტო GOGOXGEORGIA.GE სხვა საიტები არ გვაქვს. ყოველთვის მუშა და აქტუალური საიტის ლინკი იქნება ჩვენ ჯგუფში. დააწკაპუნეთ და შემოგვიერთდით
                </p>
                <p className="font-medium text-red-500">
                  (Наш сайт только GOGOXGEORGIA.GE других сайтов нету. В случае блокировки сайта рабочий и актуальный линк будет в группе, нажмите и подписывайтесь)
                </p>
              </aside>
            </main>

            {/* Right Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
              <RightSidebar />
            </div>

          </div>
        </div>
      </div>
    </AgeCheck>
  );
}
