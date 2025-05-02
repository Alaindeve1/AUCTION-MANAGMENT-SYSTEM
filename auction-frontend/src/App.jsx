import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout
import Layout from './components/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Main Pages
import Dashboard from './pages/Dashboard';
import Items from './pages/Items';
import Categories from './pages/Categories';
import Users from './pages/Users';
import AuctionResults from './pages/AuctionResults';
import Bids from './pages/Bids';
import Profile from './pages/Profile';

// Auth Guard
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/items" element={<Items />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/users" element={<Users />} />
          <Route path="/auction-results" element={<AuctionResults />} />
          <Route path="/bids" element={<Bids />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
