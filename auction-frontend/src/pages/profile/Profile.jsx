import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { getUserRole } from '../../utils/auth.jsx';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  currentPassword: Yup.string().when('isChangingPassword', {
    is: true,
    then: (schema) => schema.required('Current password is required'),
  }),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .when('isChangingPassword', {
      is: true,
      then: (schema) => schema.required('New password is required'),
    }),
  confirmPassword: Yup.string().when('isChangingPassword', {
    is: true,
    then: (schema) =>
      schema
        .required('Please confirm your password')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  }),
});

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userData, setUserData] = useState(null);

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isChangingPassword) {
          await api.put('/users/change-password', {
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          });
          toast.success('Password changed successfully');
          setIsChangingPassword(false);
          formik.resetForm({
            values: {
              ...formik.values,
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            },
          });
        } else {
          const { currentPassword, newPassword, confirmPassword, ...updateData } = values;
          await api.put('/users/profile', updateData);
          toast.success('Profile updated successfully');
          fetchUserData();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    },
  });

  const fetchUserData = async () => {
    try {
      const response = await api.get('/users/profile');
      setUserData(response.data);
      formik.setValues({
        username: response.data.username,
        email: response.data.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              <form onSubmit={formik.handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="username"
                  label="Username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="email"
                  label="Email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              {!isChangingPassword ? (
                <Button
                  variant="outlined"
                  onClick={() => setIsChangingPassword(true)}
                  fullWidth
                >
                  Change Password
                </Button>
              ) : (
                <form onSubmit={formik.handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    value={formik.values.currentPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.currentPassword && Boolean(formik.errors.currentPassword)}
                    helperText={formik.touched.currentPassword && formik.errors.currentPassword}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    name="newPassword"
                    label="New Password"
                    type="password"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                    helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                    >
                      Update Password
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsChangingPassword(false);
                        formik.resetForm({
                          values: {
                            ...formik.values,
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: '',
                          },
                        });
                      }}
                      fullWidth
                    >
                      Cancel
                    </Button>
                  </Box>
                </form>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Statistics
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">Role</Typography>
                  <Typography variant="h6" color="primary">
                    {getUserRole()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">Total Bids</Typography>
                  <Typography variant="h6" color="primary">
                    {userData?.totalBids || 0}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle1">Won Auctions</Typography>
                  <Typography variant="h6" color="primary">
                    {userData?.wonAuctions || 0}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 