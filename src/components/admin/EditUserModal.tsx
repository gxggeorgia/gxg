'use client';

import { useState } from 'react';
import { Crown, Star } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string;
  role: 'user' | 'escort' | 'admin';
  status: 'suspended' | 'pending' | 'verified';
  statusMessage: string | null;
  isGold: boolean;
  isFeatured: boolean;
  isSilver: boolean;
  goldExpiresAt: string | null;
  featuredExpiresAt: string | null;
  silverExpiresAt: string | null;
  verifiedPhotos: boolean;
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
    status: user.status,
    statusMessage: user.statusMessage || '',
    isGold: user.isGold,
    isFeatured: user.isFeatured,
    isSilver: user.isSilver,
    verifiedPhotos: user.verifiedPhotos,
    goldExpiresAt: user.goldExpiresAt ? new Date(user.goldExpiresAt).toISOString().split('T')[0] : '',
    featuredExpiresAt: user.featuredExpiresAt ? new Date(user.featuredExpiresAt).toISOString().split('T')[0] : '',
    silverExpiresAt: user.silverExpiresAt ? new Date(user.silverExpiresAt).toISOString().split('T')[0] : '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Partial<User> = {
        role: data.role,
        status: data.status,
        statusMessage: data.statusMessage,
        isGold: data.isGold,
        isFeatured: data.isFeatured,
        isSilver: data.isSilver,
        verifiedPhotos: data.verifiedPhotos,
      };

      if (data.goldExpiresAt) updates.goldExpiresAt = new Date(data.goldExpiresAt + 'T23:59:59').toISOString();
      if (data.featuredExpiresAt) updates.featuredExpiresAt = new Date(data.featuredExpiresAt + 'T23:59:59').toISOString();
      if (data.silverExpiresAt) updates.silverExpiresAt = new Date(data.silverExpiresAt + 'T23:59:59').toISOString();

      await onSave(updates);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
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
                <option value="user" className="text-gray-900">User</option>
                <option value="escort" className="text-gray-900">Escort</option>
                <option value="admin" className="text-gray-900">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={data.status}
                onChange={(e) => setData({ ...data, status: e.target.value as any })}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="pending" className="text-gray-900">Pending</option>
                <option value="verified" className="text-gray-900">Verified</option>
                <option value="suspended" className="text-gray-900">Suspended</option>
              </select>
            </div>
          </div>

          {/* Status Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status Message</label>
            <input
              type="text"
              value={data.statusMessage}
              onChange={(e) => setData({ ...data, statusMessage: e.target.value })}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Optional status message..."
            />
          </div>

          {/* Subscriptions */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Crown className="w-5 h-5 text-purple-600" />
              Subscriptions
            </h3>
            <div className="space-y-3">
              {/* Gold */}
              <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={data.isGold}
                  onChange={(e) => setData({ ...data, isGold: e.target.checked })}
                  className="w-4 h-4 text-yellow-600"
                />
                <label className="flex-1 font-medium text-yellow-900">Gold</label>
                <input
                  type="date"
                  value={data.goldExpiresAt}
                  onChange={(e) => setData({ ...data, goldExpiresAt: e.target.value })}
                  className="px-3 py-1 text-gray-900 bg-white border border-yellow-300 rounded text-sm"
                  placeholder="Expiry date"
                />
              </div>

              {/* FEATURED */}
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={data.isFeatured}
                  onChange={(e) => setData({ ...data, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
                <label className="flex-1 font-medium text-blue-900">FEATURED</label>
                <input
                  type="date"
                  value={data.featuredExpiresAt}
                  onChange={(e) => setData({ ...data, featuredExpiresAt: e.target.value })}
                  className="px-3 py-1 text-gray-900 bg-white border border-blue-300 rounded text-sm"
                  placeholder="Expiry date"
                />
              </div>

              {/* Silver */}
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={data.isSilver}
                  onChange={(e) => setData({ ...data, isSilver: e.target.checked })}
                  className="w-4 h-4 text-gray-600"
                />
                <label className="flex-1 font-medium text-gray-900">Silver</label>
                <input
                  type="date"
                  value={data.silverExpiresAt}
                  onChange={(e) => setData({ ...data, silverExpiresAt: e.target.value })}
                  className="px-3 py-1 text-gray-900 bg-white border border-gray-300 rounded text-sm"
                  placeholder="Expiry date"
                />
              </div>
              {/* Verified Photos */}
              <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={data.verifiedPhotos}
                  onChange={(e) => setData({ ...data, verifiedPhotos: e.target.checked })}
                  className="w-4 h-4 text-green-600"
                />
                <label className="flex-1 font-medium text-green-900">Verified Photos</label>
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
