import { useQuery } from '@tanstack/react-query';
import { FiAward, FiActivity, FiStar, FiBox, FiBell, FiUser, FiShoppingCart, FiPlus } from 'react-icons/fi';
import api from '../utils/api';
import { getUserData } from '../utils/auth.jsx';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
    <div className={`p-3 rounded-full ${color} bg-opacity-20 mb-2`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-lg font-semibold text-gray-700">{title}</div>
    <div className="text-3xl font-bold text-indigo-700 mt-1">{value}</div>
  </div>
);

import { Navigate, useLocation } from 'react-router-dom';

const Dashboard = () => {
  // User info
  const user = getUserData(); // { id, username, ... }
  const location = useLocation();
  if (!user) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
// console.log('User in Dashboard:', user);
  // Bids
  const { data: bids = [], isLoading: bidsLoading, error: bidsError } = useQuery({
    queryKey: ['userBids', user?.id],
    queryFn: () => api.get(`/api/bids/user/${user?.id}`).then(res => res.data),
    enabled: !!user?.id,
    refetchInterval: 5000,
  });
  // Wins
  const { data: wins = [], isLoading: winsLoading, error: winsError } = useQuery({
    queryKey: ['userWins', user?.id],
    queryFn: () => api.get(`/api/auction-results/winner/${user?.id}`).then(res => res.data),
    enabled: !!user?.id,
    refetchInterval: 5000,
  });
  // Favorites
  const { data: favorites = [], isLoading: favLoading, error: favError } = useQuery({
    queryKey: ['userFavorites', user?.id],
    queryFn: () => api.get(`/api/favorites/user/${user?.id}`).then(res => res.data),
    enabled: !!user?.id,
    refetchInterval: 5000,
  });
  // Notifications
  const { data: notifications = [], isLoading: notifLoading, error: notifError } = useQuery({
    queryKey: ['userNotifications', user?.id],
    queryFn: () => api.get(`/api/notifications/user/${user?.id}`).then(res => res.data),
    enabled: !!user?.id,
    refetchInterval: 5000,
  });

  const loading = bidsLoading || winsLoading || favLoading || notifLoading;
  const error = bidsError || winsError || favError || notifError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      return (
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-red-600 text-lg font-bold mb-4">Session expired or unauthorized. Please <a href="/login" className="underline">login again</a>.</div>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600 text-lg font-bold mb-4">An error occurred loading your dashboard.</div>
        <div className="text-gray-500">{error.message || JSON.stringify(error)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700 mb-1">Welcome back, {user?.username || 'User'}!</h1>
          <p className="text-gray-500">Here's your auction activity and quick actions.</p>
        </div>
        <div className="flex gap-2">
          <a href="/items" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"><FiShoppingCart className="mr-2"/> Browse Auctions</a>
          <a href="/profile" className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition"><FiUser className="mr-2"/> My Profile</a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Active Bids" value={bids.length} icon={FiActivity} color="text-blue-500" />
        <StatCard title="Auctions Won" value={wins.length} icon={FiAward} color="text-green-500" />
        <StatCard title="Favorites" value={favorites.length || '--'} icon={FiStar} color="text-yellow-500" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {bids.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center"><FiActivity className="mr-2"/> Recent Bids</div>
          <ul className="divide-y divide-gray-100">
            {bids.slice(-5).reverse().map(bid => (
              <li key={bid.bidId} className="py-2 flex flex-col">
                <span className="text-gray-900 font-medium">{bid.itemTitle || bid.itemId}</span>
                <span className="text-xs text-gray-500">Amount: ${bid.bidAmount} &bull; Status: {bid.status || '-'}</span>
              </li>
            ))}
          </ul>
        </div>
        )}
        {wins.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center"><FiAward className="mr-2"/> Auctions Won</div>
          <ul className="divide-y divide-gray-100">
            {wins.slice(-5).reverse().map(win => (
              <li key={win.resultId} className="py-2 flex flex-col">
                <span className="text-gray-900 font-medium">{win.itemTitle || win.itemId}</span>
                <span className="text-xs text-gray-500">Final Price: ${win.finalPrice} &bull; {win.endDate ? new Date(win.endDate).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        </div>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
      <div className="bg-gradient-to-br from-indigo-100 to-indigo-300 rounded-xl shadow p-6 flex flex-col mb-8">
        <div className="flex items-center mb-4">
          <FiBell className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="font-semibold text-lg text-indigo-800">Notifications</span>
        </div>
        <ul className="space-y-2">
          {notifications.slice(-5).reverse().map(n => (
            <li key={n.id} className={`rounded-lg px-4 py-2 flex items-center gap-2 ${n.read ? 'bg-white text-gray-500' : 'bg-indigo-200 text-indigo-800 font-semibold animate-pulse'}`}>
              <FiBell className="w-5 h-5" />
              <span>{n.message}</span>
              <span className="ml-auto text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      )}

      {/* Favorites */}
      {favorites.length > 0 && (
      <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center">
            <FiStar className="mr-2 text-yellow-500" />
            <span>Your Watchlist</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((fav) => (
              <div key={fav.id} className="relative group">
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {fav.itemImageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={fav.itemImageUrl}
                        alt={fav.itemTitle}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2">
                        <FiStar className="w-6 h-6 text-yellow-500 animate-pulse" />
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{fav.itemTitle}</h3>
                    <p className="text-sm text-gray-500">
                      Added: {fav.createdAt ? new Date(fav.createdAt).toLocaleDateString() : '-'}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <a
                        href={`/items/${fav.itemId}`}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                      >
                        View Item
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {favorites.length === 0 && (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <div className="flex flex-col items-center justify-center py-8">
            <FiStar className="w-16 h-16 text-yellow-500 mb-4 animate-pulse" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your watchlist is empty</h3>
            <p className="text-gray-500 text-center mb-4">
              Start adding items to keep track of auctions you're interested in.
            </p>
            <a
              href="/items"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Items
            </a>
          </div>
      </div>
      )}
    </div>
  );
};

export default Dashboard;