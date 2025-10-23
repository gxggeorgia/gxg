'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileCard from './ProfileCard';

interface Escort {
  id: string;
  slug: string;
  name: string;
  city: string;
  isFeatured: boolean;
  isVip: boolean;
  isVipElite: boolean;
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

interface Profile {
  id: string;
  slug: string;
  name: string;
  city: string;
  isVip: boolean;
  isVipElite: boolean;
  isVerified: boolean;
  isOnline: boolean;
  languages?: Array<{ name: string; level: string }>;
  coverImage?: string;
  imageWidth?: number;
  imageHeight?: number;
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

  const handleFilterChange = (type: string, value: string | number | boolean) => {
    // implement filter change logic here
  };

  const handleSort = (key: string) => {
    // implement sort logic here
  };

  useEffect(() => {
    const fetchEscorts = async () => {
      try {
        setLoading(true);
        const search = searchParams.get('search') || '';
        const city = searchParams.get('city') || '';
        const district = searchParams.get('district') || '';
        const gender = searchParams.get('gender') || '';
        const featured = searchParams.get('featured') || '';
        const vip = searchParams.get('vip') || '';
        const vipElite = searchParams.get('vipElite') || '';

        // Fetch all escorts with filters
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (city) params.append('city', city);
        if (district) params.append('district', district);
        if (gender) params.append('gender', gender);
        if (featured) params.append('featured', featured);
        if (vip) params.append('vip', vip);
        if (vipElite) params.append('vipElite', vipElite);
        const pageSize = 10;
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

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-bold mb-4 text-gray-900">All Escorts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
              <div className="relative w-full bg-gray-200" style={{ aspectRatio: '3/4' }}>
                <div className="absolute top-2 left-2 h-5 w-16 bg-gray-300 rounded"></div>
                <div className="absolute top-2 right-2 h-6 w-20 bg-gray-300 rounded"></div>
                <div className="absolute bottom-2 left-2 h-6 w-16 bg-gray-300 rounded-full"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-gray-300 rounded-full"></div>
              </div>
              <div className="p-2.5 space-y-1.5">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* All Escorts */}
      <div>
        <h3 className="text-lg font-bold mb-4 text-gray-900">All Escorts</h3>
        {escorts.length === 0 ? (
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
                  isVip: escort.isVip,
                  isVipElite: escort.isVipElite,
                  isVerified: (escort as any).isVerified || true,
                  isOnline: (escort as any).isOnline || true,
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
              Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * 10 + 1}</span> to{' '}
              <span className="font-semibold text-gray-900">{Math.min(currentPage * 10, pagination.total)}</span> of{' '}
              <span className="font-semibold text-gray-900">{pagination.total}</span> escorts
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={!pagination.hasPreviousPage}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
                aria-label="Previous page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition ${
                      page === currentPage
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-purple-300 hover:text-purple-600'
                    }`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={!pagination.hasNextPage}
                className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
                aria-label="Next page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
