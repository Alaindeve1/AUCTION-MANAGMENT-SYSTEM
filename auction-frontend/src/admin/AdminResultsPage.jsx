import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from './AdminAuthContext';

const AdminResultsPage = () => {
  const { admin } = useAdminAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('endDate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch auction results from backend
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/auction-results', {
          headers: { Authorization: `Bearer ${admin?.token}` },
          params: {
            sort: sortField,
            order: sortOrder,
            status: filterStatus !== 'all' ? filterStatus : undefined
          }
        });
        setResults(res.data);
      } catch (err) {
        setError('Failed to load auction results.');
      }
      setLoading(false);
    };
    if (admin?.token) fetchResults();
  }, [admin, sortField, sortOrder, filterStatus]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Auction Results</h1>
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="SOLD">Sold</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="text-center py-8 text-lg text-gray-500">Loading results...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
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
                <tr key={result.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{result.itemTitle}</td>
                  <td className="px-4 py-2">{formatCurrency(result.winningBid || 0)}</td>
                  <td className="px-4 py-2">{result.winner || 'No Winner'}</td>
                  <td className="px-4 py-2">{formatDate(result.endDate)}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      result.status === 'SOLD' ? 'bg-green-100 text-green-800' :
                      result.status === 'EXPIRED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
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