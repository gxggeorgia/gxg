'use client';

import { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart3, Users, TrendingUp, DollarSign, Calendar, Filter, ArrowUp, ArrowDown, Eye, MousePointer } from 'lucide-react';

interface AnalyticsData {
  views: any[];
  interactions: any[];
  users: any[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month' | 'all'>('week');
  const [interactionTypeFilter, setInteractionTypeFilter] = useState<string>('all');
  const [profileSearchTerm, setProfileSearchTerm] = useState('');

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

  const filteredData = useMemo(() => {
    if (!data) return null;

    // Data is already filtepurple by time from the API
    const views = data.views;
    const interactions = data.interactions;

    // Calculate stats
    const totalViews = views.length;
    const totalInteractions = interactions.length;
    const totalUsers = data.users.length;
    const activeProfiles = data.users.filter((u: any) => u.publicExpiry && new Date(u.publicExpiry) > new Date()).length;

    // Interactions by Type
    const interactionsByType: Record<string, number> = {};
    interactions.forEach((i: any) => {
      interactionsByType[i.type] = (interactionsByType[i.type] || 0) + 1;
    });

    // Top Profiles
    const profileStats: Record<string, { name: string, views: number, interactions: number }> = {};

    views.forEach((v: any) => {
      if (!profileStats[v.profileId]) {
        const user = data.users.find((u: any) => u.id === v.profileId);
        profileStats[v.profileId] = { name: user?.name || 'Unknown', views: 0, interactions: 0 };
      }
      profileStats[v.profileId].views++;
    });

    interactions.forEach((i: any) => {
      if (!profileStats[i.profileId]) {
        const user = data.users.find((u: any) => u.id === i.profileId);
        profileStats[i.profileId] = { name: user?.name || 'Unknown', views: 0, interactions: 0 };
      }
      profileStats[i.profileId].interactions++;
    });

    const topProfiles = Object.values(profileStats)
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // Chart Data (Daily)
    const dailyStats: Record<string, { date: string, views: number, interactions: number }> = {};

    const processDate = (d: string) => new Date(d).toISOString().split('T')[0];

    views.forEach((v: any) => {
      const date = processDate(v.viewedAt);
      if (!dailyStats[date]) dailyStats[date] = { date, views: 0, interactions: 0 };
      dailyStats[date].views++;
    });

    interactions.forEach((i: any) => {
      const date = processDate(i.interactedAt);
      if (!dailyStats[date]) dailyStats[date] = { date, views: 0, interactions: 0 };
      dailyStats[date].interactions++;
    });

    const chartData = Object.values(dailyStats).sort((a, b) => a.date.localeCompare(b.date));

    return {
      totalViews,
      totalInteractions,
      totalUsers,
      activeProfiles,
      interactionsByType,
      topProfiles,
      chartData,
      interactions: interactions.filter((i: any) => {
        const matchesType = interactionTypeFilter === 'all' || i.type === interactionTypeFilter;
        const user = data.users.find((u: any) => u.id === i.profileId);
        const matchesProfile = !profileSearchTerm ||
          (user?.name?.toLowerCase().includes(profileSearchTerm.toLowerCase()) ||
            user?.email?.toLowerCase().includes(profileSearchTerm.toLowerCase()));
        return matchesType && matchesProfile;
      })
    };
  }, [data, timeRange, interactionTypeFilter, profileSearchTerm]);

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

          {filteredData && (
            <>
              {/* Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Eye className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{filteredData.totalViews}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Profile Views</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <MousePointer className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{filteredData.totalInteractions}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Interactions</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{filteredData.totalUsers}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Users</div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-orange-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{filteredData.activeProfiles}</div>
                  <div className="text-sm text-gray-600 mt-1">Active Profiles</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Interactions Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Interactions by Type</h3>
                  <div className="space-y-4">
                    {Object.entries(filteredData.interactionsByType)
                      .sort(([, a], [, b]) => b - a)
                      .map(([type, count]) => (
                        <div key={type}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700 capitalize">{type}</span>
                            <span className="text-gray-500">{count} ({Math.round(count / filteredData.totalInteractions * 100)}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className="bg-purple-600 h-2.5 rounded-full"
                              style={{ width: `${(count / filteredData.totalInteractions) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    {Object.keys(filteredData.interactionsByType).length === 0 && (
                      <div className="text-center text-gray-500 py-4">No interactions yet</div>
                    )}
                  </div>
                </div>

                {/* Top Profiles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Top Profiles</h3>
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
                        {filteredData.topProfiles.map((profile, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 text-sm font-medium text-gray-900">{profile.name}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{profile.views}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{profile.interactions}</td>
                          </tr>
                        ))}
                        {filteredData.topProfiles.length === 0 && (
                          <tr>
                            <td colSpan={3} className="text-center py-8 text-gray-500">No data available</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Detailed Interaction Log */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Detailed Interaction Log</h3>
                  <div className="flex flex-col md:flex-row gap-3">
                    <select
                      value={interactionTypeFilter}
                      onChange={(e) => setInteractionTypeFilter(e.target.value)}
                      className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="all" className="text-gray-900">All Types</option>
                      <option value="whatsapp" className="text-gray-900">WhatsApp</option>
                      <option value="phone" className="text-gray-900">Phone</option>
                      <option value="viber" className="text-gray-900">Viber</option>
                      <option value="instagram" className="text-gray-900">Instagram</option>
                      <option value="website" className="text-gray-900">Website</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Search profile..."
                      value={profileSearchTerm}
                      onChange={(e) => setProfileSearchTerm(e.target.value)}
                      className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-gray-100">
                        <th className="pb-3 text-sm font-semibold text-gray-500">Type</th>
                        <th className="pb-3 text-sm font-semibold text-gray-500">Profile</th>
                        <th className="pb-3 text-sm font-semibold text-gray-500">Time</th>
                        <th className="pb-3 text-sm font-semibold text-gray-500 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredData.interactions.map((interaction: any, index: number) => {
                        const user = data?.users.find((u: any) => u.id === interaction.profileId);
                        const date = new Date(interaction.interactedAt);

                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="py-3 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                ${interaction.type === 'whatsapp' ? 'bg-green-100 text-green-800' :
                                  interaction.type === 'phone' ? 'bg-blue-100 text-blue-800' :
                                    interaction.type === 'viber' ? 'bg-purple-100 text-purple-800' :
                                      'bg-gray-100 text-gray-800'}`}>
                                {interaction.type}
                              </span>
                            </td>
                            <td className="py-3 text-sm font-medium text-gray-900">
                              {user ? user.name || user.email : 'Unknown Profile'}
                            </td>
                            <td className="py-3 text-sm text-gray-500">
                              {date.toLocaleDateString()} {date.toLocaleTimeString()}
                            </td>
                            <td className="py-3 text-sm text-gray-400 text-right font-mono text-xs">
                              {interaction.interactorIp || 'N/A'}
                            </td>
                          </tr>
                        );
                      })}
                      {filteredData.interactions.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-center py-8 text-gray-500">No interactions found for this period</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
