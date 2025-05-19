import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  TextField,
  Button,
  Paper,
  Divider
} from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../utils/auth';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [placingBid, setPlacingBid] = useState(false);

  useEffect(() => {
    console.log('ItemDetails mounted with ID:', id);
    console.log('Auth state:', { isAuthenticated, user });
    
    if (!isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      toast.error('Please log in to view item details');
      navigate('/login');
      return;
    }

    if (!id) {
      console.log('No item ID provided');
      toast.error('Invalid item ID');
      navigate('/items');
      return;
    }

    fetchItemDetails();
  }, [id, isAuthenticated, user]);

  const fetchItemDetails = async () => {
    if (!id) {
      console.log('No item ID in fetchItemDetails');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching details for item:', id);
      
      const [itemResponse, bidsResponse] = await Promise.all([
        api.get(`/items/${id}`),
        api.get(`/items/${id}/bids`)
      ]);
      
      console.log('Item response:', itemResponse.data);
      console.log('Bids response:', bidsResponse.data);
      
      setItem(itemResponse.data);
      setBids(bidsResponse.data);
    } catch (error) {
      console.error('Error fetching item details:', error);
      if (error.response?.status === 401) {
        console.log('Unauthorized access, redirecting to login');
        toast.error('Please log in to view item details');
        navigate('/login');
      } else {
        toast.error('Failed to fetch item details');
        navigate('/items');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!isAuthenticated || !user) {
      console.log('User not authenticated for placing bid');
      toast.error('Please log in to place a bid');
      navigate('/login');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    try {
      setPlacingBid(true);
      console.log('Placing bid:', { itemId: id, bidderId: user.id, amount });
      
      await api.post('/bids', {
        itemId: id,
        bidderId: user.id,
        bidAmount: amount
      });
      
      toast.success('Bid placed successfully!');
      setBidAmount('');
      fetchItemDetails();
    } catch (error) {
      console.error('Error placing bid:', error);
      if (error.response?.status === 401) {
        toast.error('Please log in to place a bid');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to place bid');
      }
    } finally {
      setPlacingBid(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!item) {
    return (
      <Box textAlign="center" py={8}>
        <Typography color="text.secondary">Item not found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">{item.title}</Typography>
        <Chip
          label={item.itemStatus}
          color={
            item.itemStatus === 'ACTIVE' ? 'success' :
            item.itemStatus === 'ENDED' ? 'warning' :
            item.itemStatus === 'SOLD' ? 'info' : 'default'
          }
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            {item.imageUrl && (
              <Box
                component="img"
                src={item.imageUrl}
                alt={item.title}
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover'
                }}
              />
            )}
            <CardContent>
              <Typography variant="h6" gutterBottom>Description</Typography>
              <Typography color="text.secondary" paragraph>{item.description}</Typography>
              
              <Typography variant="h6" gutterBottom>Details</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Starting Price</Typography>
                  <Typography variant="body1">${item.startingPrice}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Current Highest Bid</Typography>
                  <Typography variant="body1">
                    ${bids.length > 0 ? Math.max(...bids.map(b => b.bidAmount)) : item.startingPrice}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Start Date</Typography>
                  <Typography variant="body1">
                    {format(new Date(item.startDate), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">End Date</Typography>
                  <Typography variant="body1">
                    {format(new Date(item.endDate), 'MMM dd, yyyy HH:mm')}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Place a Bid</Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Your Bid Amount"
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                InputProps={{
                  startAdornment: '$'
                }}
                disabled={item.itemStatus !== 'ACTIVE' || placingBid}
              />
            </Box>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<GavelIcon />}
              onClick={handlePlaceBid}
              disabled={item.itemStatus !== 'ACTIVE' || placingBid}
            >
              {placingBid ? <CircularProgress size={24} /> : 'Place Bid'}
            </Button>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>Bid History</Typography>
            {bids.length === 0 ? (
              <Typography color="text.secondary">No bids yet</Typography>
            ) : (
              <Box>
                {bids.map((bid) => (
                  <Box key={bid.bidId} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {bid.bidderUsername} - ${bid.bidAmount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(new Date(bid.bidTime), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemDetails; 