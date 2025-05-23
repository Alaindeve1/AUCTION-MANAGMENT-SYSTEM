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
import api from '../../utils/api';
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
        toast.error('Failed to fetch bids');
      } finally {
        setLoading(false);
      }
    };

    fetchUserBids();
  }, []);

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
    <Box sx={{ p: { xs: 1, sm: 2 }, maxWidth: 1200, mx: 'auto' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          mb: { xs: 1, sm: 2 }, 
          fontSize: { xs: '1.5rem', sm: '2rem' },
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        My Bids
      </Typography>

      {bids.length === 0 ? (
        <Paper sx={{ p: { xs: 2, sm: 3 }, textAlign: 'center' }}>
          <GavelIcon sx={{ fontSize: { xs: 40, sm: 60 }, color: 'text.secondary', mb: 1 }} />
          <Typography variant="h6" color="text.secondary">
            You haven't placed any bids yet
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={1}>
          {bids.map((bid) => {
            const status = getBidStatus(bid);
            return (
              <Grid item xs={12} key={bid.bidId}>
                <Card sx={{ mb: 1 }}>
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    {/* Item Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar
                        src={bid.itemImageUrl}
                        alt={bid.itemTitle}
                        variant="rounded"
                        sx={{ width: { xs: 50, sm: 60 }, height: { xs: 50, sm: 60 } }}
                      />
                      <Box sx={{ ml: 1, flex: 1 }}>
                        <Typography variant="subtitle1" noWrap>
                          {bid.itemTitle}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ID: {bid.itemId}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 1 }} />

                    {/* Bid Details */}
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Your Bid
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ${bid.amount.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(bid.bidDate)}
                        </Typography>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Highest Bid
                        </Typography>
                        <Typography variant="h6" color="primary">
                          ${bid.currentHighestBid.toLocaleString()}
                        </Typography>
                        {bid.isHighestBid && (
                          <Chip
                            icon={<TrendingUpIcon />}
                            label="Winning"
                            color="success"
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 1 }} />

                    {/* Status and Action */}
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      mt: 1
                    }}>
                      <Chip
                        icon={status.icon}
                        label={status.label}
                        color={status.color}
                        size="small"
                      />
                      <Tooltip title="View Item">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/items/${bid.itemId}`)}
                          size="small"
                        >
                          <ArrowForwardIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
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