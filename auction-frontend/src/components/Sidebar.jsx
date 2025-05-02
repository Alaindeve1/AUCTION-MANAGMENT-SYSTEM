import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiGrid,
  FiUsers,
  FiAward,
  FiDollarSign,
  FiUser,
} from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: FiHome },
  { name: 'Items', to: '/items', icon: FiPackage },
  { name: 'Categories', to: '/categories', icon: FiGrid },
  { name: 'Users', to: '/users', icon: FiUsers },
  { name: 'Auction Results', to: '/auction-results', icon: FiAward },
  { name: 'Bids', to: '/bids', icon: FiDollarSign },
  { name: 'Profile', to: '/profile', icon: FiUser },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-sm h-[calc(100vh-4rem)]">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon
                className="mr-3 h-5 w-5"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar; 