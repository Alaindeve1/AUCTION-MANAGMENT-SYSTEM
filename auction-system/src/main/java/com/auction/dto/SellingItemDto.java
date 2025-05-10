package com.auction.dto;

import java.math.BigDecimal;

public class SellingItemDto {
    private Long itemId;
    private String title;
    private String imageUrl;
    private BigDecimal startingPrice;
    private String itemStatus;

    public SellingItemDto(Long itemId, String title, String imageUrl, BigDecimal startingPrice, String itemStatus) {
        this.itemId = itemId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.startingPrice = startingPrice;
        this.itemStatus = itemStatus;
    }

    public Long getItemId() { return itemId; }
    public String getTitle() { return title; }
    public String getImageUrl() { return imageUrl; }
    public BigDecimal getStartingPrice() { return startingPrice; }
    public String getItemStatus() { return itemStatus; }
}
