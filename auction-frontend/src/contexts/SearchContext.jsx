import React, { createContext, useContext, useState } from 'react';
import api from '../utils/api';

const SearchContext = createContext();

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

export const SearchProvider = ({ children }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const search = async (query) => {
        if (!query) {
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/api/search', {
                params: { query }
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Search error:', error);
            setError('Failed to perform search');
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchResults([]);
        setError(null);
    };

    return (
        <SearchContext.Provider
            value={{
                searchResults,
                loading,
                error,
                search,
                clearSearch
            }}
        >
            {children}
        </SearchContext.Provider>
    );
}; 