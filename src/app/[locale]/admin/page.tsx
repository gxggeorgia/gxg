'use client';

import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { Users, Search, Edit, Crown, Star, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import EditUserModal from '@/components/admin/EditUserModal';

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

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editModalUser, setEditModalUser] = useState<User | null>(null);

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

  const handleSaveUser = async (updates: any) => {
    if (!editModalUser) return;

    const response = await fetch('/api/admin/users/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: editModalUser.id, updates }),
    });

    if (response.ok) {
      await fetchUsers();
      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(null), 2000);
      setEditModalUser(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        await fetchUsers();
        setSuccessMessage('User deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 2000);
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user');
    }
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
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-4 md:py-8">
        <div className="max-w-7xl mx-auto px-3 md:px-4">
          {successMessage && (
            <div className="fixed top-20 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
              {successMessage}
            </div>
          )}

          <div className="mb-3 md:mb-8">
            <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
              <Users className="w-5 h-5 md:w-8 md:h-8 text-purple-600" />
              Admin Panel
            </h1>
            <p className="text-xs md:text-base text-gray-600 mt-1 md:mt-2">Manage users, profiles, and subscriptions</p>
          </div>

          {/* Filters */}
          <div className="sticky top-16 z-30 bg-white rounded-lg shadow-md p-3 md:p-6 mb-3 md:mb-6">
            <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 md:col-span-2 md:gap-4">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg">
                  <option value="all">All Statuses</option>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="suspended">Suspended</option>
                </select>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg">
                  <option value="all">All Roles</option>
                  <option value="user">User</option>
                  <option value="escort">Escort</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 mb-3 md:mb-6">
            <div className="bg-white rounded-lg shadow p-2 md:p-4">
              <div className="text-[10px] md:text-sm text-gray-600">Total</div>
              <div className="text-lg md:text-2xl font-bold text-gray-900">{users.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-2 md:p-4">
              <div className="text-[10px] md:text-sm text-gray-600">Verified</div>
              <div className="text-lg md:text-2xl font-bold text-green-600">{users.filter(u => u.status === 'verified').length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-2 md:p-4">
              <div className="text-[10px] md:text-sm text-gray-600">Premium</div>
              <div className="text-lg md:text-2xl font-bold text-purple-600">{users.filter(u => u.isGold || u.isFeatured || u.isSilver).length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-2 md:p-4">
              <div className="text-[10px] md:text-sm text-gray-600">Banned</div>
              <div className="text-lg md:text-2xl font-bold text-red-600">{users.filter(u => u.status === 'suspended').length}</div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subscriptions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{user.name || 'No name'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'escort' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'verified' ? 'bg-green-100 text-green-800' :
                          user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                            user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>{user.status}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 items-center">
                          {user.isGold && (
                            <div className="flex items-center gap-1">
                              <Crown className="w-4 h-4 text-yellow-600" />
                              <span className="text-xs font-medium text-yellow-600">GOLD</span>
                            </div>
                          )}
                          {user.isFeatured && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-blue-600 fill-blue-600" />
                              <span className="text-xs font-medium text-blue-600">FEATURED</span>
                            </div>
                          )}
                          {user.isSilver && (
                            <div className="flex items-center gap-1">
                              <Crown className="w-4 h-4 text-gray-600" />
                              <span className="text-xs font-medium text-gray-600">SILVER</span>
                            </div>
                          )}
                          {!user.isGold && !user.isFeatured && !user.isSilver && !user.verifiedPhotos && (
                            <span className="text-xs text-gray-500">None</span>
                          )}
                          {user.verifiedPhotos && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">VERIFIED PHOTOS</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setEditModalUser(user)} className="text-purple-600 hover:text-purple-900 mr-3">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-gray-500">No users found.</div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModalUser && (
        <EditUserModal
          user={editModalUser}
          onClose={() => setEditModalUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </AdminLayout>
  );
}
