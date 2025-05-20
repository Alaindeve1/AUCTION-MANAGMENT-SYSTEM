import { useQuery } from '@tanstack/react-query';
import { FiAward, FiShoppingCart, FiUser, FiStar, FiTrendingUp, FiUsers, FiShield, FiHeart } from 'react-icons/fi';
import api from '../utils/api';
import { useAuth } from '../utils/auth';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center hover:shadow-lg transition-all duration-300">
    <div className={`p-3 rounded-full ${color} bg-opacity-20 mb-2`}>
      <Icon className="w-6 h-6" />
    </div>
    <div className="text-lg font-semibold text-gray-700">{title}</div>
    <div className="text-3xl font-bold text-indigo-700 mt-1">{value}</div>
  </div>
);

const RatingCard = ({ rating, title, description }) => (
  <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-all duration-300">
    <div className="flex items-center mb-4">
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} className={`w-5 h-5 ${i < rating ? 'fill-current' : ''}`} />
        ))}
      </div>
      <span className="ml-2 text-gray-600 font-medium">{rating}/5</span>
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const PartnerLogo = ({ name, logo }) => (
  <div className="flex items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300">
    <img src={logo} alt={name} className="h-12 object-contain" />
  </div>
);

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Active Auctions
  const { data: activeAuctions = [], isLoading: auctionsLoading, error: auctionsError } = useQuery({
    queryKey: ['activeAuctions'],
    queryFn: async () => {
      try {
        const res = await api.get('/items/status/ACTIVE');
        return res.data;
      } catch (error) {
        console.error('Error fetching active auctions:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
        }
        throw error;
      }
    },
    retry: false,
  });

  // Wins
  const { data: wins = [], isLoading: winsLoading, error: winsError } = useQuery({
    queryKey: ['wins', user.id],
    queryFn: async () => {
      try {
        const res = await api.get(`/auction-results/winner/${user.id}`);
        return res.data;
      } catch (error) {
        console.error('Error fetching wins:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please log in again.');
        }
        throw error;
      }
    },
    enabled: !!user?.id,
    retry: false,
  });

  const loading = auctionsLoading || winsLoading;
  const error = auctionsError || winsError;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    if (error.response?.status === 401) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-600 text-lg font-bold mb-4">An error occurred loading your dashboard.</div>
        <div className="text-gray-500">{error.message}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Greeting */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-indigo-700 mb-1">Welcome back, {user?.username || 'User'}!</h1>
          <p className="text-gray-500">Here's your auction activity and quick actions.</p>
        </div>
        <div className="flex gap-2">
          <a href="/items" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
            <FiShoppingCart className="mr-2"/> Browse Auctions
          </a>
          <a href="/profile" className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition">
            <FiUser className="mr-2"/> My Profile
          </a>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Auctions" value={activeAuctions.length} icon={FiShoppingCart} color="text-blue-500" />
        <StatCard title="Community Members" value="10K+" icon={FiUsers} color="text-green-500" />
        <StatCard title="Success Rate" value="98%" icon={FiTrendingUp} color="text-purple-500" />
        <StatCard title="Trust Score" value="4.9" icon={FiShield} color="text-red-500" />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Active Auctions Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center">
              <FiShoppingCart className="mr-2"/> Active Auctions
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAuctions.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-4">No active auctions at the moment.</div>
              ) : (
                activeAuctions.slice(0, 6).map(auction => (
                  <div key={auction.itemId} className="border rounded-lg p-4 hover:shadow-md transition">
                    {auction.imageUrl && (
                      <img src={auction.imageUrl} alt={auction.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-1">{auction.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">Starting at ${auction.startingPrice}</p>
                    <a href={`/items/${auction.itemId}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details →</a>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Platform Ratings</h2>
            <div className="space-y-4">
              <RatingCard 
                rating={4.9} 
                title="User Experience" 
                description="Smooth and intuitive interface for all users"
              />
              <RatingCard 
                rating={4.8} 
                title="Security" 
                description="Advanced security measures for safe transactions"
              />
              <RatingCard 
                rating={4.7} 
                title="Customer Support" 
                description="24/7 dedicated support team"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">Trusted Partners</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <PartnerLogo 
            name="THE FOX COMPANY Ltd" 
            logo="https://via.placeholder.com/300x100?text=THE+FOX+COMPANY+Ltd" 
          />
          <PartnerLogo 
            name="Spears Company" 
            logo="https://via.placeholder.com/300x100?text=Spears+Company" 
          />
        </div>
      </div>

      {/* Auctions Won Section */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="font-semibold text-lg text-gray-700 mb-4 flex items-center">
          <FiAward className="mr-2"/> Auctions Won
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wins.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-4">No auctions won yet.</div>
          ) : (
            wins.map(win => (
              <div key={win.resultId} className="border rounded-lg p-4 hover:shadow-md transition">
                {win.itemImageUrl && (
                  <img src={win.itemImageUrl} alt={win.itemTitle} className="w-full h-40 object-cover rounded-lg mb-3" />
                )}
                <h3 className="font-semibold text-gray-900 mb-1">{win.itemTitle}</h3>
                <p className="text-sm text-gray-500 mb-2">Final Price: ${win.finalPrice}</p>
                <p className="text-xs text-gray-400 mb-2">Ended: {win.endDate ? new Date(win.endDate).toLocaleDateString() : '-'}</p>
                <a href={`/items/${win.itemId}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View Details →</a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;