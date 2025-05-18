import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/auth';
import api from '../utils/api';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import FilterableTable from '../components/FilterableTable';
import { useNavigate } from 'react-router-dom';

const Items = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [sortField, setSortField] = useState('title');
    const [sortDirection, setSortDirection] = useState('asc');

    const columns = [
        { field: 'title', headerName: 'Title', sortable: true },
        { field: 'description', headerName: 'Description', sortable: true },
        { field: 'startingPrice', headerName: 'Starting Price', sortable: true,
          renderCell: (row) => `$${row.startingPrice}` },
        { field: 'itemStatus', headerName: 'Status', sortable: true },
        { field: 'startDate', headerName: 'Start Date', sortable: true,
          renderCell: (row) => new Date(row.startDate).toLocaleDateString() },
        { field: 'endDate', headerName: 'End Date', sortable: true,
          renderCell: (row) => new Date(row.endDate).toLocaleDateString() },
        { field: 'actions', headerName: 'Actions', sortable: false,
          renderCell: (row) => (
              <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => navigate(`/items/${row.itemId}`)}
              >
                  View
              </Button>
          )}
    ];

    const fetchItems = async (page, size, sort, direction, filters = {}) => {
        try {
            setLoading(true);
            const response = await api.get('/api/items', {
                params: {
                    page,
                    size,
                    sortBy: sort,
                    direction,
                    ...filters
                }
            });
            setItems(response.data.content);
            setTotalCount(response.data.totalElements);
            setError(null);
        } catch (error) {
            console.error('Error fetching items:', error);
            setError('Failed to load items');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(page, rowsPerPage, sortField, sortDirection);
    }, [page, rowsPerPage, sortField, sortDirection]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (field, direction) => {
        setSortField(field);
        setSortDirection(direction);
    };

    const handleSearch = (filters) => {
        setPage(0);
        fetchItems(0, rowsPerPage, sortField, sortDirection, filters);
    };

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">Items</Typography>
                {user && (
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/items/new')}
                    >
                        Add New Item
                    </Button>
                )}
            </Box>

            <FilterableTable
                columns={columns}
                data={items}
                loading={loading}
                page={page}
                rowsPerPage={rowsPerPage}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSort={handleSort}
                onSearch={handleSearch}
                searchFields={['title', 'description']}
                defaultSortField="title"
                defaultSortDirection="asc"
            />
        </Box>
    );
};

export default Items;