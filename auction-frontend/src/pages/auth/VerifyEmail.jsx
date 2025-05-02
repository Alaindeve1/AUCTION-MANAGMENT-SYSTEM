import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Link,
  Alert,
  CircularProgress,
} from '@mui/material';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setError('Invalid verification link');
        return;
      }

      try {
        await api.post('/auth/verify-email', { token });
        setStatus('success');
        toast.success('Email verified successfully!');
      } catch (error) {
        setStatus('error');
        setError(error.response?.data?.message || 'Failed to verify email');
      }
    };

    verifyEmail();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Verifying your email...
            </Typography>
          </Box>
        );

      case 'success':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="success" sx={{ mb: 3 }}>
              Your email has been verified successfully!
            </Alert>
            <Button
              variant="contained"
              color="primary"
              component={RouterLink}
              to="/login"
              fullWidth
            >
              Proceed to Login
            </Button>
          </Box>
        );

      case 'error':
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/login"
                fullWidth
              >
                Back to Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate(-1)}
                fullWidth
              >
                Go Back
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <Typography component="h1" variant="h5" align="center" gutterBottom>
        Email Verification
      </Typography>
      {renderContent()}
    </AuthLayout>
  );
};

export default VerifyEmail; 