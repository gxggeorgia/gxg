'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FileText, AlertTriangle, CheckCircle, Clock, XCircle, ExternalLink, Search, Filter, Eye, X } from 'lucide-react';

type Report = {
  id: string;
  profileId: string | null;
  profileUrl: string | null;
  reason: string;
  description: string | null;
  reporterName: string | null;
  reporterEmail: string | null;
  reporterIp: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

const reasonLabels: Record<string, string> = {
  fake_profile: 'Fake Profile',
  inappropriate_content: 'Inappropriate Content',
  scam: 'Scam / Fraud',
  underage: 'Underage Person',
  spam: 'Spam',
  other: 'Other',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="w-5 h-5 text-yellow-600" />,
  reviewed: <CheckCircle className="w-5 h-5 text-blue-600" />,
  resolved: <CheckCircle className="w-5 h-5 text-green-600" />,
  dismissed: <XCircle className="w-5 h-5 text-gray-600" />,
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 border-yellow-200',
  reviewed: 'bg-blue-50 border-blue-200',
  resolved: 'bg-green-50 border-green-200',
  dismissed: 'bg-gray-50 border-gray-200',
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const url = statusFilter === 'all' 
        ? '/api/admin/reports' 
        : `/api/admin/reports?status=${statusFilter}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch reports');
      
      const data = await response.json();
      setReports(data.reports || []);
      setError(null);
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      setUpdatingId(reportId);
      const response = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Failed to update report');
      
      setReports(reports.map(r => 
        r.id === reportId ? { ...r, status: newStatus as any } : r
      ));
    } catch (err) {
      console.error('Error updating report:', err);
      alert('Failed to update report status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredReports = reports.filter(report => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      report.reason.toLowerCase().includes(searchLower) ||
      report.reporterName?.toLowerCase().includes(searchLower) ||
      report.reporterEmail?.toLowerCase().includes(searchLower) ||
      report.description?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      <div className="py-8 text-black">
        <div className="max-w-7xl mx-auto px-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-purple-600" />
              Reports
            </h1>
            <p className="text-gray-600 mt-2">Manage user reports and flagged content</p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="dismissed">Dismissed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Reports List */}
          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredReports.length === 0 ? (
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
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reporter</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className={`${updatingId === report.id ? 'opacity-50' : ''} hover:bg-gray-50 transition`}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {statusIcons[report.status]}
                            <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${
                              report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              report.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                              report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-900">
                            {reasonLabels[report.reason] || report.reason}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm text-gray-600 max-w-xs truncate" title={report.description || ''}>
                            {report.description || '-'}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <div className="text-gray-900">{report.reporterName || 'Anonymous'}</div>
                            {report.reporterEmail && (
                              <div className="text-gray-500 text-xs">{report.reporterEmail}</div>
                            )}
                            <div className="text-gray-400 text-xs">{report.reporterIp}</div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {report.profileUrl ? (
                            <a
                              href={report.profileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 text-sm"
                            >
                              View <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="inline-flex items-center gap-1  underline"
                            title="View Full Details"
                          >
                            <span className="text-sm">Details</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-1">
                            {report.status !== 'pending' && (
                              <button
                                onClick={() => updateReportStatus(report.id, 'pending')}
                                disabled={updatingId === report.id}
                                className="px-2 py-1 text-xs bg-yellow-600 text-white rounded hover:bg-yellow-700 transition disabled:opacity-50"
                                title="Mark Pending"
                              >
                                Pending
                              </button>
                            )}
                            {report.status !== 'reviewed' && (
                              <button
                                onClick={() => updateReportStatus(report.id, 'reviewed')}
                                disabled={updatingId === report.id}
                                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                                title="Mark Reviewed"
                              >
                                Review
                              </button>
                            )}
                            {report.status !== 'resolved' && (
                              <button
                                onClick={() => updateReportStatus(report.id, 'resolved')}
                                disabled={updatingId === report.id}
                                className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
                                title="Mark Resolved"
                              >
                                Resolve
                              </button>
                            )}
                            {report.status !== 'dismissed' && (
                              <button
                                onClick={() => updateReportStatus(report.id, 'dismissed')}
                                disabled={updatingId === report.id}
                                className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 transition disabled:opacity-50"
                                title="Dismiss"
                              >
                                Dismiss
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* View Full Report Modal */}
          {selectedReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                  <div className="flex items-center gap-3">
                    {statusIcons[selectedReport.status]}
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                      <p className="text-sm text-gray-500">{new Date(selectedReport.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded capitalize ${
                        selectedReport.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        selectedReport.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                        selectedReport.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {statusIcons[selectedReport.status]}
                        {selectedReport.status}
                      </span>
                    </div>
                  </div>

                  {/* Reason */}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reason</label>
                    <p className="mt-1 text-base text-gray-900 font-medium">
                      {reasonLabels[selectedReport.reason] || selectedReport.reason}
                    </p>
                  </div>

                  {/* Description */}
                  {selectedReport.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="mt-1 text-base text-gray-900 whitespace-pre-wrap">
                        {selectedReport.description}
                      </p>
                    </div>
                  )}

                  {/* Reporter Information */}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reporter Information</label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Name:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedReport.reporterName || 'Anonymous'}</span>
                      </div>
                      {selectedReport.reporterEmail && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Email:</span>
                          <span className="text-sm font-medium text-gray-900">{selectedReport.reporterEmail}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">IP Address:</span>
                        <span className="text-sm font-medium text-gray-900">{selectedReport.reporterIp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile URL */}
                  {selectedReport.profileUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reported Profile</label>
                      <div className="mt-2">
                        <a
                          href={selectedReport.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                        >
                          View Profile <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div>
                    <label className="text-sm font-medium text-gray-500">Timestamps</label>
                    <div className="mt-2 bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Created:</span>
                        <span className="text-sm font-medium text-gray-900">{new Date(selectedReport.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Updated:</span>
                        <span className="text-sm font-medium text-gray-900">{new Date(selectedReport.updatedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Change Status</label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedReport.status !== 'pending' && (
                        <button
                          onClick={() => {
                            updateReportStatus(selectedReport.id, 'pending');
                            setSelectedReport({ ...selectedReport, status: 'pending' });
                          }}
                          disabled={updatingId === selectedReport.id}
                          className="px-4 py-2 text-sm bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition disabled:opacity-50"
                        >
                          Mark Pending
                        </button>
                      )}
                      {selectedReport.status !== 'reviewed' && (
                        <button
                          onClick={() => {
                            updateReportStatus(selectedReport.id, 'reviewed');
                            setSelectedReport({ ...selectedReport, status: 'reviewed' });
                          }}
                          disabled={updatingId === selectedReport.id}
                          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          Mark Reviewed
                        </button>
                      )}
                      {selectedReport.status !== 'resolved' && (
                        <button
                          onClick={() => {
                            updateReportStatus(selectedReport.id, 'resolved');
                            setSelectedReport({ ...selectedReport, status: 'resolved' });
                          }}
                          disabled={updatingId === selectedReport.id}
                          className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          Mark Resolved
                        </button>
                      )}
                      {selectedReport.status !== 'dismissed' && (
                        <button
                          onClick={() => {
                            updateReportStatus(selectedReport.id, 'dismissed');
                            setSelectedReport({ ...selectedReport, status: 'dismissed' });
                          }}
                          disabled={updatingId === selectedReport.id}
                          className="px-4 py-2 text-sm bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
