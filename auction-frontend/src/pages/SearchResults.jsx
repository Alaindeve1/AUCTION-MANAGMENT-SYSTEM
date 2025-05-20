import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState({ items: [], notifications: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    const fetchResults = async () => {
        if (!query) {
        setResults({ items: [], notifications: [] });
          setLoading(false);
          return;
        }

      try {
        setLoading(true);
        setError(null);

        // Only fetch available endpoints
        const [itemsRes, notificationsRes] = await Promise.all([
          api.get(`/items/search?keyword=${encodeURIComponent(query)}`),
          api.get(`/notifications/search?query=${encodeURIComponent(query)}`)
        ]);

        setResults({
          items: itemsRes.data || [],
          notifications: notificationsRes.data || []
        });

        // Set initial active tab based on search type
        if (type === 'notifications') setActiveTab(1);
        else setActiveTab(0);

      } catch (error) {
        console.error('Search error:', error);
        const errorMessage = error.response?.data?.message || 'Failed to fetch search results';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, type]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!query) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">Enter a search term to find content</Typography>
      </Box>
    );
  }

  const totalResults = results.items.length + results.notifications.length;

  if (totalResults === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">No results found matching "{query}"</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
        Search Results for "{query}"
      </Typography>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={`Items (${results.items.length})`} />
        <Tab label={`Notifications (${results.notifications.length})`} />
      </Tabs>

      <Divider sx={{ mb: 3 }} />

      {activeTab === 0 && (
        <Grid container spacing={3}>
          {results.items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.itemId}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {item.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrl}
                    alt={item.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {item.description}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Starting Price: ${item.startingPrice}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      End Date: {format(new Date(item.endDate), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Box>
                  <Chip
                    label={item.itemStatus}
                    color={
                      item.itemStatus === 'ACTIVE' ? 'success' :
                      item.itemStatus === 'ENDED' ? 'warning' :
                      item.itemStatus === 'SOLD' ? 'info' : 'default'
                    }
                    size="small"
                    sx={{ mb: 2 }}
                  />
                  {item.itemStatus === 'ACTIVE' && (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<GavelIcon />}
                      fullWidth
                      href={`/items/${item.itemId}`}
                    >
                      Bid Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {results.notifications.map((notification) => (
            <Grid item xs={12} key={notification.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {notification.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default SearchResults; 