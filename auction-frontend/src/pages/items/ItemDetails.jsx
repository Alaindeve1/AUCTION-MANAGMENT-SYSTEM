import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  CircularProgress,
  Grid,
  Chip,
  Paper,
  Divider
} from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';
import api from '../../utils/api';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscribeToItemBidUpdates, placeBid, isConnected } = useWebSocket();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [placingBid, setPlacingBid] = useState(false);

  useEffect(() => {
  const fetchItemDetails = async () => {
    try {
      setLoading(true);
        const response = await api.get(`/items/${id}`);
        console.log('Item details response:', response.data);
        setItem(response.data);
    } catch (error) {
      console.error('Error fetching item details:', error);
        toast.error('Failed to fetch item details');
    } finally {
      setLoading(false);
    }
  };

    fetchItemDetails();
  }, [id]);

  useEffect(() => {
    if (!item?.itemId) return;

    const unsubscribe = subscribeToItemBidUpdates(item.itemId, (bidUpdate) => {
      console.log('Received bid update:', bidUpdate);
      if (bidUpdate.amount) {
        setItem(prev => ({
          ...prev,
          currentHighestBid: bidUpdate.amount,
          highestBidder: bidUpdate.bidderId,
          highestBidderName: bidUpdate.bidderName
        }));

        // Show notification if the current user was outbid
        if (user && bidUpdate.bidderId !== user.id) {
          toast(`New bid placed: $${bidUpdate.amount}`, {
            icon: '💰',
            duration: 5000,
          });
        }
      }
    });

    return () => unsubscribe();
  }, [item?.itemId, subscribeToItemBidUpdates, user]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast.error('Connection lost. Please refresh the page and try again.');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }

    if (amount <= (item.currentHighestBid || item.startingPrice)) {
      setBidError(`Bid must be higher than $${(item.currentHighestBid || item.startingPrice).toLocaleString()}`);
      return;
    }

    setPlacingBid(true);
    setBidError('');

    try {
      console.log('Placing bid for item:', item.itemId);
      const success = placeBid({
        itemId: item.itemId,
        amount
      });

      if (success) {
        setBidAmount('');
        toast.success('Processing your bid...');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid. Please try again.');
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Item not found
        </Typography>
      </Box>
    );
  }

  const isActive = item.itemStatus === 'ACTIVE';
  const isSold = item.itemStatus === 'SOLD';
  const isEnded = item.itemStatus === 'ENDED';

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={item.imageUrl ? `http://localhost:8080${item.imageUrl}` : 'https://via.placeholder.com/600x400?text=No+Image'}
              alt={item.title}
              sx={{ 
                objectFit: 'cover',
                height: '400px',
                width: '100%'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/600x400?text=No+Image';
              }}
            />
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={isActive ? 'Live' : isSold ? 'Sold' : 'Ended'} 
                  color={isActive ? 'success' : isSold ? 'error' : 'warning'} 
                  sx={{ mb: 2 }}
                />
                <Typography variant="h4" component="h1" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {item.description}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Category
                    </Typography>
                    <Typography variant="body1">
                      {item.categoryName || 'N/A'}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Starting Price
                    </Typography>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      ${item.startingPrice.toLocaleString()}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Current Highest Bid
                    </Typography>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      ${(item.currentHighestBid || item.startingPrice).toLocaleString()}
                  </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Start Date
                    </Typography>
                  <Typography variant="body1">
                      {item.startDate ? new Date(item.startDate).toLocaleString() : 'Not set'}
                  </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      End Date
                    </Typography>
                  <Typography variant="body1">
                      {item.endDate ? new Date(item.endDate).toLocaleString() : 'Not set'}
                  </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {isActive && (
                <Box component="form" onSubmit={handleBidSubmit} sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Place Your Bid
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                fullWidth
                      label="Bid Amount"
                type="number"
                value={bidAmount}
                      onChange={(e) => {
                        setBidAmount(e.target.value);
                        setBidError('');
                      }}
                      error={Boolean(bidError)}
                      helperText={bidError}
                      disabled={placingBid || !isConnected}
                InputProps={{
                        startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
              />
            <Button
                      type="submit"
              variant="contained"
              color="primary"
                      size="large"
              startIcon={<GavelIcon />}
                      disabled={placingBid || !isConnected}
                      sx={{ minWidth: 150 }}
            >
                      {placingBid ? 'Placing Bid...' : 'Place Bid'}
            </Button>
                  </Box>
                  
                  {!isConnected && (
                    <Typography color="error" sx={{ mt: 1 }}>
                      Connection lost. Please refresh the page to place a bid.
                    </Typography>
                  )}
                </Box>
              )}

              {!isActive && (
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Typography 
                    variant="h6" 
                    color={isSold ? 'error' : 'text.secondary'}
                    sx={{ fontStyle: 'italic' }}
                  >
                    {isSold ? 'This item has been sold' : 'This auction has ended'}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemDetails; 