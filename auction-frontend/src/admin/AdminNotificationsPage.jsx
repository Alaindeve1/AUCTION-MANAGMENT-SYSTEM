import React, { useState } from "react";
import api from "../utils/api";
import { Paper, Button, TextField, Typography, Snackbar, CircularProgress } from "@mui/material";
import { Send as SendIcon } from '@mui/icons-material';
import toast from 'react-hot-toast';

const AdminNotificationsPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.post("/notifications", {
        title,
        message,
        target: "ALL" // Always send to all users
      });
      toast.success("Notification sent successfully!");
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error('Error sending notification:', err);
      toast.error(err.response?.data?.message || "Failed to send notification.");
    }
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4, bgcolor: 'rgb(31, 41, 55)', color: 'white' }}>
      <Typography variant="h5" gutterBottom fontWeight={700} sx={{ color: 'white' }}>
        Send Notification to All Users
      </Typography>
      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={e => setTitle(e.target.value)}
        margin="normal"
        required
        placeholder="Enter notification title"
        sx={{ 
          '& .MuiOutlinedInput-root': { color: 'white' },
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray.500' }
        }}
      />
      <TextField
        label="Message"
        fullWidth
        multiline
        minRows={3}
        value={message}
        onChange={e => setMessage(e.target.value)}
        margin="normal"
        required
        placeholder="Enter notification message"
        sx={{ 
          '& .MuiOutlinedInput-root': { color: 'white' },
          '& .MuiInputLabel-root': { color: 'white' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray.500' }
        }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSend}
        disabled={loading || !title || !message}
        sx={{ mt: 2 }}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
      >
        {loading ? 'Sending...' : 'Send to All Users'}
      </Button>
    </Paper>
  );
};

export default AdminNotificationsPage;
