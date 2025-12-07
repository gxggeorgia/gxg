'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { Users, FileText, MessageSquare, BarChart3, Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: Users, label: 'Users', path: '/admin', description: 'Manage users and profiles' },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics', description: 'View statistics' },
    { icon: FileText, label: 'Reports', path: '/admin/reports', description: 'User reports and flags' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return pathname === '/admin' || pathname.match(/^\/[a-z]{2}\/admin$/);
    }
    return pathname.includes(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-[60] pt-16
        w-64 bg-white border-r border-gray-200 shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:top-16'}
      `}>
        <div className="h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-start gap-3 px-4 py-3 rounded-lg transition
                    ${active
                      ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${active ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="text-left">
                    <div className={`font-medium ${active ? 'text-purple-700' : 'text-gray-900'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => router.push('/')}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition"
            >
              ← Back to Site
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-40">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        {/* Content */}
        <main className="flex-1 overflow-hidden pt-16 lg:pt-20">
          {children}
        </main>
      </div>
    </div>
  );
}
