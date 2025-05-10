import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Fade,
  IconButton
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../utils/api';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Replace with actual logged-in user ID
      const userId = localStorage.getItem('userId') || 1;
      const res = await api.get(`/notifications/user/${userId}`);
      setNotifications(res.data || []);
    } catch (err) {
      setNotifications([]);
    }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Fade in timeout={800}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1} color="info.main">
            Notifications
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            "Stay updated with your auction activities!"
          </Typography>
        </Box>
      </Fade>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : notifications.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
          <NotificationsActiveIcon sx={{ fontSize: 90, color: 'deepskyblue', mb: 2, animation: 'pulse 1.5s infinite alternate' }} />
          <Typography variant="h6" color="info.main" mt={2}>
            No notifications yet.
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Important updates about your auctions will appear here.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {notifications.map((notif, idx) => (
            <Grid item xs={12} sm={6} md={4} key={notif.id}>
              <Fade in timeout={600 + idx * 100}>
                <Card sx={{ position: 'relative', overflow: 'visible', boxShadow: 6, background: notif.read ? '#f5f5f5' : '#e3f2fd' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <NotificationsActiveIcon color={notif.read ? 'disabled' : 'primary'} />
                      <Typography variant="body1" fontWeight={notif.read ? 400 : 700}>
                        {notif.message}
                      </Typography>
                    </Box>
                    <Typography color="text.secondary" mb={1} fontSize={13}>
                      {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}
                    </Typography>
                    <Chip
                      label={notif.read ? 'Read' : 'Unread'}
                      color={notif.read ? 'default' : 'info'}
                      size="small"
                      icon={notif.read ? <CheckCircleIcon fontSize="small" /> : null}
                    />
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }
      `}</style>
    </Box>
  );
};

export default Notification;
