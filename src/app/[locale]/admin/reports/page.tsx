'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { FileText, AlertTriangle } from 'lucide-react';

export default function ReportsPage() {
  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-600" />
              Reports
            </h1>
            <p className="text-gray-600 mt-2">Manage user reports and flagged content</p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">No Reports</h2>
                  <p className="text-sm text-gray-600">There are currently no user reports to review.</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm">
                User reports will appear here when users flag inappropriate content or profiles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
