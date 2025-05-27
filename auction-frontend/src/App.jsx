import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutesFromElements, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './utils/auth';
import { WebSocketProvider } from './contexts/WebSocketContext';
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
import AdminRoutes from './admin/AdminRoutes';
import AdminCategoriesPage from './admin/AdminCategoriesPage';
import AdminResultsPage from './admin/AdminResultsPage';
import AdminBidsPage from './admin/AdminBidsPage';
import AdminUsersPage from './admin/AdminUsersPage';
import AdminItemsPage from './admin/AdminItemsPage';
import Dashboard from './pages/Dashboard.jsx';
import Items from './pages/items/Items';
import ItemDetails from './pages/items/ItemDetails';
import UserBids from './pages/bids/UserBids';
import Wins from './pages/Wins';
import Notification from './pages/Notification';
import SearchResults from './pages/SearchResults';
import Profile from './pages/Profile';
import Help from './pages/Help';
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
      <Route path="/search" element={<SearchResults />} />
      
      {/* Protected User Routes */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="items" element={<Items />} />
        <Route path="items/:id" element={<ItemDetails />} />
        <Route path="bids" element={<UserBids />} />
        <Route path="wins" element={<Wins />} />
        <Route path="notifications" element={<Notification />} />
        <Route path="help" element={<Help />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={
        <AdminAuthProvider>
          <AdminLoginPage />
        </AdminAuthProvider>
      } />
      <Route path="/admin/*" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route path="*" element={<AdminRoutes />} />
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
        <WebSocketProvider>
          <AdminAuthProvider>
            <RouterProvider router={router} />
          </AdminAuthProvider>
        </WebSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
