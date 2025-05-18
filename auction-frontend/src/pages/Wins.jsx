import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import api from '../utils/api';
import { Grid, Card, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const Wins = () => {
    const { user } = useAuth();
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

  useEffect(() => {
  const fetchWins = async () => {
            if (!user?.userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/auction-results/winner/${user.userId}`);
                setWins(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching wins:', error);
                setError('Failed to load wins');
                toast.error('Failed to load wins');
            } finally {
    setLoading(false);
            }
  };

        fetchWins();
    }, [user]);

    if (loading) {
  return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!wins.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>No wins yet</Typography>
        </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {wins.map((win) => (
                <Grid item xs={12} sm={6} md={4} key={win.id}>
                    <Card>
                  <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {win.item.name}
                            </Typography>
                            <Typography color="textSecondary" gutterBottom>
                                Winning Bid: ${win.winningBid.amount}
                    </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Won on: {new Date(win.endTime).toLocaleDateString()}
                    </Typography>
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    href={`/items/${win.item.id}`}
                                >
                                    View Item
                                </Button>
                            </Box>
                  </CardContent>
                </Card>
            </Grid>
          ))}
        </Grid>
  );
};

export default Wins;
