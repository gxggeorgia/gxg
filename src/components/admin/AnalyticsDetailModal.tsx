import { useMemo } from 'react';
import { TrendingUp, Eye, MousePointer, X } from 'lucide-react';

interface AnalyticsDetailModalProps {
    profileId: string;
    data: any;
    onClose: () => void;
    dateRangeLabel: string;
}

export default function AnalyticsDetailModal({ profileId, data, onClose, dateRangeLabel }: AnalyticsDetailModalProps) {
    const profile = useMemo(() => {
        return data.users.find((u: any) => u.id === profileId);
    }, [data.users, profileId]);

    const stats = useMemo(() => {
        // Filter relevant data
        const views = data.views.filter((v: any) => v.profileId === profileId);
        const interactions = data.interactions.filter((i: any) => i.profileId === profileId);

        // Calculate totals
        const totalViews = views.length;
        const totalInteractions = interactions.length;

        // Time Helpers
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const isToday = (d: Date) => d >= startOfDay;
        const isThisWeek = (d: Date) => d >= startOfWeek;
        const isThisMonth = (d: Date) => d >= startOfMonth;

        // Interaction Breakdown Matrix
        // Structure: { type: { today: 0, week: 0, month: 0, total: 0 } }
        const matrix: Record<string, { today: number, week: number, month: number, total: number }> = {};

        interactions.forEach((i: any) => {
            const type = i.type || 'unknown';
            const date = new Date(i.interactedAt);

            if (!matrix[type]) {
                matrix[type] = { today: 0, week: 0, month: 0, total: 0 };
            }

            matrix[type].total++;
            if (isThisMonth(date)) matrix[type].month++;
            if (isThisWeek(date)) matrix[type].week++;
            if (isToday(date)) matrix[type].today++;
        });

        return {
            totalViews,
            totalInteractions,
            matrix
        };
    }, [data, profileId]);

    if (!profile) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50 flex-none relative">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Analytics: {profile.name}</h2>
                        <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>

                    {/* Centered Date Range Label */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wide border border-purple-200 shadow-sm">
                            {dateRangeLabel}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors z-10"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <Eye className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-blue-900">Total Views</span>
                            </div>
                            <div className="text-3xl font-bold text-blue-900 pl-1">{stats.totalViews}</div>
                        </div>

                        <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <MousePointer className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm font-medium text-green-900">Total Interactions</span>
                            </div>
                            <div className="text-3xl font-bold text-green-900 pl-1">{stats.totalInteractions}</div>
                        </div>

                        <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                </div>
                                <span className="text-sm font-medium text-purple-900">Interaction Rate</span>
                            </div>
                            <div className="text-3xl font-bold text-purple-900 pl-1">
                                {stats.totalViews > 0
                                    ? `${((stats.totalInteractions / stats.totalViews) * 100).toFixed(1)}%`
                                    : '0%'}
                            </div>
                        </div>
                    </div>

                    {/* Interaction Breakdown Matrix */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                Platform Performance Breakdown
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                        <th className="px-6 py-4">Platform</th>
                                        <th className="px-6 py-4 text-center bg-gray-50/50">Today</th>
                                        {dateRangeLabel !== 'Today' && (
                                            <th className="px-6 py-4 text-center">Last 7 Days</th>
                                        )}
                                        {dateRangeLabel !== 'Today' && dateRangeLabel !== 'Last 7 Days' && (
                                            <th className="px-6 py-4 text-center bg-gray-50/50">Last 30 Days</th>
                                        )}
                                        <th className="px-6 py-4 text-center font-bold text-gray-900">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {Object.entries(stats.matrix).length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={
                                                    2 + // Platform + Today
                                                    (dateRangeLabel !== 'Today' ? 1 : 0) + // Last 7 Days
                                                    (dateRangeLabel !== 'Today' && dateRangeLabel !== 'Last 7 Days' ? 1 : 0) + // Last 30 Days
                                                    1 // Total
                                                }
                                                className="px-6 py-8 text-center text-gray-500"
                                            >
                                                No interactions recorded yet
                                            </td>
                                        </tr>
                                    ) : (
                                        Object.entries(stats.matrix)
                                            .sort(([, a], [, b]) => b.total - a.total)
                                            .map(([type, counts]) => (
                                                <tr key={type} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`w-2 h-2 rounded-full 
                                                    ${type === 'whatsapp' ? 'bg-green-500' :
                                                                    type === 'phone' ? 'bg-blue-500' :
                                                                        type === 'viber' ? 'bg-purple-500' : 'bg-gray-400'
                                                                }`}
                                                            />
                                                            <span className="font-medium text-gray-900 capitalize">{type}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center bg-gray-50/50 font-mono text-sm text-gray-600">
                                                        {counts.today > 0 ? <span className="text-green-600 font-bold">+{counts.today}</span> : '-'}
                                                    </td>
                                                    {dateRangeLabel !== 'Today' && (
                                                        <td className="px-6 py-4 text-center font-mono text-sm text-gray-600">
                                                            {counts.week}
                                                        </td>
                                                    )}
                                                    {dateRangeLabel !== 'Today' && dateRangeLabel !== 'Last 7 Days' && (
                                                        <td className="px-6 py-4 text-center bg-gray-50/50 font-mono text-sm text-gray-600">
                                                            {counts.month}
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 text-center font-bold text-gray-900">
                                                        {counts.total}
                                                    </td>
                                                </tr>
                                            ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
