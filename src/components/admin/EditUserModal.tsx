'use client';

import { useState } from 'react';
import { Crown, Star, X, Key } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string;
  role: 'escort' | 'admin';
  publicExpiry: string | null;
  goldExpiresAt: string | null;
  featuredExpiresAt: string | null;
  silverExpiresAt: string | null;
  verifiedPhotosExpiry: string | null;
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (updates: any) => Promise<void>;
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    role: user.role,
    publicExpiry: user.publicExpiry ? new Date(user.publicExpiry).toISOString().split('T')[0] : '',
    goldExpiresAt: user.goldExpiresAt ? new Date(user.goldExpiresAt).toISOString().split('T')[0] : '',
    featuredExpiresAt: user.featuredExpiresAt ? new Date(user.featuredExpiresAt).toISOString().split('T')[0] : '',
    silverExpiresAt: user.silverExpiresAt ? new Date(user.silverExpiresAt).toISOString().split('T')[0] : '',
    verifiedPhotosExpiry: user.verifiedPhotosExpiry ? new Date(user.verifiedPhotosExpiry).toISOString().split('T')[0] : '',
    password: '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Partial<User> = {
        role: data.role,
      };

      if (data.password) (updates as any).password = data.password;

      if (data.publicExpiry) updates.publicExpiry = new Date(data.publicExpiry + 'T23:59:59').toISOString();
      else updates.publicExpiry = null;

      if (data.goldExpiresAt) updates.goldExpiresAt = new Date(data.goldExpiresAt + 'T23:59:59').toISOString();
      else updates.goldExpiresAt = null;

      if (data.featuredExpiresAt) updates.featuredExpiresAt = new Date(data.featuredExpiresAt + 'T23:59:59').toISOString();
      else updates.featuredExpiresAt = null;

      if (data.silverExpiresAt) updates.silverExpiresAt = new Date(data.silverExpiresAt + 'T23:59:59').toISOString();
      else updates.silverExpiresAt = null;

      if (data.verifiedPhotosExpiry) updates.verifiedPhotosExpiry = new Date(data.verifiedPhotosExpiry + 'T23:59:59').toISOString();
      else updates.verifiedPhotosExpiry = null;

      await onSave(updates);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const isPastDate = (dateStr: string) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-black">
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold">Edit User</span>
          <span className="text-sm text-gray-600">{user.email}</span>
        </div>


        <div className="space-y-4">
          {/* Role and Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={data.role}
                onChange={handleInputChange}
                name="role"
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="escort" className="text-gray-900">Escort</option>
                <option value="admin" className="text-gray-900">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Public Profile Expiry</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={data.publicExpiry}
                  onChange={(e) => setData({ ...data, publicExpiry: e.target.value })}
                  className={`w-full px-3 py-2 text-gray-900 bg-white border rounded-lg focus:ring-2 focus:ring-purple-500 [color-scheme:light] ${isPastDate(data.publicExpiry) ? 'border-amber-500' : 'border-gray-300'}`}
                />
                <button
                  onClick={() => setData({ ...data, publicExpiry: '' })}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  title="Clear date"
                >
                  <X size={20} />
                </button>
              </div>
              {isPastDate(data.publicExpiry) && (
                <p className="text-xs text-amber-600 mt-1">⚠️ Date is in the past</p>
              )}
            </div>
          </div>

          {/* Password Change */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" />
              Security
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Change Password</label>
              <input
                type="password"
                name="password"
                value={(data as any).password || ''}
                onChange={handleInputChange}
                placeholder="Enter new password to change"
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
            </div>
          </div>

          {/* Subscriptions */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              Subscriptions
            </h3>
            <div className="space-y-3">
              {/* Gold */}
              <div className="flex flex-col gap-1 p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <label className="flex-1 font-medium text-yellow-900">Gold Expiry</label>
                  <input
                    type="date"
                    value={data.goldExpiresAt}
                    onChange={(e) => setData({ ...data, goldExpiresAt: e.target.value })}
                    className={`px-3 py-1 text-gray-900 bg-white border rounded text-sm [color-scheme:light] ${isPastDate(data.goldExpiresAt) ? 'border-amber-500' : 'border-yellow-300'}`}
                  />
                  <button
                    onClick={() => setData({ ...data, goldExpiresAt: '' })}
                    className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition"
                    title="Clear date"
                  >
                    <X size={16} />
                  </button>
                </div>
                {isPastDate(data.goldExpiresAt) && (
                  <p className="text-xs text-amber-600 ml-auto mr-8">⚠️ Date is in the past</p>
                )}
              </div>

              {/* FEATURED */}
              <div className="flex flex-col gap-1 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <label className="flex-1 font-medium text-blue-900">Featured Expiry</label>
                  <input
                    type="date"
                    value={data.featuredExpiresAt}
                    onChange={(e) => setData({ ...data, featuredExpiresAt: e.target.value })}
                    className={`px-3 py-1 text-gray-900 bg-white border rounded text-sm [color-scheme:light] ${isPastDate(data.featuredExpiresAt) ? 'border-amber-500' : 'border-blue-300'}`}
                  />
                  <button
                    onClick={() => setData({ ...data, featuredExpiresAt: '' })}
                    className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition"
                    title="Clear date"
                  >
                    <X size={16} />
                  </button>
                </div>
                {isPastDate(data.featuredExpiresAt) && (
                  <p className="text-xs text-amber-600 ml-auto mr-8">⚠️ Date is in the past</p>
                )}
              </div>

              {/* Silver */}
              <div className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <label className="flex-1 font-medium text-gray-900">Silver Expiry</label>
                  <input
                    type="date"
                    value={data.silverExpiresAt}
                    onChange={(e) => setData({ ...data, silverExpiresAt: e.target.value })}
                    className={`px-3 py-1 text-gray-900 bg-white border rounded text-sm [color-scheme:light] ${isPastDate(data.silverExpiresAt) ? 'border-amber-500' : 'border-gray-300'}`}
                  />
                  <button
                    onClick={() => setData({ ...data, silverExpiresAt: '' })}
                    className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition"
                    title="Clear date"
                  >
                    <X size={16} />
                  </button>
                </div>
                {isPastDate(data.silverExpiresAt) && (
                  <p className="text-xs text-amber-600 ml-auto mr-8">⚠️ Date is in the past</p>
                )}
              </div>

              {/* Verified Photos */}
              <div className="flex flex-col gap-1 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <label className="flex-1 font-medium text-green-900">Verified Photos Expiry</label>
                  <input
                    type="date"
                    value={data.verifiedPhotosExpiry}
                    onChange={(e) => setData({ ...data, verifiedPhotosExpiry: e.target.value })}
                    className={`px-3 py-1 text-gray-900 bg-white border rounded text-sm [color-scheme:light] ${isPastDate(data.verifiedPhotosExpiry) ? 'border-amber-500' : 'border-green-300'}`}
                  />
                  <button
                    onClick={() => setData({ ...data, verifiedPhotosExpiry: '' })}
                    className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition"
                    title="Clear date"
                  >
                    <X size={16} />
                  </button>
                </div>
                {isPastDate(data.verifiedPhotosExpiry) && (
                  <p className="text-xs text-amber-600 ml-auto mr-8">⚠️ Date is in the past</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
