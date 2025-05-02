import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';

const validationSchema = Yup.object({
  username: Yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
});

const SignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { confirmPassword, ...registrationData } = values;
        await api.post('/auth/register', registrationData);
        toast.success('Account created successfully! Please log in.');
        navigate('/login');
      } catch (error) {
        console.error('Registration error:', error);
        setError(error.response?.data || 'Registration failed');
        toast.error(error.response?.data || 'Registration failed');
      }
    },
  });

  return (
    <AuthLayout>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join our auction platform today</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mt-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.username}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-2 text-sm text-red-600">{formik.errors.confirmPassword}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <RouterLink to="/login" className="text-primary-600 hover:text-primary-500">
              Sign in
            </RouterLink>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default SignUp; 