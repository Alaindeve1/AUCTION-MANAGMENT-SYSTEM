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
  Chip
} from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../utils/api';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = searchParams.get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Use the correct parameter name 'keyword' instead of 'query'
        const response = await api.get(`/items/search?keyword=${encodeURIComponent(query)}`);
        console.log('Search results:', response.data); // Debug log
        setResults(response.data);
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
  }, [query]);

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
        <Typography color="text.secondary">Enter a search term to find items</Typography>
      </Box>
    );
  }

  if (results.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="text.secondary">No items found matching "{query}"</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="primary.main" mb={3}>
        Search Results for "{query}"
      </Typography>

      <Grid container spacing={3}>
        {results.map((item) => (
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
    </Box>
  );
};

export default SearchResults; 