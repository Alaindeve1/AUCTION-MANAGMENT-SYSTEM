import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Divider,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Timer as TimerIcon,
  Gavel as GavelIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import api from '../../utils/auth';
import toast from 'react-hot-toast';

const UserBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const fetchUserBids = async () => {
      try {
        const response = await api.get('/bids/user');
        console.log('User bids response:', response.data);
        setBids(response.data);
      } catch (error) {
        console.error('Error fetching user bids:', error);
        if (error.response?.status === 401) {
          toast.error('Please log in to view your bids');
          navigate('/login');
        } else {
          toast.error('Failed to fetch your bids');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserBids();
  }, [navigate]);

  const getBidStatus = (bid) => {
    if (bid.isHighestBid) {
      return {
        label: 'Highest Bid',
        color: 'success',
        icon: <TrendingUpIcon />,
      };
    } else if (bid.isOutbid) {
      return {
        label: 'Outbid',
        color: 'error',
        icon: <TrendingDownIcon />,
      };
    }
    return {
      label: 'Active',
      color: 'info',
      icon: <TimerIcon />,
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        My Bids
      </Typography>

      {bids.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
          <GavelIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            You haven't placed any bids yet
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {bids.map((bid) => {
            const status = getBidStatus(bid);
            return (
              <Grid item xs={12} key={bid.bidId}>
                <Card 
                  sx={{ 
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[4],
                    },
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={bid.itemImageUrl}
                            alt={bid.itemTitle}
                            variant="rounded"
                            sx={{ width: 80, height: 80 }}
                          />
                          <Box>
                            <Typography variant="h6" noWrap>
                              {bid.itemTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Item ID: {bid.itemId}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Your Bid
                          </Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${bid.amount.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Placed on {formatDate(bid.bidDate)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Current Highest Bid
                          </Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${bid.currentHighestBid.toLocaleString()}
                          </Typography>
                          {bid.isHighestBid && (
                            <Chip
                              icon={<TrendingUpIcon />}
                              label="You're winning!"
                              color="success"
                              size="small"
                            />
                          )}
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
                          <Chip
                            icon={status.icon}
                            label={status.label}
                            color={status.color}
                            sx={{ mb: 1 }}
                          />
                          <Tooltip title="View Item">
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/items/${bid.itemId}`)}
                            >
                              <ArrowForwardIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default UserBids; 