import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Paper,
    Box,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Sort as SortIcon
} from '@mui/icons-material';

const FilterableTable = ({
    columns,
    data,
    loading,
    onPageChange,
    onRowsPerPageChange,
    onSearch,
    onSort,
    page,
    rowsPerPage,
    totalCount,
    searchFields = [],
    defaultSortField,
    defaultSortDirection = 'asc'
}) => {
    const [filters, setFilters] = useState({});
    const [sortField, setSortField] = useState(defaultSortField);
    const [sortDirection, setSortDirection] = useState(defaultSortDirection);

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onSearch?.(newFilters);
    };

    const handleSort = (field) => {
        const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortField(field);
        setSortDirection(newDirection);
        onSort?.(field, newDirection);
    };

    const clearFilters = () => {
        setFilters({});
        onSearch?.({});
    };

    return (
        <Paper>
            <Box p={2}>
                <Box display="flex" gap={2} mb={2}>
                    {searchFields.map((field) => (
                        <TextField
                            key={field}
                            label={`Search ${field}`}
                            variant="outlined"
                            size="small"
                            value={filters[field] || ''}
                            onChange={(e) => handleFilterChange(field, e.target.value)}
                            InputProps={{
                                endAdornment: filters[field] && (
                                    <IconButton size="small" onClick={() => handleFilterChange(field, '')}>
                                        <ClearIcon />
                                    </IconButton>
                                )
                            }}
                        />
                    ))}
                    <Tooltip title="Clear all filters">
                        <IconButton onClick={clearFilters}>
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                    style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                                    onClick={() => column.sortable && handleSort(column.field)}
                                >
                                    <Box display="flex" alignItems="center">
                                        {column.headerName}
                                        {column.sortable && (
                                            <SortIcon
                                                style={{
                                                    marginLeft: 4,
                                                    transform: sortField === column.field && sortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                                                }}
                                            />
                                        )}
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center">
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow key={index}>
                                    {columns.map((column) => (
                                        <TableCell key={column.field}>
                                            {column.renderCell ? column.renderCell(row) : row[column.field]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={onPageChange}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={onRowsPerPageChange}
                rowsPerPageOptions={[5, 10, 25, 50]}
            />
        </Paper>
    );
};

export default FilterableTable; 