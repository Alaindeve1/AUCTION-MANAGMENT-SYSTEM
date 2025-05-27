import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import TwoFactorQRCode from '../components/TwoFactorQRCode';
import TwoFactorInput from '../components/TwoFactorInput';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, verifyTwoFactor, error: authError } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState('credentials'); // 'credentials' or '2fa'
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Debug effect to log state changes
  useEffect(() => {
    console.log('State updated:', { step, qrCodeUrl, isLoading, error });
  }, [step, qrCodeUrl, isLoading, error]);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { username, password });
    setError('');
    setIsLoading(true);

    try {
      const result = await login(username, password);
      console.log('Login result:', result);

      if (result.requiresTwoFactor) {
        console.log('2FA required, setting QR code URL:', result.qrCodeUrl);
        setQrCodeUrl(result.qrCodeUrl);
        setStep('2fa');
      } else if (result.success) {
        console.log('Login successful, navigating to dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('Login failed:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (code) => {
    console.log('2FA verification attempt with code:', code);
    setIsLoading(true);

    try {
      const result = await verifyTwoFactor(username, code);
      console.log('2FA verification result:', result);

      if (result.success) {
        console.log('2FA successful, navigating to dashboard');
        navigate('/admin/dashboard');
      } else {
        console.log('2FA failed:', result.error);
        setError(result.error);
      }
    } catch (err) {
      console.error('2FA verification error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Canceling 2FA, returning to credentials step');
    setStep('credentials');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-gray-600">Enter your credentials to access the admin panel</p>
        </div>

        {(error || authError) && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error || authError}
          </div>
        )}

        {step === 'credentials' ? (
          <form onSubmit={handleCredentialsSubmit} className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
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
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLogin; 