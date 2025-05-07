import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from './AdminAuthContext';

const AdminUsersPage = () => {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userStats, setUserStats] = useState({
    totalBids: 0,
    wonAuctions: 0,
    activeBids: 0
  });

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${admin?.token}` },
          params: {
            search: searchTerm || undefined,
            role: filterRole !== 'all' ? filterRole : undefined
          }
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to load users.');
      }
      setLoading(false);
    };
    if (admin?.token) fetchUsers();
  }, [admin, searchTerm, filterRole]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewUser = async (user) => {
    setSelectedUser(user);
    try {
      const stats = await axios.get(`/api/admin/users/${user.id}/stats`, {
        headers: { Authorization: `Bearer ${admin?.token}` }
      });
      setUserStats(stats.data);
      setShowModal(true);
    } catch (err) {
      console.error('Failed to load user stats:', err);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`/api/admin/users/${userId}/status`, {
        status: currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
      }, {
        headers: { Authorization: `Bearer ${admin?.token}` }
      });
      // Update local state
      setUsers(users.map(user => 
        user.id === userId 
          ? { ...user, status: currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : user
      ));
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">User Management</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Roles</option>
            <option value="USER">Users</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-lg text-gray-500">Loading users...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-indigo-50 text-indigo-700">
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Joined</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleToggleUserStatus(user.id, user.status)}
                      className={`px-3 py-1 rounded ${
                        user.status === 'ACTIVE'
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-indigo-700">User Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">User Information</h3>
                <p><span className="font-medium">Username:</span> {selectedUser.username}</p>
                <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
                <p><span className="font-medium">Status:</span> {selectedUser.status}</p>
                <p><span className="font-medium">Joined:</span> {formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Activity Statistics</h3>
                <p><span className="font-medium">Total Bids:</span> {userStats.totalBids}</p>
                <p><span className="font-medium">Won Auctions:</span> {userStats.wonAuctions}</p>
                <p><span className="font-medium">Active Bids:</span> {userStats.activeBids}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage; 