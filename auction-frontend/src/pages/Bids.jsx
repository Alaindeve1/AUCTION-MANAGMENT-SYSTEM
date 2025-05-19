import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { format } from 'date-fns';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../utils/auth';

const Bids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserBids = async () => {
    console.log('Current user:', user); // Debug log
    
    if (!user?.id) {
      console.log('No user ID found, skipping fetch'); // Debug log
    setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching bids for user:', user.id); // Debug log
      const response = await api.get(`/bids/user/${user.id}`);
      console.log('User bids response:', response.data);
      setBids(response.data);
    } catch (error) {
      console.error('Error fetching user bids:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error('Failed to fetch your bids');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, user:', user); // Debug log
    fetchUserBids();
  }, [user?.id]);

  // Debug log for render
  console.log('Render state:', { loading, bidsCount: bids.length, userId: user?.id });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">My Bids</Typography>
        </Box>

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bids.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">You haven't placed any bids yet</Typography>
                </TableCell>
              </TableRow>
            ) : (
              bids.map((bid) => (
                <TableRow key={bid.bidId}>
                  <TableCell>{bid.itemTitle}</TableCell>
                  <TableCell align="right">${bid.bidAmount}</TableCell>
                  <TableCell>
                    {format(new Date(bid.bidTime), 'MMM dd, yyyy HH:mm')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={bid.isWinningBid ? 'Winning' : 'Outbid'}
                      color={bid.isWinningBid ? 'success' : 'default'}
                    size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Bids;