import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Auction System</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FiUser className="w-5 h-5" />
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 