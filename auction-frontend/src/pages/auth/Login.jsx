import { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required'),
  password: Yup.string()
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [code, setCode] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        console.log('Login attempt with values:', values);
        const response = await api.post('/api/auth/login', values);
        console.log('Login response:', response.data);
        
        if (!response.data.token) {
          throw new Error('No token received from server');
        }
        
        // Check if 2FA is required
        if (response.data.need2FA) {
          setSecretKey(response.data.secretKey);
          setShow2FA(true);
          return;
        }
        
        localStorage.setItem('token', response.data.token);
        toast.success('Login successful!');
        
        // Redirect to the attempted URL or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } catch (error) {
        console.error('Login error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          headers: error.response?.headers
        });
        setError(error.response?.data?.message || error.message || 'Login failed');
        toast.error(error.response?.data?.message || error.message || 'Login failed');
        setShow2FA(false);
      }
    }
  });

  const handle2FA = async () => {
    try {
      const isValid = await api.post('/api/auth/2fa/verify', {
        secretKey,
        code: parseInt(code)
      });
      
      if (isValid.data) {
        // Complete the login process
        const response = await api.get('/api/auth/me');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('2faSecret', secretKey);
        toast.success('2FA verification successful!');
        
        // Redirect to the attempted URL or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        setError('Invalid verification code');
        toast.error('Invalid verification code');
      }
    } catch (error) {
      setError('Failed to verify 2FA');
      toast.error('Failed to verify 2FA');
    }
  };

  return (
    <AuthLayout>
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        
        {show2FA ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Enter the 6-digit code from your authenticator app:
            </p>
            <input
              type="number"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter verification code"
            />
            <button
              onClick={handle2FA}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Verify
            </button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {formik.touched.username && formik.errors.username && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.username}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>
            
            {error && <p className="text-red-600">{error}</p>}
            
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
            
            <div className="text-center">
              <RouterLink to="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </RouterLink>
            </div>
            <div className="text-center">
              <RouterLink to="/auth/signup" className="text-sm text-blue-600 hover:text-blue-800">
                Don't have an account? Sign up
              </RouterLink>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;