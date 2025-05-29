import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from './AdminAuthContext';

const AdminUsersPage = () => {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/admin/users', {
        headers: { Authorization: `Bearer ${admin?.token}` }
      });
      console.log('Users data received from backend:', res.data);
      setUsers(res.data || []);
    } catch (err) {
      setError('Failed to load users.');
      console.error('Failed to load users:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewUser = async (user) => {
    if (!user?.userId) return;
    
    setSelectedUser(user);
    try {
      const stats = await axios.get(`/api/admin/users/${user.userId}/stats`, {
        headers: { Authorization: `Bearer ${admin?.token}` }
      });
      setUserStats(stats.data || {
        totalBids: 0,
        wonAuctions: 0,
        activeBids: 0
      });
      setShowModal(true);
    } catch (err) {
      console.error('Failed to load user stats:', err);
      setUserStats({
        totalBids: 0,
        wonAuctions: 0,
        activeBids: 0
      });
      setShowModal(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    console.log('Attempting to delete user with ID:', userId);
    if (!userId) {
      console.log('No userId provided for deletion.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
          headers: { 
            Authorization: `Bearer ${admin?.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.status === 200) {
          setUsers(prevUsers => prevUsers.filter(user => user?.id !== userId));
          setError(null);
          alert('User deleted successfully');
        } else {
          setError('Failed to delete user. Please try again.');
        }
      } catch (err) {
        console.error('Failed to delete user:', err);
        setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    if (!user) return false;
    
    const username = user.username?.toLowerCase() || '';
    const email = user.email?.toLowerCase() || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const matchesSearch = username.includes(searchTermLower) || 
                         email.includes(searchTermLower);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
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
          <table className="min-w-full bg-gray-800 rounded-xl shadow">
            <thead>
              <tr className="bg-gray-700 text-gray-300">
                <th className="px-4 py-2 text-left">Username</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Joined</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => {
                console.log('Rendering user:', user);
                return (
                <tr key={user?.id || Math.random()} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2 text-gray-300">{user?.username || 'N/A'}</td>
                  <td className="px-4 py-2 text-gray-300">{user?.email || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user?.role === 'ADMIN' ? 'bg-purple-900 text-purple-200' : 'bg-blue-900 text-blue-200'
                    }`}>
                      {user?.role || 'USER'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      user?.userStatus === 'ACTIVE' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                    }`}>
                      {user?.userStatus || 'INACTIVE'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-300">{formatDate(user?.createdAt)}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user?.userId)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400">
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
          <div className="bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold text-indigo-400">User Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">User Information</h3>
                <p className="text-gray-400"><span className="font-medium text-gray-300">Username:</span> {selectedUser?.username || 'N/A'}</p>
                <p className="text-gray-400"><span className="font-medium text-gray-300">Email:</span> {selectedUser?.email || 'N/A'}</p>
                <p className="text-gray-400"><span className="font-medium text-gray-300">Role:</span> {selectedUser?.role || 'USER'}</p>
                <p className="text-gray-400"><span className="font-medium text-gray-300">Status:</span> {selectedUser?.userStatus || 'INACTIVE'}</p>
                <p className="text-gray-400"><span className="font-medium text-gray-300">Joined:</span> {formatDate(selectedUser?.createdAt)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-300 mb-2">Activity Statistics</h3>
                <p className="text-gray-400"><span className="font-medium text-gray-300">Total Bids:</span> {userStats.totalBids}</p>
                <p className="text-gray-400"><span className="font-medium text-gray-300">Won Auctions:</span> {userStats.wonAuctions}</p>
                <p className="text-gray-400"><span className="font-medium text-gray-300">Active Bids:</span> {userStats.activeBids}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage; 