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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DataTable from '../../components/common/DataTable';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
});

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedCategory) {
          await api.put(`/categories/${selectedCategory.id}`, values);
          toast.success('Category updated successfully');
        } else {
          await api.post('/categories', values);
          toast.success('Category created successfully');
        }
        handleClose();
        fetchCategories();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories', {
        params: {
          page: page + 1,
          size: rowsPerPage,
          search: searchTerm,
        },
      });
      setCategories(response.data.content);
      setTotalCount(response.data.totalElements);
    } catch (error) {
      toast.error('Failed to fetch categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, rowsPerPage, searchTerm]);

  const handleOpen = (category = null) => {
    setSelectedCategory(category);
    if (category) {
      formik.setValues({
        name: category.name,
        description: category.description,
      });
    } else {
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory(null);
    formik.resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'description', label: 'Description', minWidth: 200 },
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
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add Category
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={categories}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        onSearch={setSearchTerm}
        searchPlaceholder="Search categories..."
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Categories; 