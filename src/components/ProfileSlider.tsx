'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProfileCard from './ProfileCard';

const mockProfiles = [
  { id: 1, name: 'Nata', city: 'Tbilisi', isVip: true, isVerified: true, isNew: false, isOnline: true },
  { id: 2, name: 'Maria', city: 'Kutaisi', isVip: false, isVerified: false, isNew: true, isOnline: false },
  { id: 3, name: 'IVANAA', city: 'Batumi', isVip: true, isVerified: true, isNew: false, isOnline: true },
  { id: 4, name: 'LILENA', city: 'Gori', isVip: true, isVerified: false, isNew: false, isOnline: true },
  { id: 5, name: 'Sofia', city: 'Tbilisi', isVip: false, isVerified: true, isNew: true, isOnline: false },
  { id: 6, name: 'Anna', city: 'Rustavi', isVip: true, isVerified: true, isNew: false, isOnline: true },
];

export default function ProfileSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const [itemsPerView, setItemsPerView] = useState(6);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(2);
      else if (window.innerWidth < 768) setItemsPerView(3);
      else if (window.innerWidth < 1024) setItemsPerView(4);
      else setItemsPerView(6);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const maxIndex = Math.max(0, mockProfiles.length - itemsPerView);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  return (
    <div className="relative bg-black py-4 mb-6 w-full">
      <div className="max-w-[1920px] mx-auto px-4">
        <div className="relative overflow-hidden">
          {/* Slider Container */}
          <div 
            className="flex transition-transform duration-500 ease-in-out gap-2"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {mockProfiles.map((profile) => (
              <div 
                key={profile.id} 
                className="flex-shrink-0"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <ProfileCard profile={profile} compact />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
