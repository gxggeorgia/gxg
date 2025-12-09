'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import ProfileCard from './ProfileCard';

interface Escort {
  id: string;
  slug: string;
  name: string;
  city: string;
  isGold: boolean;
  isSilver: boolean;
  verifiedPhotos: boolean;
  languages?: Array<{ name: string; level: string }>;
  coverImage?: string;
  images: Array<{ url: string; width?: number; height?: number; isPrimary?: boolean }>;
}

interface Profile {
  id: string;
  slug: string;
  name: string;
  city: string;
  isGold: boolean;
  isSilver: boolean;
  verifiedPhotos: boolean;
  isOnline: boolean;
  languages?: Array<{ name: string; level: string }>;
  coverImage?: string;
  imageWidth?: number;
  imageHeight?: number;
}

export default function FeaturedProfileSlider() {
  const [profiles, setProfiles] = useState<Escort[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/escorts?featured=true&limit=20');
        if (res.ok) {
          const data = await res.json();
          setProfiles(data.escorts);
        }
      } catch (error) {
        console.error('Error fetching featured escorts:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(2);
      else if (window.innerWidth < 1024) setItemsPerView(3);
      else if (window.innerWidth < 1280) setItemsPerView(4);
      else setItemsPerView(5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, profiles.length - itemsPerView);
  const canScroll = profiles.length > itemsPerView;

  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, isHovered]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeDistance = touchStart - touchEnd;

    // Only trigger swipe if moved more than 50px (prevents accidental swipes on clicks)
    if (Math.abs(swipeDistance) < 50) {
      return; // This was just a tap/click, not a swipe
    }

    if (swipeDistance > 50) {
      handleNext();
      if (sliderRef.current) {
        sliderRef.current.style.opacity = '0.8';
        setTimeout(() => {
          if (sliderRef.current) sliderRef.current.style.opacity = '1';
        }, 100);
      }
    }
    if (swipeDistance < -50) {
      handlePrev();
      if (sliderRef.current) {
        sliderRef.current.style.opacity = '0.8';
        setTimeout(() => {
          if (sliderRef.current) sliderRef.current.style.opacity = '1';
        }, 100);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full bg-linear-to-br from-slate-50 via-white to-slate-50 py-6 flex justify-center">
        <div className="w-full max-w-[1920px] px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="mb-6">
            <div className="h-10 sm:h-12 md:h-14 bg-gray-200 rounded w-64 sm:w-80 mb-3"></div>
            <div className="h-4 sm:h-5 bg-gray-200 rounded w-48 sm:w-64"></div>
          </div>
          <div className="flex gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="shrink-0 w-[calc(50%-0.375rem)] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)] xl:w-[calc(20%-0.8rem)]">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative w-full bg-gray-200" style={{ aspectRatio: '3/4' }}></div>
                  <div className="p-2.5 space-y-1.5">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-linear-to-br from-slate-50 via-white to-slate-50 py-6 flex justify-center">
      <div className="w-full max-w-[1920px] px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-900 via-red-800 to-slate-900 bg-clip-text text-transparent">
              ✨ Featured Profiles
            </h2>
          </div>
          <p className="text-slate-600 text-sm sm:text-base font-medium">Discover our most popular and verified escorts</p>
        </div>

        {/* Slider Container */}
        <div
          ref={sliderRef}
          className="relative group overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Slider */}
          <div className="relative overflow-hidden">
            <div
              className={`flex transition-transform duration-700 ease-out relative z-10 ${!canScroll ? 'justify-center' : ''}`}
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {profiles.map((profile) => (
                <div
                  key={profile.id}
                  className="shrink-0 transform transition-all duration-300 px-1.5 sm:px-2"
                  style={{ width: `calc(${100 / itemsPerView}%)` }}
                >
                  <ProfileCard
                    key={profile.id}
                    profile={{
                      id: profile.id,
                      slug: profile.slug,
                      name: profile.name,
                      city: profile.city,
                      isGold: profile.isGold,
                      isSilver: profile.isSilver,
                      verifiedPhotos: profile.verifiedPhotos,
                      isOnline: (profile as any).isOnline,
                      lastActive: (profile as any).lastActive,
                      languages: profile.languages,
                      coverImage: profile.coverImage || (profile.images as any)?.[0]?.url,
                      imageWidth: (profile.images as any)?.[0]?.width,
                      imageHeight: (profile.images as any)?.[0]?.height,
                    }}
                  />
                </div>
              ))}
            </div>

          </div>

          {/* Navigation Arrows - Only show if scrollable */}
          {canScroll && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-linear-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 opacity-70 hover:opacity-100 z-30 shadow-md"
                aria-label="Previous slide"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-linear-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-2 sm:p-2.5 rounded-full transition-all duration-300 opacity-70 hover:opacity-100 z-30 shadow-md"
                aria-label="Next slide"
              >
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {/* Controls at Bottom - Only show if scrollable */}
        {canScroll && (
          <div className="flex justify-center items-center gap-3 mt-6 sm:mt-8">
            {/* Indicators */}
            <div className="flex gap-2 bg-slate-100 px-4 py-3 rounded-full shadow-md border border-slate-200">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full w-2.5 h-2.5 ${index === currentIndex
                    ? 'bg-red-600'
                    : 'bg-slate-400 hover:bg-slate-500'
                    }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="bg-white px-2.5 py-1.5 rounded-full shadow-md border border-slate-200">
              <span className="text-slate-700 text-xs font-bold text-center">{currentIndex + 1}/{maxIndex + 1}</span>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={toggleAutoPlay}
              className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full transition-all duration-300 shadow-md border border-red-500 flex items-center justify-center"
              aria-label={isAutoPlaying ? 'Pause autoplay' : 'Play autoplay'}
              title={isAutoPlaying ? 'Pause' : 'Play'}
            >
              {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
