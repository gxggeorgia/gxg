
import FeaturedProfileSlider from '@/components/FeaturedProfileSlider';
import ProfileGrid from '@/components/ProfileGrid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      
      <FeaturedProfileSlider />
      
      <div className="w-full">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">

          <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
            <main className="flex-1 min-w-0">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">All escorts</h2>
                <ProfileGrid />
              </div>
            </main>
          </div>

        </div>
      </div>
    </div>
  );
}
