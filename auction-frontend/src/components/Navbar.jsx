import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/auth.jsx';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Get the current path to determine which type of search to perform
      const currentPath = location.pathname;
      
      // Determine the search type based on the current page
      let searchType = 'all';
      if (currentPath.includes('/notifications')) {
        searchType = 'notifications';
      } else if (currentPath.includes('/items')) {
        searchType = 'items';
      }

      // Navigate to search with both query and type
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${searchType}`);
    }
  };

  // Don't show navbar on auth pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-indigo-600">
                AuctionHub
              </Link>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-2 lg:ml-6 lg:justify-end">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-100 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Search items and notifications..."
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </form>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user && (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 