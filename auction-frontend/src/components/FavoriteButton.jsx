import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import api from '../utils/api';
import toast from 'react-hot-toast';

const FavoriteButton = ({ itemId, initialFavorite, onChange }) => {
  const [favorited, setFavorited] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFavorited(initialFavorite);
  }, [initialFavorite]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast.error('Please sign in to favorite items.');
        setLoading(false);
        return;
      }
      if (favorited) {
        await api.delete(`/favorites/user/${userId}/item/${itemId}`);
        setFavorited(false);
        toast('Removed from favorites');
      } else {
        await api.post(`/favorites/user/${userId}/item/${itemId}`);
        setFavorited(true);
        toast.success('Added to favorites!');
      }
      if (onChange) onChange(!favorited);
    } catch (err) {
      toast.error('Could not update favorite');
    }
    setLoading(false);
  };

  return (
    <IconButton onClick={handleToggle} color={favorited ? 'error' : 'default'} disabled={loading} aria-label="favorite">
      {favorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
    </IconButton>
  );
};

export default FavoriteButton;
