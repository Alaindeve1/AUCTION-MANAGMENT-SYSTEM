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
  Fade
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import api from '../utils/api';

const Wins = () => {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWins();
  }, []);

  const fetchWins = async () => {
    setLoading(true);
    try {
      // Replace with actual logged-in user ID
      const userId = localStorage.getItem('userId') || 1;
      const res = await api.get(`/auction-results/winner/${userId}`);
      setWins(res.data || []);
    } catch (err) {
      setWins([]);
    }
    setLoading(false);
  };

  return (
    <Box p={3}>
      <Fade in timeout={800}>
        <Box>
          <Typography variant="h4" fontWeight={700} mb={1} color="success.main">
            Congratulations!
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            "These are the auctions you've conquered. Claim your treasures!"
          </Typography>
        </Box>
      </Fade>
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
                      Ended: {win.endDate ? new Date(win.endDate).toLocaleString() : ''}
                    </Typography>
                    <Chip label={win.resultStatus} color={win.resultStatus==="COMPLETED"?"success":"warning"} size="small" />
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

export default Wins;
