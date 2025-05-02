import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post('/auth/forgot-password', values);
        setSuccess(true);
        toast.success('Password reset instructions sent to your email');
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to process request');
      }
    },
  });

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h1>
        <p className="text-gray-600">Enter your email to reset your password</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg animate-fade-in">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success ? (
        <div className="space-y-6">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
            <p className="text-green-700">
              Password reset instructions have been sent to your email address.
              Please check your inbox and follow the instructions to reset your password.
            </p>
          </div>
          <div className="text-center">
            <RouterLink
              to="/login"
              className="text-primary-600 hover:text-primary-500 font-medium transition-colors duration-200"
            >
              Return to Login
            </RouterLink>
          </div>
        </div>
      ) : (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                formik.touched.email && formik.errors.email
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
              } focus:outline-none focus:ring-2 transition-colors duration-200`}
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 transform hover:scale-[1.02]"
          >
            Send Reset Instructions
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
      )}
    </AuthLayout>
  );
};

export default ForgotPassword; 