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
  IconButton,
  Pagination,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  TextField,
  InputAdornment
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import api from '../utils/api';
import { useAuth } from '../utils/auth';
import toast from 'react-hot-toast';

const Notification = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 6;

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        await fetchNotifications();
      } catch (error) {
        console.error('Error in notification fetch:', error);
        if (isMounted) {
          setError('Failed to load notifications. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // Fetch general notifications (ALL + SIGNED_IN)
      console.log('Fetching general notifications...');
      const generalRes = await api.get('/notifications/general');
      console.log('General notifications:', generalRes.data);

      let userNotifications = [];
      
      if (user && user.id) {
        try {
          console.log('Fetching user notifications for ID:', user.id);
          const userRes = await api.get(`/notifications/user/${user.id}`);
          userNotifications = userRes.data || [];
          console.log('User notifications:', userNotifications);
        } catch (userErr) {
          console.error('Error fetching user notifications:', userErr);
          // Continue with general notifications even if user notifications fail
        }
      }

      // Combine and sort notifications by date (newest first)
      const allNotifications = [...(generalRes.data || []), ...userNotifications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      console.log('Combined notifications:', allNotifications);
      setNotifications(allNotifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      if (err.response && err.response.status === 401) {
        setError('Please log in to view your notifications.');
      } else {
        setError('Failed to load notifications. Please try again later.');
      }
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      fetchNotifications();
      return;
    }

    setLoading(true);
    api.get(`/notifications/search?query=${encodeURIComponent(query)}`)
      .then(response => {
        setNotifications(response.data);
        setError(null);
      })
      .catch(err => {
        console.error('Error searching notifications:', err);
        toast.error('Failed to search notifications');
        setError('Failed to search notifications. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setOpenDialog(true);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedNotification(null);
  };

  const paginatedNotifications = notifications.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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

      {/* Search Bar */}
      <Box mb={4}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search notifications..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
          <NotificationsActiveIcon sx={{ fontSize: 90, color: 'deepskyblue', mb: 2, animation: 'pulse 1.5s infinite alternate' }} />
          <Typography variant="h6" color="error" mt={2}>
            {error}
          </Typography>
        </Box>
      ) : notifications.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
          <NotificationsActiveIcon sx={{ fontSize: 90, color: 'deepskyblue', mb: 2, animation: 'pulse 1.5s infinite alternate' }} />
          <Typography variant="h6" color="info.main" mt={2}>
            {searchQuery ? 'No notifications found matching your search.' : 'No notifications yet.'}
          </Typography>
          <Typography color="text.secondary" mb={2}>
            {searchQuery ? 'Try a different search term.' : 'Important updates about your auctions will appear here.'}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedNotifications.map((notif, idx) => (
              <Grid item xs={12} sm={6} md={4} key={notif.id}>
                <Fade in timeout={600 + idx * 100}>
                  <Card 
                    sx={{ 
                      position: 'relative', 
                      overflow: 'visible', 
                      boxShadow: 6, 
                      background: notif.read ? '#f5f5f5' : '#e3f2fd',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <NotificationsActiveIcon color={notif.read ? 'disabled' : 'primary'} />
                        <Typography variant="subtitle2" fontWeight={notif.read ? 400 : 700} color="primary.main">
                          {notif.title || 'Notification'}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body1" 
                        fontWeight={notif.read ? 400 : 700}
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {notif.message}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Typography color="text.secondary" fontSize={13}>
                          {new Date(notif.createdAt).toLocaleString()}
                        </Typography>
                        <Chip
                          label={notif.read ? 'Read' : 'Unread'}
                          color={notif.read ? 'default' : 'info'}
                          size="small"
                          icon={notif.read ? <CheckCircleIcon fontSize="small" /> : null}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>

          {notifications.length > itemsPerPage && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination 
                count={Math.ceil(notifications.length / itemsPerPage)} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Notification Detail Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedNotification && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={700}>
                  {selectedNotification.title || 'Notification'}
                </Typography>
                <IconButton onClick={handleCloseDialog} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedNotification.message}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
