import { useState, useEffect } from 'react';
import { FiUsers, FiBox, FiTag, FiAward } from 'react-icons/fi';
import api from '../utils/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-soft p-6">
    <div className="flex items-center mb-4">
      <div className={`p-3 rounded-full ${color} bg-opacity-20 mr-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
    </div>
    <p className="text-3xl font-bold text-primary-600">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalItems: 0,
    totalCategories: 0,
    activeAuctions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, items, categories, auctions] = await Promise.all([
          api.get('/users/count'),
          api.get('/items/count'),
          api.get('/categories/count'),
          api.get('/items/active/count'),
        ]);

        setStats({
          totalUsers: users.data,
          totalItems: items.data,
          totalCategories: categories.data,
          activeAuctions: auctions.data,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FiUsers}
          color="text-blue-500"
        />
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          icon={FiBox}
          color="text-green-500"
        />
        <StatCard
          title="Categories"
          value={stats.totalCategories}
          icon={FiTag}
          color="text-purple-500"
        />
        <StatCard
          title="Active Auctions"
          value={stats.activeAuctions}
          icon={FiAward}
          color="text-orange-500"
        />
      </div>
    </div>
  );
};

export default Dashboard; 