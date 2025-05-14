import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import { api } from '../utils/api';
import { Grid, Card, CardContent, Typography, Button, Box, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';

const Bids = () => {
    const { user } = useAuth();
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBids = async () => {
            if (!user?.userId) {
                setLoading(false);
                return;
            }

            try {
                const response = await api.get(`/api/bids/user/${user.userId}`);
                setBids(response.data);
                setError(null);
            } catch (error) {
                console.error('Error fetching bids:', error);
                setError('Failed to load bids');
                toast.error('Failed to load bids');
            } finally {
                setLoading(false);
            }
        };

        fetchBids();
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

    if (!bids.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>No bids yet</Typography>
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            {bids.map((bid) => (
                <Grid item xs={12} sm={6} md={4} key={bid.bidId}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                {bid.item.name}
                            </Typography>
                            <Typography color="textSecondary" gutterBottom>
                                Bid Amount: ${bid.amount}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Placed on: {new Date(bid.timestamp).toLocaleDateString()}
                            </Typography>
                            <Box mt={2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    href={`/items/${bid.item.id}`}
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

export default Bids;