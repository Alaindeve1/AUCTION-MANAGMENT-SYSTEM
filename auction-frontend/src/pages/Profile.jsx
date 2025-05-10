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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Replace with actual logged-in user ID
      const userId = localStorage.getItem('userId') || 1;
      const res = await api.get(`/users/${userId}`);
      setUser(res.data);
      setForm({
        fullName: res.data.fullName || '',
        email: res.data.email || '',
        username: res.data.username || '',
        phone: res.data.phone || '',
      });
    } catch (err) {
      setUser(null);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = localStorage.getItem('userId') || 1;
      await api.put(`/users/${userId}`, {
        ...user,
        ...form,
      });
      setEdit(false);
      fetchProfile();
    } catch (err) {}
    setSaving(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
        <CircularProgress />
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
              {user.fullName ? user.fullName[0] : user.username[0]}
            </Avatar>
            <Typography variant="h5" fontWeight={700} mt={2} mb={0.5}>
              {user.fullName || user.username}
            </Typography>
            <Typography color="text.secondary">@{user.username}</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                fullWidth
                disabled={!edit}
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
                label="Phone"
                name="phone"
                value={form.phone}
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
            Status: <b>{user.status || 'Active'}</b>
          </Typography>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Profile;