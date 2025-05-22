import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWebSocket } from '../../contexts/WebSocketContext';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  MenuItem,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Gavel as GavelIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DataTable from '../../components/common/DataTable';
import api from '../../utils/api';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  startingPrice: Yup.number()
    .required('Starting price is required')
    .min(0, 'Price must be positive'),
  categoryId: Yup.string().required('Category is required'),
});

const Items = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusTab, setStatusTab] = useState('ACTIVE'); // ACTIVE, ENDED, SOLD
  const [loading, setLoading] = useState(true);
  const [currentBids, setCurrentBids] = useState({});
  const { subscribeToBidUpdates, subscribeToItemBidUpdates, placeBid, isConnected } = useWebSocket();
  const itemSubscriptions = useRef(new Map());
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      startingPrice: '',
      categoryId: '',
      startDate: '',
      endDate: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedItem) {
          await api.put(`/items/${selectedItem.id}`, values);
          toast.success('Item updated successfully');
        } else {
          await api.post('/items', values);
          toast.success('Item created successfully');
        }
        handleClose();
        fetchItems();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    },
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      console.log('Fetching items with status:', statusTab);

      const response = await api.get(`/items/status/${statusTab}`);
      console.log('Raw API Response:', response);
      console.log('API Response data:', response.data);

      // Handle both paginated and non-paginated responses
      let itemsData;
      if (Array.isArray(response.data)) {
        itemsData = response.data;
      } else if (response.data.content) {
        itemsData = response.data.content;
      } else {
        itemsData = [];
      }

      console.log('Processed items data:', itemsData);
      
      // Initialize current bids from the fetched items
      const initialBids = {};
      itemsData.forEach(item => {
        if (!item) {
          console.warn('Null or undefined item found in response');
          return;
        }
        
        console.log('Processing item:', item);
        
        if (item.currentBid) {
          initialBids[item.id] = {
            amount: item.currentBid,
            bidderId: item.highestBidder,
            bidderName: item.highestBidderName || 'Anonymous',
            timestamp: new Date().toISOString()
          };
        } else {
          // Set initial bid to starting price if no bids yet
          initialBids[item.id] = {
            amount: item.startingPrice,
            bidderId: null,
            bidderName: 'No bids yet',
            timestamp: null
          };
        }
      });
      
      console.log('Initial bids:', initialBids);
      setCurrentBids(initialBids);
      setItems(itemsData);
      setTotalCount(itemsData.length);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      console.log('Categories response:', response.data);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    }
  };

  const handleBid = async (itemId, currentPrice) => {
    if (!currentUser) {
      toast.error('Please log in to place a bid');
      return;
    }

    if (!itemId) {
      console.error('Invalid itemId in handleBid:', itemId);
      toast.error('Invalid item ID');
      return;
    }

    const bidAmount = parseFloat(prompt('Enter your bid amount:'));
    if (isNaN(bidAmount) || bidAmount <= currentPrice) {
      toast.error('Bid amount must be higher than the current price');
      return;
    }

    try {
      // Place bid via WebSocket
      const success = placeBid({
        itemId: String(itemId), // Ensure itemId is a string
        amount: bidAmount,
        userId: currentUser.id,
      });
      
      if (success) {
        toast.success('Processing your bid...');
      }
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('Failed to place bid. Please try again.');
    }
  };

  const handleBidUpdate = useCallback((bidUpdate) => {
    console.log('Received bid update:', bidUpdate);
    
    // Update the current bids state
    setCurrentBids(prev => ({
      ...prev,
      [bidUpdate.itemId]: {
        amount: bidUpdate.amount,
        bidderId: bidUpdate.bidderId,
        bidderName: bidUpdate.bidderName,
        timestamp: new Date().toISOString()
      }
    }));

    // Update the items list with the new bid
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === bidUpdate.itemId 
          ? { 
              ...item, 
              currentBid: bidUpdate.amount,
              highestBidder: bidUpdate.bidderId,
              highestBidderName: bidUpdate.bidderName
            } 
          : item
      )
    );

    // Show notification if the current user was outbid
    if (currentUser && bidUpdate.bidderId !== currentUser.id) {
      toast(`You've been outbid on item #${bidUpdate.itemId} with $${bidUpdate.amount}`, {
        icon: '💰',
        duration: 5000,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    fetchItems();
    fetchCategories();

    // Subscribe to general bid updates
    const unsubscribeGeneral = subscribeToBidUpdates(handleBidUpdate);

    // Subscribe to item-specific bid updates
    items.forEach(item => {
      if (!item || !item.id) {
        console.warn('Invalid item found in items array:', item);
        return;
      }
      
      console.log(`Setting up subscription for item ${item.id}`);
      if (!itemSubscriptions.current.has(item.id)) {
        const unsubscribe = subscribeToItemBidUpdates(item.id, handleBidUpdate);
        itemSubscriptions.current.set(item.id, unsubscribe);
      }
    });

    return () => {
      // Cleanup all subscriptions
      unsubscribeGeneral();
      itemSubscriptions.current.forEach((unsubscribe, itemId) => {
        console.log(`Cleaning up subscription for item ${itemId}`);
        unsubscribe();
      });
      itemSubscriptions.current.clear();
    };
  }, [statusTab, subscribeToBidUpdates, subscribeToItemBidUpdates, handleBidUpdate]);

  // Update subscriptions when items change
  useEffect(() => {
    // Unsubscribe from removed items
    itemSubscriptions.current.forEach((unsubscribe, itemId) => {
      if (!items.find(item => item && item.id === itemId)) {
        console.log(`Removing subscription for removed item ${itemId}`);
        unsubscribe();
        itemSubscriptions.current.delete(itemId);
      }
    });

    // Subscribe to new items
    items.forEach(item => {
      if (!item || !item.id) {
        console.warn('Invalid item found in items array:', item);
        return;
      }
      
      if (!itemSubscriptions.current.has(item.id)) {
        console.log(`Adding subscription for new item ${item.id}`);
        const unsubscribe = subscribeToItemBidUpdates(item.id, handleBidUpdate);
        itemSubscriptions.current.set(item.id, unsubscribe);
      }
    });
  }, [items, subscribeToItemBidUpdates, handleBidUpdate]);

  useEffect(() => {
    if (!items.length) return;

    // Subscribe to updates for each item
    items.forEach(item => {
      if (!itemSubscriptions.current.has(item.id)) {
        const unsubscribe = subscribeToItemBidUpdates(item.id, handleBidUpdate);
        itemSubscriptions.current.set(item.id, unsubscribe);
      }
    });

    // Clean up subscriptions when component unmounts or items change
    return () => {
      itemSubscriptions.current.forEach(unsubscribe => {
        if (unsubscribe) unsubscribe();
      });
      itemSubscriptions.current.clear();
    };
  }, [items, subscribeToItemBidUpdates, handleBidUpdate]);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [page, rowsPerPage, searchTerm, statusTab]);

  const handleOpen = (item = null) => {
    setSelectedItem(item);
    if (item) {
      formik.setValues({
        title: item.title || '',
        description: item.description || '',
        startingPrice: item.startingPrice || '',
        categoryId: item.categoryId || '',
        startDate: item.startDate || '',
        endDate: item.endDate || '',
      });
    } else {
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    formik.resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        toast.success('Item deleted successfully');
        fetchItems();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleBidClick = (item) => {
    console.log('Bid button clicked, full item object:', JSON.stringify(item, null, 2));
    
    if (!item) {
      console.error('handleBidClick received null or undefined item');
      toast.error('Invalid item');
      return;
    }

    if (!item.itemId) {
      console.error('handleBidClick received item without itemId:', item);
      toast.error('Invalid item ID');
      return;
    }

    console.log(`Navigating to item details for item ${item.itemId}`);
    navigate(`/items/${item.itemId}`);
  };

  const columns = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 200 },
    {
      id: 'startingPrice',
      label: 'Starting Price',
      minWidth: 100,
      align: 'right',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      id: 'category',
      label: 'Category',
      minWidth: 100,
      render: (value, row) => {
        const category = categories.find((c) => c.id === row.categoryId);
        return category ? category.name : 'N/A';
      },
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'right',
      render: (_, row) => (
        <Box>
          <IconButton onClick={() => handleOpen(row)} size="small">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row.id)} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Auction Items</Typography>
      </Box>

      <Tabs
        value={statusTab}
        onChange={(e, newValue) => setStatusTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Active Auctions" value="ACTIVE" />
        <Tab label="Ended Auctions" value="ENDED" />
        <Tab label="Sold Items" value="SOLD" />
      </Tabs>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No items found
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => {
            // Log the item being processed
            console.log('Processing item for rendering:', item);

            // Basic validation - only skip if item is completely invalid
            if (!item) {
              console.warn('Null or undefined item found in items array');
              return null;
            }

            // Use itemId instead of id
            const itemKey = item.itemId || `item-${Math.random()}`;
            
            const currentBid = currentBids[item.itemId] || {
              amount: item.currentHighestBid || item.startingPrice || 0,
              bidderName: 'No bids yet'
            };
            
            const isActive = item.itemStatus === 'ACTIVE';
            const isSold = item.itemStatus === 'SOLD';
            const isEnded = item.itemStatus === 'ENDED';
            
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={itemKey}>
                <Card sx={{ 
                  position: 'relative', 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  opacity: isActive ? 1 : 0.7
                }}>
                  {/* Status Badge */}
                    <Chip 
                    label={isActive ? 'Live' : isSold ? 'Sold' : 'Ended'} 
                    color={isActive ? 'success' : isSold ? 'error' : 'warning'} 
                      size="small" 
                      sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                    />
                  
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.imageUrl || 'https://via.placeholder.com/300'}
                    alt={item.title || 'Item image'}
                    sx={{ objectFit: 'cover' }}
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" noWrap>
                      {item.title || 'Untitled Item'}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        minHeight: '4.5em',
                      }}
                    >
                      {item.description || 'No description available'}
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {isActive ? 'Current Bid:' : isSold ? 'Sold for:' : 'Final Bid:'}
                        </Typography>
                        <Typography 
                          variant="h6" 
                          color={isActive ? 'primary' : isSold ? 'error' : 'text.secondary'} 
                          fontWeight="bold"
                        >
                          ${currentBid.amount.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Starting Price:
                        </Typography>
                        <Typography variant="body2">
                          ${(item.startingPrice || 0).toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        Category: {item.categoryName || 'N/A'}
                      </Typography>
                    </Box>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, mt: 'auto' }}>
                    {isActive ? (
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<GavelIcon />}
                        onClick={() => {
                          console.log('Bid button clicked for item:', item);
                          handleBidClick(item);
                        }}
                        sx={{ borderRadius: 2 }}
                      >
                        Place Bid
                      </Button>
                    ) : (
                      <Typography 
                        variant="body2" 
                        color={isSold ? 'error' : 'text.secondary'} 
                        sx={{ fontStyle: 'italic' }}
                      >
                        {isSold ? 'Sold' : 'Auction Ended'}
                      </Typography>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      <Box mt={4} display="flex" justifyContent="center">
        <DataTable
          columns={[]}
          data={[]}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
          onSearch={setSearchTerm}
          searchPlaceholder="Search items..."
          hideTable
        />
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Edit Item' : 'Add New Item'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
            <TextField
              fullWidth
              margin="normal"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
            <TextField
              fullWidth
              margin="normal"
              name="startingPrice"
              label="Starting Price"
              type="number"
              value={formik.values.startingPrice}
              onChange={formik.handleChange}
              error={formik.touched.startingPrice && Boolean(formik.errors.startingPrice)}
              helperText={formik.touched.startingPrice && formik.errors.startingPrice}
            />
            <TextField
              fullWidth
              margin="normal"
              name="categoryId"
              label="Category"
              select
              value={formik.values.categoryId}
              onChange={formik.handleChange}
              error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
              helperText={formik.touched.categoryId && formik.errors.categoryId}
            >
              {categories.map((category, idx) => (
                <MenuItem key={category.id || idx} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Items;