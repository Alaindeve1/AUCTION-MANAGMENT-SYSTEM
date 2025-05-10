import { useState, useEffect } from 'react';
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

const Dashboard = () => {
  // User info
  const user = getUserData(); // { id, username, ... }
// console.log('User in Dashboard:', user);
  const [bids, setBids] = useState([]);
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Placeholders for future features
  const [sellingItems, setSellingItems] = useState([]); // Needs backend endpoint
  const [favorites, setFavorites] = useState([]); // Needs backend endpoint
  const [notifications, setNotifications] = useState([]); // Needs backend endpoint

  useEffect(() => {
    let intervalId;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch user bids
        const bidsRes = await api.get(`/bids/user/${user.id}`);
        setBids(bidsRes.data);
        // Fetch user wins
        const winsRes = await api.get(`/auction-results/winner/${user.id}`);
        setWins(winsRes.data);
        // Fetch favorites
        const favRes = await api.get(`/favorites/user/${user.id}`);
        setFavorites(favRes.data);
        // Fetch notifications
        const notifRes = await api.get(`/notifications/user/${user.id}`);
        setNotifications(notifRes.data);
        // Only admins see selling items
        if (user?.role === 'ADMIN') {
          const sellingRes = await api.get(`/items/owner/${user.id}`);
          setSellingItems(sellingRes.data);
        } else {
          setSellingItems([]);
        }
      } catch (err) {
        // Optionally, show error toast
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) {
      fetchData();
      intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(intervalId);
  }, [user?.id, user?.role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700 mb-1">Welcome back, {user?.username || 'User'}!</h1>
          <p className="text-gray-500">Here’s your auction activity and quick actions.</p>
        </div>
        <div className="flex gap-2">
          <a href="/items" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"><FiShoppingCart className="mr-2"/> Browse Auctions</a>
          {user?.role === 'ADMIN' && (
            <a href="/items/new" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"><FiPlus className="mr-2"/> Sell an Item</a>
          )}
          <a href="/profile" className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition"><FiUser className="mr-2"/> My Profile</a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Active Bids" value={bids.length} icon={FiActivity} color="text-blue-500" />
        <StatCard title="Auctions Won" value={wins.length} icon={FiAward} color="text-green-500" />
        {user?.role === 'ADMIN' && (
          <StatCard title="Selling Items" value={sellingItems.length || '--'} icon={FiBox} color="text-purple-500" />
        )}
        <StatCard title="Favorites" value={favorites.length || '--'} icon={FiStar} color="text-yellow-500" />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center"><FiActivity className="mr-2"/> Recent Bids</div>
          <ul className="divide-y divide-gray-100">
            {bids.length === 0 && <li className="text-gray-400">No recent bids.</li>}
            {bids.slice(-5).reverse().map(bid => (
              <li key={bid.bidId} className="py-2 flex flex-col">
                <span className="text-gray-900 font-medium">{bid.itemTitle || bid.itemId}</span>
                <span className="text-xs text-gray-500">Amount: ${bid.bidAmount} &bull; Status: {bid.status || '-'}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center"><FiAward className="mr-2"/> Auctions Won</div>
          <ul className="divide-y divide-gray-100">
            {wins.length === 0 && <li className="text-gray-400">No auctions won yet.</li>}
            {wins.slice(-5).reverse().map(win => (
              <li key={win.resultId} className="py-2 flex flex-col">
                <span className="text-gray-900 font-medium">{win.itemTitle || win.itemId}</span>
                <span className="text-xs text-gray-500">Final Price: ${win.finalPrice} &bull; {win.endDate ? new Date(win.endDate).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gradient-to-br from-indigo-100 to-indigo-300 rounded-xl shadow p-6 flex flex-col mb-8">
        <div className="flex items-center mb-4">
          <FiBell className="w-6 h-6 text-indigo-600 mr-2" />
          <span className="font-semibold text-lg text-indigo-800">Notifications</span>
        </div>
        <ul className="space-y-2">
          {notifications.length === 0 && <li className="text-gray-500">No notifications yet.</li>}
          {notifications.slice(-5).reverse().map(n => (
            <li key={n.id} className={`rounded-lg px-4 py-2 flex items-center gap-2 ${n.read ? 'bg-white text-gray-500' : 'bg-indigo-200 text-indigo-800 font-semibold animate-pulse'}`}>
              <FiBell className="w-5 h-5" />
              <span>{n.message}</span>
              <span className="ml-auto text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Selling Items */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center"><FiBox className="mr-2"/> Selling Items</div>
        <ul className="divide-y divide-gray-100">
          {sellingItems.length === 0 && <li className="text-gray-400">You have not listed any items for sale.</li>}
          {sellingItems.slice(-5).reverse().map(item => (
            <li key={item.itemId} className="py-2 flex items-center gap-3">
              {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-12 h-12 rounded object-cover border" />}
              <div className="flex flex-col flex-1">
                <span className="text-gray-900 font-medium">{item.title}</span>
                <span className="text-xs text-gray-500">Price: ${item.startingPrice} &bull; Status: {item.itemStatus}</span>
              </div>
              <a href={`/items/${item.itemId}`} className="ml-auto text-indigo-600 hover:underline text-sm">View</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Favorites */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center"><FiStar className="mr-2"/> Favorites</div>
        <ul className="divide-y divide-gray-100">
          {favorites.length === 0 && <li className="text-gray-400">No favorites yet.</li>}
          {favorites.slice(-5).reverse().map(fav => (
            <li key={fav.id} className="py-2 flex items-center gap-3">
              {fav.itemImageUrl && <img src={fav.itemImageUrl} alt={fav.itemTitle} className="w-10 h-10 rounded object-cover border" />}
              <div className="flex flex-col flex-1">
                <span className="text-gray-900 font-medium">{fav.itemTitle}</span>
                <span className="text-xs text-gray-500">Added: {fav.createdAt ? new Date(fav.createdAt).toLocaleDateString() : '-'}</span>
              </div>
              {/* No direct itemId in DTO, so no link unless you add it */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;