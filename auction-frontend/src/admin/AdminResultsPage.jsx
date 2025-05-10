import React, { useState } from 'react';
import { useAdminAuth } from './AdminAuthContext';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';

const AdminResultsPage = () => {
  const { admin } = useAdminAuth();
  const [sortField, setSortField] = useState('endDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  const {
    data: results = [],
    isLoading: loading,
    isError,
    error
  } = useQuery({
    queryKey: ['auctionResults', sortField, sortOrder, filterStatus, admin?.token],
    queryFn: async () => {
      const params = {
        sort: sortField,
        order: sortOrder,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };
      const res = await api.get('/auction-results', { params });
      return res.data;
    },
    enabled: !!admin?.token
  });

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    if (amount == null) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getSortIcon = (field) => {
    if (field !== sortField) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-indigo-700">Auction Results</h1>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading auction results...</div>
      ) : isError ? (
        <>
          <div className="text-center py-10 text-red-500">Failed to load auction results.</div>
          <div className="text-center py-8 text-red-600">{error}</div>
        </>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead>
              <tr className="bg-indigo-50 text-indigo-700">
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('itemTitle')}>
                  Item {getSortIcon('itemTitle')}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('winningBid')}>
                  Final Price {getSortIcon('winningBid')}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('winner')}>
                  Winner {getSortIcon('winner')}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('endDate')}>
                  End Date {getSortIcon('endDate')}
                </th>
                <th className="px-4 py-2 text-left cursor-pointer" onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result.resultId || result.itemId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{result.itemTitle || result.itemId}</td>
                  <td className="px-4 py-2">{formatCurrency(result.finalPrice)}</td>
                  <td className="px-4 py-2">{result.winnerName || result.winnerId || 'No Winner'}</td>
                  <td className="px-4 py-2">{formatDate(result.endDate)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      result.resultStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      result.resultStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      result.resultStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.resultStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {results.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No auction results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminResultsPage; 