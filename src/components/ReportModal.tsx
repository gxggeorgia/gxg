'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, AlertTriangle } from 'lucide-react';
import Captcha from './Captcha';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  profileUrl: string;
  profileName: string;
}

export default function ReportModal({ isOpen, onClose, profileId, profileUrl, profileName }: ReportModalProps) {
  const t = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string>('');

  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    reporterName: '',
    reporterEmail: '',
  });

  const reasons = [
    { value: 'fake_profile', label: 'Fake Profile' },
    { value: 'inappropriate_content', label: 'Inappropriate Content' },
    { value: 'scam', label: 'Scam / Fraud' },
    { value: 'underage', label: 'Underage Person' },
    { value: 'spam', label: 'Spam' },
    { value: 'other', label: 'Other' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.reason) {
      setError('Please select a reason');
      return;
    }

    if (!turnstileToken) {
      setError('Please complete the captcha');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId,
          profileUrl,
          reason: formData.reason,
          description: formData.description,
          reporterName: formData.reporterName,
          reporterEmail: formData.reporterEmail,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit report');
      }

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({ reason: '', description: '', reporterName: '', reporterEmail: '' });
        setTurnstileToken('');
      }, 2000);
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-black">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Report Profile</h2>
              <p className="text-sm text-gray-500">{profileName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            disabled={isSubmitting}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Submitted</h3>
              <p className="text-gray-600">Thank you for helping us maintain a safe community.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Reason */}
              <div>
                <label htmlFor="report-reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Report <span className="text-red-500">*</span>
                </label>
                <select
                  id="report-reason"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a reason</option>
                  {reasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Details
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  placeholder="Please provide more details about your report..."
                />
              </div>

              {/* Reporter Name (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              {/* Reporter Email (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.reporterEmail}
                  onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We may contact you for more information
                </p>
              </div>

              {/* Captcha */}
              <div className="flex justify-center">
                <Captcha onSuccess={(token) => setTurnstileToken(token)} />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-2 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !turnstileToken}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
