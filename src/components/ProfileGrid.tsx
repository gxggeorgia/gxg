'use client';

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileCard from './ProfileCard';
import ProfileCardSkeleton from './ProfileCardSkeleton';

interface Escort {
  id: string;
  slug: string;
  name: string;
  city: string;
  district?: string;
  isFeatured: boolean;
  isGold: boolean;
  isSilver: boolean;
  isTop: boolean;
  isNew: boolean;
  verifiedPhotos: boolean;
  languages?: Array<{ name: string; level: string }>;
  images: Array<{ url: string; width?: number; height?: number; isPrimary?: boolean }>;
  coverImage?: string;
}

interface Pagination {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function ProfileGrid() {
  const searchParams = useSearchParams();
  const [escorts, setEscorts] = useState<Escort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const gridTopRef = useRef<HTMLDivElement>(null);
  const paramsString = searchParams.toString();

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [paramsString]);

  useEffect(() => {
    const fetchEscorts = async () => {
      try {
        setLoading(true);
        const search = searchParams.get('search') || '';
        const city = searchParams.get('city') || '';
        const district = searchParams.get('district') || '';
        const gender = searchParams.get('gender') || '';
        const featured = searchParams.get('featured') || '';
        const gold = searchParams.get('gold') || '';
        const silver = searchParams.get('silver') || '';
        const top = searchParams.get('top') || '';
        const newFilter = searchParams.get('new') || '';
        const verifiedPhotos = searchParams.get('verifiedPhotos') || '';
        const online = searchParams.get('online') || '';

        // Fetch all escorts with filters
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (city) params.append('city', city);
        if (district) params.append('district', district);
        if (gender) params.append('gender', gender);
        if (featured) params.append('featured', featured);
        if (gold) params.append('gold', gold);
        if (silver) params.append('silver', silver);
        if (top) params.append('top', top);
        if (newFilter) params.append('new', newFilter);
        if (verifiedPhotos) params.append('verifiedPhotos', verifiedPhotos);
        if (online) params.append('online', online);
        const pageSize = parseInt(process.env.NEXT_PUBLIC_ESCORTS_LIMIT || '20');
        params.append('limit', pageSize.toString());

        const allRes = await fetch(`/api/escorts?${params.toString()}&offset=${(currentPage - 1) * pageSize}`);
        if (allRes.ok) {
          const data = await allRes.json();
          setEscorts(data.escorts);
          setPagination(data.pagination);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching escorts:', err);
        setError('Failed to load escorts');
      } finally {
        setLoading(false);
      }
    };

    fetchEscorts();
  }, [searchParams.toString(), currentPage]);

  // Poll for online status updates
  useEffect(() => {
    if (escorts.length === 0) return;

    const updateStatuses = async () => {
      try {
        const userIds = escorts.map(e => e.id);
        const res = await fetch('/api/escorts/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userIds }),
        });

        if (res.ok) {
          const { statuses } = await res.json();
          setEscorts(prev => prev.map(escort => {
            if (statuses[escort.id] !== undefined) {
              return {
                ...escort,
                lastActive: statuses[escort.id],
                // Update isOnline based on new lastActive
                isOnline: new Date(statuses[escort.id]).getTime() > Date.now() - 30000
              } as Escort;
            }
            return escort;
          }));
        }
      } catch (error) {
        console.error('Error updating statuses:', error);
      }
    };

    // Initial update after mount/escorts change
    updateStatuses();

    // Poll every 30 seconds
    const interval = setInterval(updateStatuses, 30000);
    return () => clearInterval(interval);
  }, [escorts.map(e => e.id).join(',')]);

  // Scroll to top of grid when page changes
  useEffect(() => {
    if (gridTopRef.current && !loading) {
      const offset = 100; // Offset to account for header
      const top = gridTopRef.current.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [currentPage]);

  return (
    <div className="space-y-6">
      {/* All Escorts */}
      <div ref={gridTopRef}>
        <h3 className="text-lg font-bold mb-4 text-gray-900">All Escorts</h3>
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        ) : escorts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No escorts found
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {escorts.map((escort) => (
              <ProfileCard
                key={escort.id}
                profile={{
                  id: escort.id,
                  slug: escort.slug,
                  name: escort.name,
                  city: escort.city,
                  district: escort.district,
                  isGold: escort.isGold,
                  isSilver: escort.isSilver,
                  isTop: escort.isTop,
                  isNew: escort.isNew,
                  verifiedPhotos: escort.verifiedPhotos,
                  isOnline: (escort as any).isOnline,
                  lastActive: (escort as any).lastActive,
                  languages: escort.languages,
                  coverImage: escort.coverImage || (escort.images as any)?.[0]?.url,
                  imageWidth: (escort.images as any)?.[0]?.width,
                  imageHeight: (escort.images as any)?.[0]?.height,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-10 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Info */}
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{Math.min((currentPage - 1) * parseInt(process.env.NEXT_PUBLIC_ESCORTS_LIMIT || '20') + 1, pagination.total)}</span> to{' '}
              <span className="font-semibold text-gray-900">{Math.min(currentPage * parseInt(process.env.NEXT_PUBLIC_ESCORTS_LIMIT || '20'), pagination.total)}</span> of{' '}
              <span className="font-semibold text-gray-900">{pagination.total}</span> escorts
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide max-w-full justify-center">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={!pagination.hasPreviousPage}
                className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition shrink-0"
                aria-label="Previous page"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-1 items-center">
                {(() => {
                  const pages = [];
                  const totalPages = pagination.totalPages;
                  const delta = 1; // Number of pages to show around current page

                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 || // Always show first
                      i === totalPages || // Always show last
                      (i >= currentPage - delta && i <= currentPage + delta) // Show window around current
                    ) {
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium transition shrink-0 ${i === currentPage
                            ? 'bg-red-600 text-white shadow-md'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-red-300 hover:text-red-600'
                            }`}
                          aria-current={i === currentPage ? 'page' : undefined}
                        >
                          {i}
                        </button>
                      );
                    } else if (
                      i === currentPage - delta - 1 ||
                      i === currentPage + delta + 1
                    ) {
                      pages.push(
                        <span key={i} className="px-1 text-gray-400">...</span>
                      );
                    }
                  }
                  return pages;
                })()}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition shrink-0"
                aria-label="Next page"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
