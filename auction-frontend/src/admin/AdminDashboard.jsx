import React from 'react';

const stats = [
  { name: 'Total Items', value: 42 },
  { name: 'Categories', value: 8 },
  { name: 'Users', value: 120 },
  { name: 'Bids', value: 350 },
  { name: 'Results', value: 40 },
];

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-indigo-700">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map(stat => (
          <div key={stat.name} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
            <div className="text-lg text-gray-700">{stat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard; 