import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Fade,
  Alert
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import api from '../utils/api';

const Wins = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWins();
  }, []);

  const fetchWins = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get userId from localStorage or use a default value
      const userId = localStorage.getItem('userId') || '1';
      console.log('Fetching wins for user:', userId);
      const res = await api.get(`/auction-results/winner/${userId}`);
      console.log('Wins response:', res.data);
      setWins(res.data || []);
    } catch (err) {
      console.error('Error fetching wins:', err);
      setError('Failed to load your wins. Please try again later.');
      setWins([]);
    }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Fade in timeout={800}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1} color="success.main">
            Your Auction Wins
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            "These are the auctions you've conquered. Claim your treasures!"
          </Typography>
        </Box>
      </Fade>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : wins.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={6}>
          <EmojiEventsIcon sx={{ fontSize: 90, color: 'gold', mb: 2, animation: 'pulse 1.5s infinite alternate' }} />
          <Typography variant="h6" color="success.main" mt={2}>
            No wins yet. Keep bidding!
          </Typography>
          <Typography color="text.secondary" mb={2}>
            Your victories will appear here when you win an auction.
          </Typography>
          <Button variant="contained" color="primary" href="/items">
            Browse Active Auctions
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {wins.map((win, idx) => (
            <Grid item xs={12} sm={6} md={4} key={win.resultId}>
              <Fade in timeout={600 + idx * 100}>
                <Card sx={{ position: 'relative', overflow: 'visible', boxShadow: 6 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>{win.itemTitle}</Typography>
                    <Typography color="text.secondary" mb={1}>
                      Final Price: <b>${win.finalPrice?.toFixed(2) || '0.00'}</b>
                    </Typography>
                    <Typography color="text.secondary" mb={1}>
                      Ended: {win.endDate ? new Date(win.endDate).toLocaleString() : 'N/A'}
                    </Typography>
                    <Chip 
                      label={win.resultStatus} 
                      color={win.resultStatus === "COMPLETED" ? "success" : "warning"} 
                      size="small" 
                    />
                  </CardContent>
                  <CardActions>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      href={`/items/${win.itemId}`}
                      fullWidth
                    >
                      View Item Details
                    </Button>
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

export default Wins;
