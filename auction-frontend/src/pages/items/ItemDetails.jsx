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
import { jwtDecode } from 'jwt-decode';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [placingBid, setPlacingBid] = useState(false);

  useEffect(() => {
    if (!id) {
      toast.error('Invalid item ID');
      navigate('/items');
      return;
    }

    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const itemResponse = await api.get(`/items/${id}`);
      setItem(itemResponse.data);
      setBids([]);
    } catch (error) {
      console.error('Error fetching item details:', error);
        toast.error('Failed to fetch item details');
        navigate('/items');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async () => {
    if (!id) {
      toast.error('Invalid item ID');
      return;
    }

    if (!user) {
      toast.error('Please log in to place a bid');
      return;
    }

    // Decode the JWT token to get the user ID
    const decodedToken = jwtDecode(user.token);
    const userId = decodedToken.id;

    if (!userId) {
      toast.error('Unable to get user ID');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    try {
      setPlacingBid(true);
      await api.post(`/bids?itemId=${id}&bidderId=${userId}&bidAmount=${amount}`);
      
      toast.success('Bid placed successfully!');
      setBidAmount('');
      fetchItemDetails();
    } catch (error) {
      console.error('Error placing bid:', error);
        toast.error(error.response?.data?.message || 'Failed to place bid');
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
                    ${item.startingPrice}
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
            <Typography color="text.secondary">Bid history is currently unavailable</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ItemDetails; 