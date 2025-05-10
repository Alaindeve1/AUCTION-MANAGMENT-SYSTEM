package com.auction.controller;

import com.auction.dto.FavoriteDto;
import com.auction.model.Favorite;
import com.auction.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {
    private final FavoriteService favoriteService;
    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavoriteDto>> getFavoritesByUser(@PathVariable Long userId) {
        List<FavoriteDto> dtos = favoriteService.getFavoritesByUser(userId).stream()
            .map(fav -> new FavoriteDto(
                fav.getId(),
                fav.getItem() != null ? fav.getItem().getTitle() : null,
                fav.getItem() != null ? fav.getItem().getImageUrl() : null,
                fav.getCreatedAt()
            ))
            .toList();
        return ResponseEntity.ok(dtos);
    }
}
