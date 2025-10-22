'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { BarChart3, Users, TrendingUp, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-purple-600" />
              Analytics
            </h1>
            <p className="text-gray-600 mt-2">View platform statistics and insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-green-600 font-semibold">+12%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">1,234</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <span className="text-sm text-green-600 font-semibold">+8%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">567</div>
              <div className="text-sm text-gray-600">Active Profiles</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-purple-600" />
                <span className="text-sm text-green-600 font-semibold">+15%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">89</div>
              <div className="text-sm text-gray-600">Premium Members</div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600" />
                <span className="text-sm text-red-600 font-semibold">-3%</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">23</div>
              <div className="text-sm text-gray-600">Pending Reviews</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              Detailed analytics charts and reports will be available here.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
