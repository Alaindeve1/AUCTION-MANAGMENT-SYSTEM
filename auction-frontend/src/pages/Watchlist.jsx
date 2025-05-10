import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Fade
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import api from '../utils/api';
import StarOutlineIcon from '@mui/icons-material/StarOutline';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      // You should replace this with the actual logged-in user ID
      const userId = localStorage.getItem('userId') || 1;
      const res = await api.get(`/favorites/user/${userId}`);
      setItems(res.data || []);
    } catch (err) {
      setItems([]);
    }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Fade in timeout={800}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1} color="secondary.main">
            Your Watchlist
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            "Keep an eye on treasures you love! Bid before they're gone."
          </Typography>
        </Box>
      </Fade>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
          <StarOutlineIcon sx={{ fontSize: 90, color: 'gold', mb: 2, animation: 'pulse 1.5s infinite alternate' }} />
          <Typography variant="h6" color="primary" mt={2}>
            Your watchlist is sparkling clean!
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Start adding items to keep track of auctions you care about.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((fav, idx) => (
            <Grid item xs={12} sm={6} md={4} key={fav.id}>
              <Fade in timeout={600 + idx * 100}>
                <Card sx={{ position: 'relative', overflow: 'visible', boxShadow: 6 }}>
                  <FavoriteIcon sx={{ position: 'absolute', top: -18, right: 16, color: 'red', fontSize: 36, zIndex: 2, animation: 'pulse 1.5s infinite alternate' }} />
                  {fav.itemImageUrl && (
                    <CardMedia
                      component="img"
                      height="180"
                      image={fav.itemImageUrl}
                      alt={fav.itemTitle}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>{fav.itemTitle}</Typography>
                    <Typography color="text.secondary" mb={1}>
                      Added to watchlist: {fav.createdAt ? new Date(fav.createdAt).toLocaleDateString() : ''}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button variant="contained" color="primary">View Item</Button>
                  </CardActions>
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

export default Watchlist;
