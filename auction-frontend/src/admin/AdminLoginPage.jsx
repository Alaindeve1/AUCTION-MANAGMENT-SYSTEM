import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import TwoFactorQRCode from '../components/TwoFactorQRCode';
import TwoFactorInput from '../components/TwoFactorInput';

const AdminLoginPage = () => {
  const { login, verifyTwoFactor, error, loading } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials' or '2fa'
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const navigate = useNavigate();

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { username, password });
    const result = await login(username, password);
    console.log('Login result:', result);

    if (result.requiresTwoFactor) {
      console.log('2FA required, setting QR code URL:', result.qrCodeUrl);
      setQrCodeUrl(result.qrCodeUrl);
      setStep('2fa');
    } else if (result.success) {
      console.log('Login successful, navigating to dashboard');
      navigate('/admin/dashboard');
    }
  };

  const handleTwoFactorSubmit = async (code) => {
    console.log('2FA verification attempt with code:', code);
    const result = await verifyTwoFactor(username, code);
    console.log('2FA verification result:', result);

    if (result.success) {
      console.log('2FA successful, waiting for admin state to update...');
      // Wait a short moment for the admin state to be updated
      setTimeout(() => {
        console.log('Navigating to dashboard...');
        navigate('/admin/dashboard', { replace: true });
      }, 100);
    }
  };

  const handleCancel = () => {
    console.log('Canceling 2FA, returning to credentials step');
    setStep('credentials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">Admin Login</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-semibold"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-600 mb-4">
                Scan this QR code with your authenticator app (like Google Authenticator) to set up 2FA.
              </p>
              {qrCodeUrl && <TwoFactorQRCode qrCodeUrl={qrCodeUrl} />}
            </div>
            <TwoFactorInput
              onSubmit={handleTwoFactorSubmit}
              onCancel={handleCancel}
              isLoading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage; 