import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';

const AdminSidebar = () => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Items', path: '/admin/items' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Bids', path: '/admin/bids' },
    { name: 'Results', path: '/admin/results' },
    { name: 'Notifications', path: '/admin/notifications' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <aside className="w-64 bg-gray-900 shadow-lg flex flex-col border-r border-gray-800">
      <div className="h-16 flex items-center justify-center text-2xl font-bold text-indigo-400 border-b border-gray-800">
        Admin Panel
      </div>
      <nav className="flex-1 py-4">
        {navLinks.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`block px-6 py-3 text-lg rounded-l-full transition-colors duration-200 mb-2 ${
              location.pathname === link.path
                ? 'bg-indigo-900 text-indigo-400 font-semibold'
                : 'text-gray-400 hover:bg-gray-800 hover:text-indigo-400'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="text-gray-400 mb-4 px-4">
          <p className="font-semibold">{admin?.username}</p>
          <p className="text-sm text-gray-500">{admin?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar; 