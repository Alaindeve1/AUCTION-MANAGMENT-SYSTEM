import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { UserGroupIcon, CurrencyDollarIcon, ChartBarIcon, CubeIcon, ClockIcon, SparklesIcon } from '@heroicons/react/24/outline';
// import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const cardConfig = [
  { name: 'Users', icon: <UserGroupIcon className="w-8 h-8 text-indigo-600" />, key: 'users' },
  { name: 'Active Users', icon: <CubeIcon className="w-8 h-8 text-indigo-600" />, key: 'activeUsers' },
  { name: 'Bids', icon: <ChartBarIcon className="w-8 h-8 text-indigo-600" />, key: 'totalBids' },
  { name: 'Revenue', icon: <CurrencyDollarIcon className="w-8 h-8 text-indigo-600" />, key: 'revenue' },
  { name: 'Active Auctions', icon: <ClockIcon className="w-8 h-8 text-indigo-600" />, key: 'activeAuctions' },
];

const AdminDashboard = () => {
  // Users
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    }
  });

  // Bids stats
  const { data: bidsStats = { totalBids: 0, totalValue: 0, activeAuctions: 0, uniqueBidders: 0 } } = useQuery({
    queryKey: ['bidsStats'],
    queryFn: async () => {
      const res = await api.get('/bids/stats');
      return res.data;
    }
  });

  // Auction results (for revenue & recent activity)
  const { data: auctionResults = [] } = useQuery({
    queryKey: ['auctionResults'],
    queryFn: async () => {
      const res = await api.get('/auction-results');
      return res.data;
    }
  });

  // Recent users (last 5)
  const recentUsers = users.slice(-5).reverse();
  // Recent results (last 5)
  const recentResults = auctionResults.slice(-5).reverse();
  // Revenue: sum of finalPrice for COMPLETED results
  const revenue = auctionResults.filter(r => r.resultStatus === 'COMPLETED').reduce((sum, r) => sum + (r.finalPrice || 0), 0);

  // AI Insights (simple AI logic)
  const aiInsights = [];
  if (bidsStats.totalBids > 100) aiInsights.push('🔥 Bid activity is high!');
  if (revenue > 10000) aiInsights.push('💰 Revenue is strong this month.');
  if (bidsStats.uniqueBidders > 20) aiInsights.push('👥 Lots of unique bidders.');
  if (recentUsers.length > 0) aiInsights.push(`🆕 New user: ${recentUsers[0]?.username}`);
  if (recentResults.length > 0) aiInsights.push(`🏆 Latest auction: ${recentResults[0]?.itemTitle || recentResults[0]?.itemId}`);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-indigo-700">Admin Dashboard</h1>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <UserGroupIcon className="w-8 h-8 text-indigo-600 mb-2" />
          <div className="text-3xl font-bold text-indigo-700">{users.length}</div>
          <div className="text-gray-600">Users</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <CubeIcon className="w-8 h-8 text-indigo-600 mb-2" />
          <div className="text-3xl font-bold text-indigo-700">{users.filter(u => u.userStatus === 'ACTIVE').length}</div>
          <div className="text-gray-600">Active Users</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <ChartBarIcon className="w-8 h-8 text-indigo-600 mb-2" />
          <div className="text-3xl font-bold text-indigo-700">{bidsStats.totalBids}</div>
          <div className="text-gray-600">Total Bids</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <CurrencyDollarIcon className="w-8 h-8 text-indigo-600 mb-2" />
          <div className="text-3xl font-bold text-indigo-700">${revenue.toLocaleString()}</div>
          <div className="text-gray-600">Revenue</div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <ClockIcon className="w-8 h-8 text-indigo-600 mb-2" />
          <div className="text-3xl font-bold text-indigo-700">{bidsStats.activeAuctions}</div>
          <div className="text-gray-600">Active Auctions</div>
        </div>
      </div>

      {/* Chart & AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart Placeholder */}
        <div className="bg-white rounded-xl shadow p-6 col-span-2 flex flex-col">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="font-semibold text-lg text-gray-700">Bid Activity (Chart)</span>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-400 h-40">
            {/* Chart.js or Recharts chart goes here */}
            <span>Chart coming soon...</span>
          </div>
        </div>
        {/* AI Insights */}
        <div className="bg-gradient-to-br from-indigo-100 to-indigo-300 rounded-xl shadow p-6 flex flex-col">
          <div className="flex items-center mb-4">
            <SparklesIcon className="w-6 h-6 text-indigo-600 mr-2" />
            <span className="font-semibold text-lg text-indigo-800">AI Insights</span>
          </div>
          <ul className="space-y-2">
            {aiInsights.length === 0 && <li className="text-gray-500">No insights at this time.</li>}
            {aiInsights.map((insight, idx) => (
              <li key={idx} className="bg-white rounded px-3 py-2 shadow-sm text-gray-700">{insight}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold text-lg text-gray-700 mb-4">Recent Users</div>
          <ul className="divide-y divide-gray-100">
            {recentUsers.length === 0 && <li className="text-gray-400">No recent users.</li>}
            {recentUsers.map(u => (
              <li key={u.userId} className="py-2 flex flex-col">
                <span className="font-medium text-gray-900">{u.username}</span>
                <span className="text-xs text-gray-500">{u.email}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold text-lg text-gray-700 mb-4">Recent Auctions</div>
          <ul className="divide-y divide-gray-100">
            {recentResults.length === 0 && <li className="text-gray-400">No recent auctions.</li>}
            {recentResults.map(r => (
              <li key={r.resultId || r.itemId} className="py-2 flex flex-col">
                <span className="font-medium text-gray-900">{r.itemTitle || r.itemId}</span>
                <span className="text-xs text-gray-500">{r.resultStatus} &bull; {r.endDate ? new Date(r.endDate).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;