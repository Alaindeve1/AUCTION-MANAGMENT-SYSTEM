import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  TextField,
  CircularProgress,
  Chip
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Bids = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidValues, setBidValues] = useState({});
  const [placingBid, setPlacingBid] = useState({});

  useEffect(() => {
    fetchActiveItems();
    // For real-time, you could use websockets or polling here
    // Example: const interval = setInterval(fetchActiveItems, 5000); return () => clearInterval(interval);
  }, []);

  const fetchActiveItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items', { params: { status: 'ACTIVE' } });
      setItems(res.data.items || []);
    } catch (err) {
      toast.error('Failed to fetch active items');
    }
    setLoading(false);
  };

  const handleBidChange = (itemId, value) => {
    setBidValues((prev) => ({ ...prev, [itemId]: value }));
  };

  const handlePlaceBid = async (item) => {
    const bidAmount = parseFloat(bidValues[item.id]);
    if (!bidAmount || bidAmount <= item.currentBid) {
      toast.error('Enter a valid bid higher than current');
      return;
    }
    setPlacingBid((prev) => ({ ...prev, [item.id]: true }));
    try {
      await api.post(`/bids`, { itemId: item.id, amount: bidAmount });
      toast.success('Bid placed!');
      fetchActiveItems(); // refresh
      setBidValues((prev) => ({ ...prev, [item.id]: '' }));
    } catch (err) {
      toast.error('Failed to place bid');
    }
    setPlacingBid((prev) => ({ ...prev, [item.id]: false }));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight={700} mb={4} color="primary.main">
        Live Auctions
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No active auctions at the moment.</Typography>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {item.imageUrl && (
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.imageUrl}
                    alt={item.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>{item.title}</Typography>
                  <Typography color="text.secondary" mb={1}>
                    {item.description}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <GavelIcon fontSize="small" color="primary" />
                    <Typography variant="body2">
                      Current Bid: <b>${item.currentBid?.toFixed(2) || item.startingPrice?.toFixed(2) || '0.00'}</b>
                    </Typography>
                  </Box>
                  <Chip label={`Time left: ${item.timeLeft || 'N/A'}`} color="secondary" size="small" />
                </CardContent>
                <CardActions sx={{ mt: 'auto', p: 2 }}>
                  <TextField
                    size="small"
                    variant="outlined"
                    label="Your Bid"
                    type="number"
                    value={bidValues[item.id] || ''}
                    onChange={e => handleBidChange(item.id, e.target.value)}
                    sx={{ mr: 2, width: 110 }}
                    inputProps={{ min: (item.currentBid || item.startingPrice || 0) + 0.01, step: 0.01 }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={placingBid[item.id]}
                    onClick={() => handlePlaceBid(item)}
                  >
                    {placingBid[item.id] ? <CircularProgress size={22} /> : 'Place Bid'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Bids;