import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Grid,
  Paper,
  CircularProgress,
  Fade,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import api from '../utils/api';
import { useAuth } from '../utils/auth';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log('Auth state:', { authUser, authLoading });
    if (!authLoading) {
      if (authUser) {
        fetchProfile();
      } else {
        setLoading(false);
      }
    }
  }, [authLoading, authUser]);

  const fetchProfile = async () => {
    console.log('Fetching profile for user:', authUser);
    if (!authUser?.username) {
      console.log('No username found in authUser:', authUser);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      console.log('Making API request to:', `/users/username/${authUser.username}`);
      const res = await api.get(`/users/username/${authUser.username}`);
      console.log('API Response:', res.data);
      setUser(res.data);
      setForm({
        username: res.data.username || '',
        email: res.data.email || '',
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      toast.error('Failed to load profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?.userId) return;

    setSaving(true);
    try {
      // Include the current passwordHash to satisfy backend validation
      const updateData = {
        email: form.email,
        username: form.username,
        passwordHash: user.passwordHash // Include the current password hash
      };

      console.log('Sending update request with data:', updateData);
      const response = await api.put(`/users/${user.userId}`, updateData);
      console.log('Update response:', response.data);
      
      setEdit(false);
      fetchProfile();
      toast.success('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      toast.error('Failed to update profile');
    }
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (!authUser) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">Please log in to view your profile.</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box p={3}>
        <Typography variant="h6" color="error">Unable to load profile.</Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={700}>
      <Box p={3}>
        <Paper elevation={4} sx={{ maxWidth: 600, mx: 'auto', p: 4, borderRadius: 4 }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar sx={{ width: 90, height: 90, bgcolor: 'primary.main', fontSize: 40 }}>
              {user.username ? user.username[0].toUpperCase() : '?'}
            </Avatar>
            <Typography variant="h5" fontWeight={700} mt={2} mb={0.5}>
              {user.username}
            </Typography>
            <Typography color="text.secondary">@{user.username}</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Username"
                name="username"
                value={form.username}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                disabled={!edit}
              />
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            {!edit ? (
              <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEdit(true)}>
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </Box>
          <Divider sx={{ my: 3 }} />
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Account Information
          </Typography>
          <Typography color="text.secondary" fontSize={14}>
            Member since: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}<br />
            Status: <b>{user.userStatus || 'Active'}</b>
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Profile;