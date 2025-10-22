import RightSidebar from '@/components/RightSidebar';
import ProfileSlider from '@/components/ProfileSlider';
import ProfileGrid from '@/components/ProfileGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Profile Slider - Full Width */}
      <ProfileSlider />

      {/* Main Content Area - Full Width with 2 columns */}
      <div className="w-full">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          {/* Mobile Filters - Show on mobile only */}
          {/* <div className="lg:hidden mb-4">
            <RightSidebar />
          </div> */}

          {/* Desktop 2-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            {/* Main Content - Profile Grid */}
            <main className="flex-1 min-w-0">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">All escorts</h2>
                <ProfileGrid />
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-1.5 sm:gap-2 my-6 sm:my-8">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded text-sm ${
                      page === 1
                        ? 'bg-purple-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </main>

            {/* Right Sidebar - Search Panel - Desktop only */}
            {/* <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
              <RightSidebar />
            </aside> */}
          </div>
        </div>
      </div>
    </div>
  );
}
