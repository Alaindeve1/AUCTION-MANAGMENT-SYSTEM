import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { createRoutesFromElements, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './utils/auth';
import Layout from './components/Layout';
import { lazy, Suspense } from 'react';
import { AdminAuthProvider } from './admin/AdminAuthContext';
import AdminLoginPage from './admin/AdminLoginPage';
import AdminProtectedRoute from './admin/AdminProtectedRoute';
import AdminLayout from './admin/AdminLayout';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from './theme';
import PrivateRoute from './components/PrivateRoute';

// Lazy load components
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Items = lazy(() => import('./pages/items/Items'));
const Bids = lazy(() => import('./pages/Bids'));
const Wins = lazy(() => import('./pages/Wins'));
const Contact = lazy(() => import('./pages/Contact'));
const Profile = lazy(() => import('./pages/Profile'));
const UserNotifications = lazy(() => import('./pages/Notification'));
const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
const AdminRoutes = lazy(() => import('./admin/AdminRoutes'));
const AdminCategoriesPage = lazy(() => import('./admin/AdminCategoriesPage'));
const AdminResultsPage = lazy(() => import('./admin/AdminResultsPage'));
const AdminBidsPage = lazy(() => import('./admin/AdminBidsPage'));
const AdminUsersPage = lazy(() => import('./admin/AdminUsersPage'));
const AdminItemsPage = lazy(() => import('./admin/AdminItemsPage'));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

const queryClient = new QueryClient();

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={
        <Suspense fallback={<LoadingFallback />}>
          <LandingPage />
        </Suspense>
      } />
      <Route path="/login" element={
        <Suspense fallback={<LoadingFallback />}>
          <Login />
        </Suspense>
      } />
      <Route path="/signup" element={
        <Suspense fallback={<LoadingFallback />}>
          <Signup />
        </Suspense>
      } />
      <Route path="/forgot-password" element={
        <Suspense fallback={<LoadingFallback />}>
          <ForgotPassword />
        </Suspense>
      } />
      <Route path="/reset-password" element={
        <Suspense fallback={<LoadingFallback />}>
          <ResetPassword />
        </Suspense>
      } />
      <Route path="/verify-email" element={
        <Suspense fallback={<LoadingFallback />}>
          <VerifyEmail />
        </Suspense>
      } />
      <Route path="/items" element={
        <Suspense fallback={<LoadingFallback />}>
          <Items />
        </Suspense>
      } />
      
      {/* Protected User Routes */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingFallback />}>
            <Dashboard />
          </Suspense>
        } />
        <Route path="/profile" element={
          <Suspense fallback={<LoadingFallback />}>
            <Profile />
          </Suspense>
        } />
        <Route path="/bids" element={
          <Suspense fallback={<LoadingFallback />}>
            <Bids />
          </Suspense>
        } />
        <Route path="/wins" element={
          <Suspense fallback={<LoadingFallback />}>
            <Wins />
          </Suspense>
        } />
        <Route path="/contact" element={
          <Suspense fallback={<LoadingFallback />}>
            <Contact />
          </Suspense>
        } />
        <Route path="/notifications" element={
          <Suspense fallback={<LoadingFallback />}>
            <UserNotifications />
          </Suspense>
        } />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/*" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route path="*" element={
          <Suspense fallback={<LoadingFallback />}>
            <AdminRoutes />
          </Suspense>
        } />
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

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      <AuthProvider>
        <AdminAuthProvider>
          <RouterProvider router={router} />
        </AdminAuthProvider>
      </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
