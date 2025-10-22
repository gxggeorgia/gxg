'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, Filter, Edit, Ban, CheckCircle, XCircle, Crown, Star } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string;
  role: 'user' | 'escort' | 'admin';
  status: 'private' | 'public' | 'suspended' | 'pending';
  statusMessage: string | null;
  isVip: boolean;
  isTop: boolean;
  isVipElite: boolean;
  vipExpiresAt: string | null;
  topExpiresAt: string | null;
  vipEliteExpiresAt: string | null;
  city: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Map<string, any>>(new Map());
  const [editingUser, setEditingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        if (response.status === 403) {
          router.push('/');
          return;
        }
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (userId: string, field: string, value: any) => {
    const newChanges = new Map(pendingChanges);
    const userChanges = newChanges.get(userId) || {};
    userChanges[field] = value;
    newChanges.set(userId, userChanges);
    setPendingChanges(newChanges);
    setEditingUser(userId);
  };

  const saveUserChanges = async (userId: string) => {
    const updates = pendingChanges.get(userId);
    if (!updates || Object.keys(updates).length === 0) return;

    try {
      setUpdatingUser(userId);
      const response = await fetch('/api/admin/users/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates }),
      });

      if (response.ok) {
        await fetchUsers();
        const newChanges = new Map(pendingChanges);
        newChanges.delete(userId);
        setPendingChanges(newChanges);
        setEditingUser(null);
        setSuccessMessage('Updated successfully!');
        setTimeout(() => setSuccessMessage(null), 2000);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setSuccessMessage('Error updating user');
      setTimeout(() => setSuccessMessage(null), 2000);
    } finally {
      setUpdatingUser(null);
    }
  };

  const cancelUserChanges = (userId: string) => {
    const newChanges = new Map(pendingChanges);
    newChanges.delete(userId);
    setPendingChanges(newChanges);
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-600" />
            Admin Panel
          </h1>
          <p className="text-gray-600 mt-2">Manage users, profiles, and subscriptions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, name, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all" className="bg-white text-gray-900">All Statuses</option>
              <option value="private" className="bg-white text-gray-900">Private</option>
              <option value="public" className="bg-white text-gray-900">Public</option>
              <option value="pending" className="bg-white text-gray-900">Pending</option>
              <option value="suspended" className="bg-white text-gray-900">Suspended</option>
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all" className="bg-white text-gray-900">All Roles</option>
              <option value="user" className="bg-white text-gray-900">User</option>
              <option value="escort" className="bg-white text-gray-900">Escort</option>
              <option value="admin" className="bg-white text-gray-900">Admin</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Total Users</div>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Public Profiles</div>
            <div className="text-2xl font-bold text-green-600">
              {users.filter(u => u.status === 'public').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">VIP Members</div>
            <div className="text-2xl font-bold text-purple-600">
              {users.filter(u => u.isVip || u.isTop || u.isVipElite).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-sm text-gray-600">Suspended</div>
            <div className="text-2xl font-bold text-red-600">
              {users.filter(u => u.status === 'suspended').length}
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <span className="text-purple-600" title="Premium membership">VIP</span>
                      <span className="text-blue-600" title="Featured in top listings">TOP</span>
                      <span className="text-yellow-600" title="Highest tier membership">ELITE</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={`hover:bg-gray-50 transition ${updatingUser === user.id ? 'bg-purple-50 animate-pulse' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'No name'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pendingChanges.get(user.id)?.role ?? user.role}
                        onChange={(e) => handleFieldChange(user.id, 'role', e.target.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border-2 cursor-pointer ${
                          user.role === 'admin' ? 'bg-red-50 text-red-800 border-red-200' :
                          user.role === 'escort' ? 'bg-purple-50 text-purple-800 border-purple-200' :
                          'bg-gray-50 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="user" className="bg-white text-gray-900">User</option>
                        <option value="escort" className="bg-white text-gray-900">Escort</option>
                        <option value="admin" className="bg-white text-gray-900">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pendingChanges.get(user.id)?.status ?? user.status}
                        onChange={(e) => handleFieldChange(user.id, 'status', e.target.value)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full border-2 cursor-pointer ${
                          user.status === 'public' ? 'bg-green-50 text-green-800 border-green-200' :
                          user.status === 'suspended' ? 'bg-red-50 text-red-800 border-red-200' :
                          user.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                          'bg-gray-50 text-gray-800 border-gray-200'
                        }`}
                      >
                        <option value="private" className="bg-white text-gray-900">Private</option>
                        <option value="public" className="bg-white text-gray-900">Public</option>
                        <option value="pending" className="bg-white text-gray-900">Pending</option>
                        <option value="suspended" className="bg-white text-gray-900">Suspended</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {editingMessage === user.id ? (
                        <input
                          type="text"
                          value={messageText}
                          onChange={(e) => {
                            setMessageText(e.target.value);
                            handleFieldChange(user.id, 'statusMessage', e.target.value);
                          }}
                          onBlur={() => setEditingMessage(null)}
                          autoFocus
                          className="w-full px-2 py-1 text-sm text-gray-900 bg-white border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                          placeholder="Status message..."
                        />
                      ) : (
                        <div 
                          className="text-sm text-gray-700 cursor-pointer hover:text-purple-600 hover:underline max-w-xs truncate"
                          onClick={() => {
                            setEditingMessage(user.id);
                            setMessageText((pendingChanges.get(user.id)?.statusMessage ?? user.statusMessage) || '');
                          }}
                          title={(pendingChanges.get(user.id)?.statusMessage ?? user.statusMessage) || 'Click to edit'}
                        >
                          {(pendingChanges.get(user.id)?.statusMessage ?? user.statusMessage) || <span className="text-gray-400 italic">No message - Click to add</span>}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleFieldChange(user.id, 'isVip', !(pendingChanges.get(user.id)?.isVip ?? user.isVip))}
                          className={`p-1 rounded ${(pendingChanges.get(user.id)?.isVip ?? user.isVip) ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}
                          title="VIP"
                        >
                          <Crown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFieldChange(user.id, 'isTop', !(pendingChanges.get(user.id)?.isTop ?? user.isTop))}
                          className={`p-1 rounded ${(pendingChanges.get(user.id)?.isTop ?? user.isTop) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}
                          title="TOP"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleFieldChange(user.id, 'isVipElite', !(pendingChanges.get(user.id)?.isVipElite ?? user.isVipElite))}
                          className={`p-1 rounded ${(pendingChanges.get(user.id)?.isVipElite ?? user.isVipElite) ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}
                          title="VIP Elite"
                        >
                          <Crown className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {pendingChanges.has(user.id) ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveUserChanges(user.id)}
                            disabled={updatingUser === user.id}
                            className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 disabled:opacity-50"
                          >
                            {updatingUser === user.id ? 'Saving...' : 'Save'}
                          </button>
                          <button
                            onClick={() => cancelUserChanges(user.id)}
                            disabled={updatingUser === user.id}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No changes</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
