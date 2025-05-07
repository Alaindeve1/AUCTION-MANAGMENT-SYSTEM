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
  Chip,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DataTable from '../../components/common/DataTable';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { hasRole } from '../../utils/auth.jsx';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .when('isNew', {
      is: true,
      then: (schema) => schema.required('Password is required'),
    }),
  role: Yup.string().required('Role is required'),
});

const roles = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'USER', label: 'User' },
  { value: 'SELLER', label: 'Seller' },
];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      role: 'USER',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (selectedUser) {
          const { password, ...updateData } = values;
          await api.put(`/users/${selectedUser.id}`, updateData);
          toast.success('User updated successfully');
        } else {
          await api.post('/users', values);
          toast.success('User created successfully');
        }
        handleClose();
        fetchUsers();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Operation failed');
      }
    },
  });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users', {
        params: {
          page: page + 1,
          size: rowsPerPage,
          search: searchTerm,
        },
      });
      setUsers(response.data.content);
      setTotalCount(response.data.totalElements);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchTerm]);

  const handleOpen = (user = null) => {
    setSelectedUser(user);
    if (user) {
      formik.setValues({
        username: user.username,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      formik.resetForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    formik.resetForm();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'SELLER':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const columns = [
    { id: 'username', label: 'Username', minWidth: 170 },
    { id: 'email', label: 'Email', minWidth: 200 },
    {
      id: 'role',
      label: 'Role',
      minWidth: 100,
      render: (value) => (
        <Chip
          label={value}
          color={getRoleColor(value)}
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

  if (!hasRole('ADMIN')) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography>
          You don't have permission to access this page.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Users</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          Add User
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={users}
        page={page}
        rowsPerPage={rowsPerPage}
        totalCount={totalCount}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        onSearch={setSearchTerm}
        searchPlaceholder="Search users..."
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="username"
              label="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              fullWidth
              margin="normal"
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              name="password"
              label={selectedUser ? 'New Password (optional)' : 'Password'}
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              margin="normal"
              name="role"
              label="Role"
              select
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              helperText={formik.touched.role && formik.errors.role}
            >
              {roles.map((role) => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Users; 