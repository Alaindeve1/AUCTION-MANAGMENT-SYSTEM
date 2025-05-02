import { useState } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, 'Password should be of minimum 8 characters length')
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Please confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords must match'),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/auth/reset-password', {
          token,
          newPassword: values.password,
        });
        toast.success('Password reset successful! Please login with your new password.');
        navigate('/login');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to reset password');
      }
    },
  });

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
            <p className="text-red-700">
              Invalid or expired reset token. Please request a new password reset link.
            </p>
          </div>
          <div className="mt-6">
            <RouterLink
              to="/forgot-password"
              className="text-primary-600 hover:text-primary-500 font-medium transition-colors duration-200"
            >
              Request New Reset Link
            </RouterLink>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600">Enter your new password below</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              } focus:outline-none focus:ring-2 transition-colors duration-200`}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 transform hover:scale-[1.02]"
        >
          Reset Password
        </button>

        <div className="text-center">
          <RouterLink
            to="/login"
            className="text-primary-600 hover:text-primary-500 font-medium transition-colors duration-200"
          >
            Back to Login
          </RouterLink>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword; 