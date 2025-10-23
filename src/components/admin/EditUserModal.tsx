'use client';

import { useState } from 'react';
import { Crown, Star } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string;
  role: 'user' | 'escort' | 'admin';
  status: 'private' | 'public' | 'suspended' | 'pending';
  statusMessage: string | null;
  isVip: boolean;
  isFeatured: boolean;
  isVipElite: boolean;
  vipExpiresAt: string | null;
  featuredExpiresAt: string | null;
  vipEliteExpiresAt: string | null;
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
    isVip: user.isVip,
    isFeatured: user.isFeatured,
    isVipElite: user.isVipElite,
    vipExpiresAt: user.vipExpiresAt ? new Date(user.vipExpiresAt).toISOString().split('T')[0] : '',
    featuredExpiresAt: user.featuredExpiresAt ? new Date(user.featuredExpiresAt).toISOString().split('T')[0] : '',
    vipEliteExpiresAt: user.vipEliteExpiresAt ? new Date(user.vipEliteExpiresAt).toISOString().split('T')[0] : '',
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: Partial<User> = {
        role: data.role,
        status: data.status,
        statusMessage: data.statusMessage,
        isVip: data.isVip,
        isFeatured: data.isFeatured,
        isVipElite: data.isVipElite,
      };

      if (data.vipExpiresAt) updates.vipExpiresAt = new Date(data.vipExpiresAt + 'T23:59:59').toISOString();
      if (data.featuredExpiresAt) updates.featuredExpiresAt = new Date(data.featuredExpiresAt + 'T23:59:59').toISOString();
      if (data.vipEliteExpiresAt) updates.vipEliteExpiresAt = new Date(data.vipEliteExpiresAt + 'T23:59:59').toISOString();

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
                onChange={(e) => setData({...data, status: e.target.value as any})} 
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="private" className="text-gray-900">Private</option>
                <option value="public" className="text-gray-900">Public</option>
                <option value="pending" className="text-gray-900">Pending</option>
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
              onChange={(e) => setData({...data, statusMessage: e.target.value})} 
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
              {/* VIP */}
              <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={data.isVip} 
                  onChange={(e) => setData({...data, isVip: e.target.checked})} 
                  className="w-4 h-4 text-purple-600"
                />
                <label className="flex-1 font-medium text-purple-900">VIP</label>
                <input 
                  type="date" 
                  value={data.vipExpiresAt} 
                  onChange={(e) => setData({...data, vipExpiresAt: e.target.value})} 
                  className="px-3 py-1 text-gray-900 bg-white border border-purple-300 rounded text-sm"
                  placeholder="Expiry date"
                />
              </div>

              {/* FEATURED */}
              <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={data.isFeatured} 
                  onChange={(e) => setData({...data, isFeatured: e.target.checked})} 
                  className="w-4 h-4 text-blue-600"
                />
                <label className="flex-1 font-medium text-blue-900">FEATURED</label>
                <input 
                  type="date" 
                  value={data.featuredExpiresAt} 
                  onChange={(e) => setData({...data, featuredExpiresAt: e.target.value})} 
                  className="px-3 py-1 text-gray-900 bg-white border border-blue-300 rounded text-sm"
                  placeholder="Expiry date"
                />
              </div>

              {/* VIP Elite */}
              <div className="flex items-center gap-4 p-3 bg-yellow-50 rounded-lg">
                <input 
                  type="checkbox" 
                  checked={data.isVipElite} 
                  onChange={(e) => setData({...data, isVipElite: e.target.checked})} 
                  className="w-4 h-4 text-yellow-600"
                />
                <label className="flex-1 font-medium text-yellow-900">VIP Elite</label>
                <input 
                  type="date" 
                  value={data.vipEliteExpiresAt} 
                  onChange={(e) => setData({...data, vipEliteExpiresAt: e.target.value})} 
                  className="px-3 py-1 text-gray-900 bg-white border border-yellow-300 rounded text-sm"
                  placeholder="Expiry date"
                />
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
