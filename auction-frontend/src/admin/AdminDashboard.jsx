import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { UserGroupIcon, CurrencyDollarIcon, ChartBarIcon, CubeIcon, ClockIcon, TagIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  // Mock data for the chart (fallback data)
  const mockBidData = [
    { date: 'Jan', bids: 65, revenue: 4500 },
    { date: 'Feb', bids: 59, revenue: 3800 },
    { date: 'Mar', bids: 80, revenue: 5200 },
    { date: 'Apr', bids: 81, revenue: 5500 },
    { date: 'May', bids: 56, revenue: 4200 },
    { date: 'Jun', bids: 55, revenue: 4100 },
  ];

  // Users
  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    },
    staleTime: 30000, // Don't refetch for 30 seconds
    refetchOnWindowFocus: false
  });

  // Bids stats
  const { data: bidsStats = { totalBids: 0, totalValue: 0, activeAuctions: 0, uniqueBidders: 0 } } = useQuery({
    queryKey: ['bidsStats'],
    queryFn: async () => {
      const res = await api.get('/bids/stats');
      return res.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  // Auction results (for revenue & recent activity)
  const { data: auctionResults = [] } = useQuery({
    queryKey: ['auctionResults'],
    queryFn: async () => {
      const res = await api.get('/auction-results');
      return res.data;
    }
  });

  // New query for bid history with proper error handling
  const { 
    data: bidHistory = [], 
    isLoading: isBidHistoryLoading,
    error: bidHistoryError 
  } = useQuery({
    queryKey: ['bidHistory'],
    queryFn: async () => {
      try {
        const res = await api.get('/bids/history');
        console.log('Bid History Response:', res.data);
        return res.data;
      } catch (error) {
        console.error('Error fetching bid history:', error);
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Transform bid history data for the chart with debug logs
  const chartData = useMemo(() => {
    console.log('Raw bid history:', bidHistory);
    
    if (!bidHistory || !Array.isArray(bidHistory) || bidHistory.length === 0) {
      console.log('Using mock data as fallback');
      return mockBidData;
    }

    // Group bids by month and calculate totals
    const groupedData = bidHistory.reduce((acc, bid) => {
      if (!bid || !bid.bidTime) {
        console.log('Invalid bid data:', bid);
        return acc;
      }

      const date = new Date(bid.bidTime);
      const month = date.toLocaleString('default', { month: 'short' });
      
      if (!acc[month]) {
        acc[month] = {
          date: month,
          bids: 0,
          revenue: 0
        };
      }
      
      acc[month].bids += 1;
      acc[month].revenue += Number(bid.bidAmount) || 0;
      
      return acc;
    }, {});

    // Sort data by month
    const sortedData = Object.values(groupedData).sort((a, b) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months.indexOf(a.date) - months.indexOf(b.date);
    });

    console.log('Processed chart data:', sortedData);
    return sortedData;
  }, [bidHistory]);

  // Recent users (last 5)
  const recentUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];
    return users.slice(-5).reverse();
  }, [users]);

  // Revenue: sum of finalPrice for COMPLETED results
  const revenue = useMemo(() => {
    if (!Array.isArray(auctionResults)) return 0;
    return auctionResults
      .filter(r => r?.resultStatus === 'COMPLETED')
      .reduce((sum, r) => sum + (r?.finalPrice || 0), 0);
  }, [auctionResults]);

  // Popular items
  const { data: popularItems = [] } = useQuery({
    queryKey: ['popularItems'],
    queryFn: async () => {
      const res = await api.get('/items/popular');
      return res.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  // Category stats
  const { data: categoryStats = {} } = useQuery({
    queryKey: ['categoryStats'],
    queryFn: async () => {
      const res = await api.get('/items/category-stats');
      return res.data;
    },
    staleTime: 30000,
    refetchOnWindowFocus: false
  });

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      {/* Welcome Message */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
        >
          Welcome Back, Admin
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-lg"
        >
          Here's what's happening with your auction platform today
        </motion.p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
        >
          <UserGroupIcon className="w-8 h-8 text-indigo-400 mb-2" />
          <div className="text-3xl font-bold text-indigo-400">{users.length}</div>
          <div className="text-gray-400">Total Users</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
        >
          <CubeIcon className="w-8 h-8 text-indigo-400 mb-2" />
          <div className="text-3xl font-bold text-indigo-400">{users.filter(u => u?.userStatus === 'ACTIVE').length}</div>
          <div className="text-gray-400">Active Users</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
        >
          <ChartBarIcon className="w-8 h-8 text-indigo-400 mb-2" />
          <div className="text-3xl font-bold text-indigo-400">{bidsStats.totalBids}</div>
          <div className="text-gray-400">Total Bids</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center hover:shadow-xl transition-shadow duration-300"
        >
          <CurrencyDollarIcon className="w-8 h-8 text-indigo-400 mb-2" />
          <div className="text-3xl font-bold text-indigo-400">${revenue.toLocaleString()}</div>
          <div className="text-gray-400">Total Revenue</div>
        </motion.div>
      </div>

      {/* Chart & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart Section */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ChartBarIcon className="w-6 h-6 text-indigo-400 mr-2" />
              <span className="font-semibold text-lg text-gray-300">Bid Activity Overview</span>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTimeRange('daily')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  timeRange === 'daily' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Daily
              </button>
              <button 
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  timeRange === 'monthly' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          {isBidHistoryLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          ) : bidHistoryError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-400">Error loading chart data</div>
          </div>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  yAxisId="left"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '0.5rem',
                    color: '#F3F4F6'
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="bids"
                  name="Number of Bids"
                  stroke="#818CF8"
                  strokeWidth={2}
                  dot={{ fill: '#818CF8', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#818CF8' }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#34D399"
                  strokeWidth={2}
                  dot={{ fill: '#34D399', strokeWidth: 2 }}
                  activeDot={{ r: 8, fill: '#34D399' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <TrophyIcon className="w-8 h-8" />
              <span className="text-2xl font-bold">Top Categories</span>
          </div>
            <ul className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <li key={category} className="flex items-center justify-between">
                  <span>{category}</span>
                  <span className="font-semibold">{count} items</span>
                </li>
              ))}
              {Object.keys(categoryStats).length === 0 && (
                <li className="text-center text-gray-300">No category data available</li>
              )}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="font-semibold text-lg text-gray-300 mb-4">Popular Items</div>
            <ul className="space-y-3">
              {popularItems.map(item => (
                <li key={item.id} className="flex items-center justify-between">
                  <span className="text-gray-400">{item.title}</span>
                  <span className="text-indigo-400 font-semibold">{item.bidCount} bids</span>
                </li>
              ))}
              {popularItems.length === 0 && (
                <li className="text-center text-gray-400">No popular items data available</li>
              )}
          </ul>
          </motion.div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <div className="font-semibold text-lg text-gray-300 mb-4">Recent Users</div>
          <ul className="divide-y divide-gray-700">
            {recentUsers.length === 0 && <li className="text-gray-400 py-2">No recent users.</li>}
            {recentUsers.map(u => (
              <li key={u?.userId || Math.random()} className="py-3 flex items-center space-x-3 hover:bg-gray-700 px-2 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center">
                  <span className="text-indigo-400 font-medium">
                    {u?.username ? u.username.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-300">{u?.username || 'Unknown User'}</div>
                  <div className="text-sm text-gray-400">{u?.email || 'No email'}</div>
                </div>
                <div className="text-sm text-gray-400">
                  {u?.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
        </div>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;