import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiPackage,
  FiGrid,
  FiUsers,
  FiAward,
  FiDollarSign,
  FiUser,
  FiSettings,
  FiHelpCircle,
} from 'react-icons/fi';

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: FiHome },
  { name: 'Items', to: '/items', icon: FiPackage },
  { name: 'Bids', to: '/bids', icon: FiDollarSign },
  { name: 'Watchlist', to: '/watchlist', icon: FiGrid },
  { name: 'Wins', to: '/wins', icon: FiAward },
  { name: 'Notifications', to: '/notifications', icon: FiUsers },
  { name: 'Profile', to: '/profile', icon: FiUser },
];

const secondaryNavigation = [
  { name: 'Settings', to: '/settings', icon: FiSettings },
  { name: 'Help & Support', to: '/help', icon: FiHelpCircle },
];

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-gray-200 pt-4 pb-4">
        <nav className="px-2">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar; 