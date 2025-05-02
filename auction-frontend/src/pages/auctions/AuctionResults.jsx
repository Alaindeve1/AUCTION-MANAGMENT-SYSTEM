import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const AuctionResults = () => {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchResults = async () => {
    try {
      const response = await api.get('/auction-results', {
        params: {
          page: page + 1,
          size: rowsPerPage,
          search: searchTerm,
        },
      });
      setResults(response.data.content);
      setTotalCount(response.data.totalElements);
    } catch (error) {
      toast.error('Failed to fetch auction results');
    }
  };

  useEffect(() => {
    fetchResults();
  }, [page, rowsPerPage, searchTerm]);

  const handleViewDetails = async (result) => {
    try {
      const response = await api.get(`/auction-results/${result.id}`);
      setSelectedResult(response.data);
      setOpen(true);
    } catch (error) {
      toast.error('Failed to fetch auction details');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedResult(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    { id: 'itemTitle', label: 'Item', minWidth: 170 },
    { id: 'sellerName', label: 'Seller', minWidth: 130 },
    { id: 'winnerName', label: 'Winner', minWidth: 130 },
    {
      id: 'finalPrice',
      label: 'Final Price',
      minWidth: 100,
      align: 'right',
      render: (value) => `$${value.toFixed(2)}`,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 100,
      render: (value) => (
        <Chip
          label={value}
          color={getStatusColor(value)}
          size="small"
        />
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'right',
      render: (_, row) => (
        <IconButton onClick={() => handleViewDetails(row)} size="small">
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Auction Results
      </Typography>

      <DataTable
        columns={columns}
        data={results}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        onSearch={setSearchTerm}
        searchPlaceholder="Search auction results..."
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Auction Details</DialogTitle>
        <DialogContent>
          {selectedResult && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Item Information
                    </Typography>
                    <Typography>
                      <strong>Title:</strong> {selectedResult.itemTitle}
                    </Typography>
                    <Typography>
                      <strong>Description:</strong> {selectedResult.itemDescription}
                    </Typography>
                    <Typography>
                      <strong>Starting Price:</strong> ${selectedResult.startingPrice}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Seller Information
                    </Typography>
                    <Typography>
                      <strong>Name:</strong> {selectedResult.sellerName}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedResult.sellerEmail}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Winner Information
                    </Typography>
                    <Typography>
                      <strong>Name:</strong> {selectedResult.winnerName}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedResult.winnerEmail}
                    </Typography>
                    <Typography>
                      <strong>Final Bid:</strong> ${selectedResult.finalPrice}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Auction Timeline
                    </Typography>
                    <Typography>
                      <strong>Start Date:</strong>{' '}
                      {new Date(selectedResult.startDate).toLocaleString()}
                    </Typography>
                    <Typography>
                      <strong>End Date:</strong>{' '}
                      {new Date(selectedResult.endDate).toLocaleString()}
                    </Typography>
                    <Typography>
                      <strong>Total Bids:</strong> {selectedResult.totalBids}
                    </Typography>
                    <Typography>
                      <strong>Status:</strong>{' '}
                      <Chip
                        label={selectedResult.status}
                        color={getStatusColor(selectedResult.status)}
                        size="small"
                      />
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AuctionResults; 