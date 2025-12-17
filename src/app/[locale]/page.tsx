
import FeaturedProfileSlider from '@/components/FeaturedProfileSlider';
import LeftSidebar from '@/components/LeftSidebar';
import ProfileGrid from '@/components/ProfileGrid';
import RightSidebar from '@/components/RightSidebar';
import SiteNotice from '@/components/SiteNotice';
import SecurityCheck from '@/components/SecurityCheck';

export default function HomePage() {
  return (
    <SecurityCheck>
      <div className="min-h-screen bg-gray-50">

        {/* Featured Slider - Full Width */}
        <div className="w-full border-b border-gray-200 bg-white mb-6">
          <FeaturedProfileSlider />
        </div>

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
              <ProfileGrid />

              <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-lg text-center space-y-2">
                <p className="font-bold text-red-600 text-lg">
                  ჩვენი 18+ საიტი არის მარტო GOGOXGEORGIA.GE სხვა საიტები არ გვაქვს. ყოველთვის მუშა და აქტუალური საიტის ლინკი იქნება ჩვენ ჯგუფში. დააწკაპუნეთ და შემოგვიერთდით
                </p>
                <p className="font-medium text-red-500">
                  (Наш сайт только GOGOXGEORGIA.GE других сайтов нету. В случае блокировки сайта рабочий и актуальный линк будет в группе, нажмите и подписывайтесь)
                </p>
              </div>
            </main>

            {/* Right Sidebar - Desktop Only */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:h-fit lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto scrollbar-hide">
              <RightSidebar />
            </div>

          </div>
        </div>
      </div>
    </SecurityCheck>
  );
}
