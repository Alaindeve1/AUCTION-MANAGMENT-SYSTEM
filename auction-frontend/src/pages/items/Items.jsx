import { useState, useEffect } from 'react';
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
  Chip
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Gavel as GavelIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DataTable from '../../components/common/DataTable';
import api from '../../utils/api';
import toast from 'react-hot-toast';

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
  const [statusTab, setStatusTab] = useState('ACTIVE'); // ACTIVE, PENDING, COMPLETED

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      startingPrice: '',
      categoryId: '',
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
      const response = await api.get('/items', {
        params: {
          page: page + 1,
          size: rowsPerPage,
          search: searchTerm,
        },
      });
      // Filter on frontend
      const filtered = (response.data.content || []).filter(item => item.itemStatus !== 'DRAFT' && item.itemStatus === statusTab);
      setItems(filtered);
      setTotalCount(filtered.length);
    } catch (error) {
      toast.error('Failed to fetch items');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [page, rowsPerPage, searchTerm, statusTab]);

  const handleOpen = (item = null) => {
    setSelectedItem(item);
    if (item) {
      formik.setValues({
        title: item.title,
        description: item.description,
        startingPrice: item.startingPrice,
        categoryId: item.categoryId,
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4" fontWeight={700} color="primary.main">Auction Items</Typography>
      </Box>
      <Tabs
        value={statusTab}
        onChange={(e, v) => {
          setStatusTab(v);
          setPage(0);
        }}
        indicatorColor="primary"
        textColor="primary"
        sx={{ mb: 3 }}
      >
        <Tab label="Active" value="ACTIVE" />
        <Tab label="Pending" value="PENDING" />
        <Tab label="Completed" value="COMPLETED" />
      </Tabs>
      <Grid container spacing={3}>
        {items.length === 0 && (
          <Grid item xs={12}>
            <Box textAlign="center" py={8}>
              <Typography color="text.secondary">No items found in this category.</Typography>
            </Box>
          </Grid>
        )}
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={item.id}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderRadius: 3, boxShadow: 3 }}>
              {item.imageUrl && (
                <CardMedia
                  component="img"
                  height="180"
                  image={item.imageUrl}
                  alt={item.title}
                  sx={{ objectFit: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>{item.description}</Typography>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Chip label={item.itemStatus} color={
                    item.itemStatus === 'ACTIVE' ? 'success' :
                    item.itemStatus === 'PENDING' ? 'warning' :
                    item.itemStatus === 'COMPLETED' ? 'info' : 'default'
                  } size="small" />
                  <Typography variant="body2" color="text.secondary">Starting at <b>${item.startingPrice}</b></Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Category: {categories.find(c => c.id === item.categoryId)?.name || 'N/A'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<GavelIcon />}
                  href={`/items/${item.id}`}
                  sx={{ borderRadius: 2 }}
                >
                  {item.itemStatus === 'ACTIVE' ? 'Bid Now' : 'View'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
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