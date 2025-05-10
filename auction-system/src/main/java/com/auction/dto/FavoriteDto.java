package com.auction.dto;

import java.time.LocalDateTime;

public class FavoriteDto {
    private Long id;
    private String itemTitle;
    private String itemImageUrl;
    private LocalDateTime createdAt;

    public FavoriteDto(Long id, String itemTitle, String itemImageUrl, LocalDateTime createdAt) {
        this.id = id;
        this.itemTitle = itemTitle;
        this.itemImageUrl = itemImageUrl;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public String getItemTitle() { return itemTitle; }
    public String getItemImageUrl() { return itemImageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
