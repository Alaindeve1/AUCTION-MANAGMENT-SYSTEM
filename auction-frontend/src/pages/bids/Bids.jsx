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
  TextField,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';
import DataTable from '../../components/common/DataTable';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  bidAmount: Yup.number()
    .required('Bid amount is required')
    .min(0, 'Bid amount must be positive'),
});

const Bids = () => {
  const [bids, setBids] = useState([]);
  const [selectedBid, setSelectedBid] = useState(null);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const formik = useFormik({
    initialValues: {
      bidAmount: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post(`/bids?itemId=${selectedBid.itemId}&bidAmount=${values.bidAmount}`);
        toast.success('Bid placed successfully');
        handleClose();
        fetchBids();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to place bid');
      }
    },
  });

  const fetchBids = async () => {
    try {
      const response = await api.get('/bids', {
        params: {
          page: page + 1,
          size: rowsPerPage,
          search: searchTerm,
        },
      });
      setBids(response.data.content);
      setTotalCount(response.data.totalElements);
    } catch (error) {
      toast.error('Failed to fetch bids');
    }
  };

  useEffect(() => {
    fetchBids();
  }, [page, rowsPerPage, searchTerm]);

  const handleViewDetails = async (bid) => {
    try {
      const response = await api.get(`/bids/${bid.id}`);
      setSelectedBid(response.data);
      setOpen(true);
    } catch (error) {
      toast.error('Failed to fetch bid details');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBid(null);
    formik.resetForm();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'WINNING':
        return 'success';
      case 'OUTBID':
        return 'error';
      case 'PENDING':
        return 'warning';
      default:
        return 'default';
    }
  };

  const columns = [
    { id: 'itemTitle', label: 'Item', minWidth: 170 },
    { id: 'bidderName', label: 'Bidder', minWidth: 130 },
    {
      id: 'bidAmount',
      label: 'Bid Amount',
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
      id: 'bidTime',
      label: 'Bid Time',
      minWidth: 150,
      render: (value) => new Date(value).toLocaleString(),
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
        Bids
      </Typography>

      <DataTable
        columns={columns}
        data={bids}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        onSearch={setSearchTerm}
        searchPlaceholder="Search bids..."
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Bid Details</DialogTitle>
        <DialogContent>
          {selectedBid && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Item Information
                    </Typography>
                    <Typography>
                      <strong>Title:</strong> {selectedBid.itemTitle}
                    </Typography>
                    <Typography>
                      <strong>Description:</strong> {selectedBid.itemDescription}
                    </Typography>
                    <Typography>
                      <strong>Current Price:</strong> ${selectedBid.currentPrice}
                    </Typography>
                    <Typography>
                      <strong>Minimum Bid:</strong> ${selectedBid.minimumBid}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Place a Bid
                    </Typography>
                    <form onSubmit={formik.handleSubmit}>
                      <TextField
                        fullWidth
                        margin="normal"
                        name="bidAmount"
                        label="Bid Amount"
                        type="number"
                        value={formik.values.bidAmount}
                        onChange={formik.handleChange}
                        error={formik.touched.bidAmount && Boolean(formik.errors.bidAmount)}
                        helperText={formik.touched.bidAmount && formik.errors.bidAmount}
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Place Bid
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Bid History
                    </Typography>
                    {selectedBid.bidHistory?.map((bid, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Typography>
                          <strong>{bid.bidderName}</strong> bid{' '}
                          <strong>${bid.amount.toFixed(2)}</strong> on{' '}
                          {new Date(bid.time).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
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

export default Bids; 