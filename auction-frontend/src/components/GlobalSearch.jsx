import React, { useState, useEffect, useRef } from 'react';
import {
    TextField,
    InputAdornment,
    IconButton,
    Popper,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    Box,
    CircularProgress,
    ClickAwayListener
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Category as CategoryIcon,
    Person as PersonIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material';
import { useSearch } from '../contexts/SearchContext';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
    const [query, setQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const { searchResults, loading, error, search, clearSearch } = useSearch();
    const navigate = useNavigate();
    const searchTimeout = useRef(null);

    useEffect(() => {
        if (query) {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
            searchTimeout.current = setTimeout(() => {
                search(query);
            }, 300);
        } else {
            clearSearch();
        }
    }, [query, search, clearSearch]);

    const handleSearchClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClickAway = () => {
        setAnchorEl(null);
    };

    const handleItemClick = (item) => {
        setAnchorEl(null);
        setQuery('');
        clearSearch();

        switch (item.type) {
            case 'ITEM':
                navigate(`/items/${item.id}`);
                break;
            case 'USER':
                navigate(`/users/${item.id}`);
                break;
            case 'CATEGORY':
                navigate(`/categories/${item.id}`);
                break;
            default:
                break;
        }
    };

    const getItemIcon = (type) => {
        switch (type) {
            case 'ITEM':
                return <AttachMoneyIcon />;
            case 'USER':
                return <PersonIcon />;
            case 'CATEGORY':
                return <CategoryIcon />;
            default:
                return null;
        }
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={handleSearchClick}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: query && (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        setQuery('');
                                        clearSearch();
                                    }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />

                <Popper
                    open={Boolean(anchorEl) && (query.length > 0 || loading)}
                    anchorEl={anchorEl}
                    placement="bottom-start"
                    style={{ width: anchorEl?.offsetWidth, zIndex: 1300 }}
                >
                    <Paper elevation={3}>
                        {loading ? (
                            <Box p={2} display="flex" justifyContent="center">
                                <CircularProgress size={24} />
                            </Box>
                        ) : error ? (
                            <Box p={2}>
                                <Typography color="error">{error}</Typography>
                            </Box>
                        ) : searchResults.length > 0 ? (
                            <List>
                                {searchResults.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        button
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <ListItemIcon>
                                            {getItemIcon(item.type)}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={item.title || item.name}
                                            secondary={item.description}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : query.length > 0 ? (
                            <Box p={2}>
                                <Typography>No results found</Typography>
                            </Box>
                        ) : null}
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
};

export default GlobalSearch; 