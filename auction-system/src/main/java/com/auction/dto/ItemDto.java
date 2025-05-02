package com.auction.dto;

import com.auction.model.Bid;
import com.auction.model.Item;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.Optional;

public class ItemDto {
    private Long itemId;
    private Long sellerId;
    private String sellerUsername;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private String imageUrl;
    private BigDecimal startingPrice;
    private BigDecimal currentHighestBid;
    private String itemStatus;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Integer bidCount;
    
    // Default constructor
    public ItemDto() {
    }
    
    // Constructor with essential fields
    public ItemDto(Long itemId, Long sellerId, Long categoryId, String title, 
                  BigDecimal startingPrice, String itemStatus, 
                  LocalDateTime startDate, LocalDateTime endDate) {
        this.itemId = itemId;
        this.sellerId = sellerId;
        this.categoryId = categoryId;
        this.title = title;
        this.startingPrice = startingPrice;
        this.itemStatus = itemStatus;
        this.startDate = startDate;
        this.endDate = endDate;
    }
    
    // Static method to convert Item entity to ItemDto
    public static ItemDto fromEntity(Item item) {
        ItemDto dto = new ItemDto(
            item.getItemId(),
            item.getSeller().getUserId(),
            item.getCategory() != null ? item.getCategory().getCategoryId() : null,
            item.getTitle(),
            item.getStartingPrice(),
            item.getItemStatus().toString(),
            item.getStartDate(),
            item.getEndDate()
        );
        
        // Set additional fields
        dto.setSellerUsername(item.getSeller().getUsername());
        if (item.getCategory() != null) {
            dto.setCategoryName(item.getCategory().getCategoryName());
        }
        dto.setDescription(item.getDescription());
        dto.setImageUrl(item.getImageUrl());
        
        // Calculate current highest bid and bid count
        if (item.getBids() != null && !item.getBids().isEmpty()) {
            Optional<Bid> highestBid = item.getBids().stream()
                .max(Comparator.comparing(Bid::getBidAmount));
            highestBid.ifPresent(bid -> dto.setCurrentHighestBid(bid.getBidAmount()));
            dto.setBidCount(item.getBids().size());
        } else {
            dto.setBidCount(0);
        }
        
        return dto;
    }
    
    // Getters and Setters
    public Long getItemId() {
        return itemId;
    }
    
    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }
    
    public Long getSellerId() {
        return sellerId;
    }
    
    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }
    
    public String getSellerUsername() {
        return sellerUsername;
    }
    
    public void setSellerUsername(String sellerUsername) {
        this.sellerUsername = sellerUsername;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    
    public String getCategoryName() {
        return categoryName;
    }
    
    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public BigDecimal getStartingPrice() {
        return startingPrice;
    }
    
    public void setStartingPrice(BigDecimal startingPrice) {
        this.startingPrice = startingPrice;
    }
    
    public BigDecimal getCurrentHighestBid() {
        return currentHighestBid;
    }
    
    public void setCurrentHighestBid(BigDecimal currentHighestBid) {
        this.currentHighestBid = currentHighestBid;
    }
    
    public String getItemStatus() {
        return itemStatus;
    }
    
    public void setItemStatus(String itemStatus) {
        this.itemStatus = itemStatus;
    }
    
    public LocalDateTime getStartDate() {
        return startDate;
    }
    
    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }
    
    public LocalDateTime getEndDate() {
        return endDate;
    }
    
    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
    
    public Integer getBidCount() {
        return bidCount;
    }
    
    public void setBidCount(Integer bidCount) {
        this.bidCount = bidCount;
    }
    
    @Override
    public String toString() {
        return "ItemDto{" +
               "itemId=" + itemId +
               ", title='" + title + '\'' +
               ", sellerId=" + sellerId +
               ", categoryId=" + categoryId +
               ", startingPrice=" + startingPrice +
               ", currentHighestBid=" + currentHighestBid +
               ", itemStatus='" + itemStatus + '\'' +
               ", startDate=" + startDate +
               ", endDate=" + endDate +
               ", bidCount=" + bidCount +
               '}';
    }
}