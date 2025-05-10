package com.auction.service;

import com.auction.model.Favorite;
import com.auction.repository.FavoriteRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FavoriteService {
    private final FavoriteRepository favoriteRepository;
    public FavoriteService(FavoriteRepository favoriteRepository) {
        this.favoriteRepository = favoriteRepository;
    }
    public List<Favorite> getFavoritesByUser(Long userId) {
        return favoriteRepository.findByUserUserId(userId);
    }
}
