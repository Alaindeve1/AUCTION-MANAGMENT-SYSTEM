import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AdminNotifications = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create notification for all users
      await api.post('/notifications', {
        title,
        message,
        target: 'ALL' // Send to all users
      });

      toast.success('Notification sent successfully!');
      setTitle('');
      setMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send notification';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
        Send Notification
      </Typography>

      <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            required
            placeholder="Enter notification title"
          />

          <TextField
            fullWidth
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            margin="normal"
            required
            multiline
            rows={4}
            placeholder="Enter notification message"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            disabled={loading}
            sx={{ mt: 3 }}
            fullWidth
          >
            {loading ? 'Sending...' : 'Send to All Users'}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminNotifications; 