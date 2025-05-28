import { useState } from 'react';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../utils/auth';
import { FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';
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
  const { login, error: authError } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const success = await login(values.username, values.password);
        if (success) {
        toast.success('Login successful!');
        // Redirect to the attempted URL or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
        } else {
          setError(authError || 'Login failed');
          toast.error(authError || 'Login failed');
        }
      } catch (error) {
        console.error('Login error:', error);
        setError(error.response?.data?.message || 'Login failed');
        toast.error(error.response?.data?.message || 'Login failed');
      }
    },
  });

  return (
    <AuthLayout>
      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Please sign in to your account</p>
        </motion.div>

        {(error || authError) && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
            <p className="text-red-700">{error || authError}</p>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  formik.touched.username && formik.errors.username
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } focus:outline-none focus:ring-2 transition-colors duration-200`}
                value={formik.values.username}
                onChange={formik.handleChange}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  formik.touched.password && formik.errors.password
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
                } focus:outline-none focus:ring-2 transition-colors duration-200`}
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <RouterLink
              to="/forgot-password"
              className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Forgot password?
            </RouterLink>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 transform hover:scale-[1.02]"
          >
            Sign in
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <RouterLink
                to="/signup"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Sign up
              </RouterLink>
            </p>
          </div>
        </form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-center"
        >
          <RouterLink to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
            >
              <FiHome className="h-5 w-5 text-primary-600" />
              <span className="text-primary-600 font-medium">Back to Home</span>
            </motion.button>
          </RouterLink>
        </motion.div>
      </div>
    </AuthLayout>
  );
};

export default Login; 