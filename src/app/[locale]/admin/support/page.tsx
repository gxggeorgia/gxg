'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { MessageSquare, Inbox } from 'lucide-react';

export default function SupportPage() {
  return (
    <AdminLayout>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-purple-600" />
              Support
            </h1>
            <p className="text-gray-600 mt-2">Manage support tickets and user inquiries</p>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <Inbox className="w-6 h-6 text-blue-600" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">No Support Tickets</h2>
                  <p className="text-sm text-gray-600">All caught up! No pending support tickets.</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-600 text-sm">
                Support tickets from users will appear here. You can respond and manage them from this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
