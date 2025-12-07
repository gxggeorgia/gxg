interface MainLoaderProps {
  title?: string;
  subtitle?: string;
  showFeaturedSlider?: boolean;
  showProfileGrid?: boolean;
}

export default function MainLoader({
  title = "Loading...",
  subtitle,
  showFeaturedSlider = true,
  showProfileGrid = true,
}: MainLoaderProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Featured Slider Skeleton */}
      {showFeaturedSlider && (
        <div className="w-full bg-gradient-to-br from-slate-50 via-white to-slate-50 py-6 flex justify-center">
          <div className="w-full max-w-[1920px] px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="mb-6 animate-pulse">
              <div className="h-10 sm:h-12 md:h-14 bg-gray-200 rounded w-64 sm:w-80 mb-3"></div>
              <div className="h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-64"></div>
            </div>

            {/* Slider Skeleton */}
            <div className="relative overflow-hidden">
              <div className="flex gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="shrink-0 w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(20%-0.8rem)]"
                  >
                    <div className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden animate-pulse">
                      {/* Image Skeleton */}
                      <div className="relative w-full bg-gray-200" style={{ aspectRatio: '3/4' }}>
                        <div className="absolute top-2 left-2 flex flex-col gap-0.5">
                          <div className="h-5 w-16 bg-gray-300 rounded"></div>
                        </div>
                        <div className="absolute top-2 right-2">
                          <div className="h-6 w-20 bg-gray-300 rounded"></div>
                        </div>
                      </div>
                      {/* Info Skeleton */}
                      <div className="p-2.5 bg-white border-t border-gray-100 space-y-1.5">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls Skeleton */}
            <div className="flex justify-center items-center gap-3 mt-6 sm:mt-8 animate-pulse">
              <div className="flex gap-2 bg-slate-100 px-4 py-3 rounded-full">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                ))}
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-full w-12 h-7"></div>
              <div className="bg-red-200 p-2.5 rounded-full w-9 h-9"></div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Grid Skeleton */}
      {showProfileGrid && (
        <div className="w-full">
          <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
            {/* Title Skeleton */}
            {title && (
              <div className="mb-6 animate-pulse">
                <div className="h-8 sm:h-10 bg-gray-200 rounded w-48 sm:w-64 mb-2"></div>
                {subtitle && <div className="h-4 bg-gray-200 rounded w-64 sm:w-80"></div>}
              </div>
            )}

            {/* Grid Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden animate-pulse">
                  {/* Image Skeleton */}
                  <div className="relative w-full bg-gray-200" style={{ aspectRatio: '3/4' }}>
                    <div className="absolute top-2 left-2 flex flex-col gap-0.5">
                      <div className="h-5 w-16 bg-gray-300 rounded"></div>
                    </div>
                    <div className="absolute top-2 right-2">
                      <div className="h-6 w-20 bg-gray-300 rounded"></div>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <div className="h-6 w-16 bg-gray-300 rounded-full"></div>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                  {/* Info Skeleton */}
                  <div className="p-2.5 bg-white border-t border-gray-100 space-y-1.5">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 mt-8 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-red-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
