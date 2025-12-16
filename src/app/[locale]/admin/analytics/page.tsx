'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart3, Users, TrendingUp, Eye, MousePointer, Search, Filter } from 'lucide-react';
import AnalyticsDetailModal from '@/components/admin/AnalyticsDetailModal';

interface AnalyticsData {
  views: any[];
  interactions: any[];
  users: any[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('month');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = useMemo(() => {
    if (!data) return null;

    // 1. Global Stats
    const totalViews = data.views.length;
    const totalInteractions = data.interactions.length;
    const totalUsers = data.users.length;
    const activeProfiles = data.users.filter((u: any) => u.publicExpiry && new Date(u.publicExpiry) > new Date()).length;

    // 2. Interaction Breakdown (for Chart)
    const interactionsByType: Record<string, number> = {};
    data.interactions.forEach((i: any) => {
      interactionsByType[i.type] = (interactionsByType[i.type] || 0) + 1;
    });

    // 3. Top Profiles (for Top Section Table)
    // We need map of profileId -> basic stats
    const profileStatsMap: Record<string, { name: string, views: number, interactions: number }> = {};

    // Initialize with users to ensure we have names
    data.users.forEach((u: any) => {
      profileStatsMap[u.id] = { name: u.name || 'Unknown', views: 0, interactions: 0 };
    });

    // Count views
    data.views.forEach((v: any) => {
      if (profileStatsMap[v.profileId]) profileStatsMap[v.profileId].views++;
    });

    // Count interactions
    data.interactions.forEach((i: any) => {
      if (profileStatsMap[i.profileId]) profileStatsMap[i.profileId].interactions++;
    });

    const sortedProfiles = Object.values(profileStatsMap).sort((a, b) => b.views - a.views);
    const topProfiles = sortedProfiles.slice(0, 5);


    // 4. Bottom Profile List (Searchable and Full)
    // We already have profileStatsMap, let's convert it to array and filter
    const allProfilesWithStats = data.users.map((u: any) => {
      const stats = profileStatsMap[u.id] || { views: 0, interactions: 0 };
      return {
        ...u,
        totalViews: stats.views,
        totalInteractions: stats.interactions,
        interactionRate: stats.views > 0 ? (stats.interactions / stats.views) * 100 : 0
      };
    }).sort((a: any, b: any) => b.totalViews - a.totalViews);

    const filteredProfileList = allProfilesWithStats.filter((p: any) =>
    (p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return {
      totalViews,
      totalInteractions,
      totalUsers,
      activeProfiles,
      interactionsByType,
      topProfiles,
      filteredProfileList
    };
  }, [data, searchTerm]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-purple-600" />
                Analytics Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              {(['today', 'week', 'month', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${timeRange === range
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {dashboardStats && (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{dashboardStats.totalViews}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Profile Views</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <MousePointer className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{dashboardStats.totalInteractions}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Interactions</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{dashboardStats.totalUsers}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Users</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{dashboardStats.activeProfiles}</div>
                  <div className="text-sm text-gray-600 mt-1">Active Profiles</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Interactions Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Interactions by Type</h3>
                  <div className="space-y-4">
                    {Object.entries(dashboardStats.interactionsByType)
                      .sort(([, a], [, b]) => b - a)
                      .map(([type, count]) => (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 capitalize">{type}</span>
                            <span className="text-gray-500">{count} ({Math.round(count / dashboardStats.totalInteractions * 100)}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${(count / dashboardStats.totalInteractions) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    {Object.keys(dashboardStats.interactionsByType).length === 0 && (
                      <div className="text-center text-gray-500 py-4">No interactions yet</div>
                    )}
                  </div>
                </div>

                {/* Top Profiles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Profiles</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-3 text-sm font-semibold text-gray-500">Profile Name</th>
                          <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Views</th>
                          <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Interactions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {dashboardStats.topProfiles.map((profile: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 text-sm font-medium text-gray-900">{profile.name}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{profile.views}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{profile.interactions}</td>
                          </tr>
                        ))}
                        {dashboardStats.topProfiles.length === 0 && (
                          <tr><td colSpan={3} className="py-4 text-center text-gray-500">No data available</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Profile Analytics List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-500" />
                    Profile Analytics
                  </h3>
                  {/* Search for Profile List */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800 w-4 h-4 " />
                    <input
                      type="text"
                      placeholder="Search user..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="text-black pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm w-full md:w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr className="text-xs text-gray-500 uppercase tracking-wider">
                        <th className="px-6 py-3 font-medium">Profile Name</th>
                        <th className="px-6 py-3 font-medium">Email</th>
                        <th className="px-6 py-3 font-medium text-right">Views</th>
                        <th className="px-6 py-3 font-medium text-right">Interactions</th>
                        <th className="px-6 py-3 font-medium text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dashboardStats.filteredProfileList.map((profile: any) => (
                        <tr key={profile.id} className="hover:bg-blue-50/50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{profile.name || 'Unknown'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{profile.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                            {profile.totalViews}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                            {profile.totalInteractions}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <button
                              onClick={() => setSelectedProfileId(profile.id)}
                              className="text-purple-600 hover:text-purple-900 font-medium hover:underline cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                      {dashboardStats.filteredProfileList.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            No profiles found matching "{searchTerm}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* Modal Implementation */}
          {selectedProfileId && data && <AnalyticsDetailModal
            profileId={selectedProfileId}
            data={data}
            onClose={() => setSelectedProfileId(null)}
            dateRangeLabel={
              timeRange === 'week' ? 'Last 7 Days' :
                timeRange === 'month' ? 'Last 30 Days' :
                  timeRange === 'all' ? 'All Time' : 'Today'
            }
          />
          }

        </div>
      </div>
    </AdminLayout>
  );
}
