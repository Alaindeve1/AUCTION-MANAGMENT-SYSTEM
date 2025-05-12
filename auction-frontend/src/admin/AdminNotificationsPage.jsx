import React, { useState } from "react";
import api from "../utils/api";
import { Paper, Button, TextField, Select, MenuItem, Typography, Snackbar, FormControl, InputLabel } from "@mui/material";

const AdminNotificationsPage = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("ALL");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      await api.post("/notifications", {
        title,
        message,
        target, // 'ALL' or 'SIGNED_IN'
      });
      setSnackbar({ open: true, message: "Notification sent!" });
      setTitle("");
      setMessage("");
      setTarget("ALL");
    } catch (err) {
      setSnackbar({ open: true, message: "Failed to send notification." });
    }
    setLoading(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 500, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>Send Notification</Typography>
      <TextField
        label="Title"
        fullWidth
        value={title}
        onChange={e => setTitle(e.target.value)}
        margin="normal"
      />
      <TextField
        label="Message"
        fullWidth
        multiline
        minRows={3}
        value={message}
        onChange={e => setMessage(e.target.value)}
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Target Users</InputLabel>
        <Select
          value={target}
          label="Target Users"
          onChange={e => setTarget(e.target.value)}
        >
          <MenuItem value="ALL">All Users (guests + signed in)</MenuItem>
          <MenuItem value="SIGNED_IN">Signed-in Users (accounts only)</MenuItem>
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleSend}
        disabled={loading || !title || !message}
        sx={{ mt: 2 }}
      >
        Send Notification
      </Button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </Paper>
  );
};

export default AdminNotificationsPage;
