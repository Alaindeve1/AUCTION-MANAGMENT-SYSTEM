import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutesFromElements, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './utils/auth';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminCategoriesPage from './admin/AdminCategoriesPage';
import AdminResultsPage from './admin/AdminResultsPage';
import AdminBidsPage from './admin/AdminBidsPage';
import AdminUsersPage from './admin/AdminUsersPage';
import AdminItemsPage from './admin/AdminItemsPage';
import Dashboard from './pages/Dashboard.jsx';
import Items from './pages/items/Items';
import Bids from './pages/Bids';
import Watchlist from './pages/Watchlist';
import Wins from './pages/Wins';
import Notification from './pages/Notification';

import Profile from './pages/Profile';
// Test component
const TestComponent = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Component</h1>
      <p>If you can see this, the basic routing is working.</p>
    </div>
  );
};

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      
      {/* Protected User Routes */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/items" element={<Items />} />
        <Route path="/bids" element={<Bids />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/wins" element={<Wins />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/settings" element={<div>Settings Content</div>} />
        <Route path="/help" element={<div>Help Content</div>} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="items" element={<AdminItemsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="bids" element={<AdminBidsPage />} />
        <Route path="results" element={<AdminResultsPage />} />
      </Route>
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true
    }
  }
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <AuthProvider>
        <AdminAuthProvider>
          <RouterProvider router={router} />
        </AdminAuthProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
