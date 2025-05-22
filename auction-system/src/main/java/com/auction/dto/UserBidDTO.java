package com.auction.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class UserBidDTO {
    private Long bidId;
    private Long itemId;
    private String itemTitle;
    private String itemImageUrl;
    private BigDecimal amount;
    private LocalDateTime bidDate;
    private BigDecimal currentHighestBid;
    private boolean isHighestBid;
    private boolean isOutbid;

    // Getters and Setters
    public Long getBidId() {
        return bidId;
    }

    public void setBidId(Long bidId) {
        this.bidId = bidId;
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getItemTitle() {
        return itemTitle;
    }

    public void setItemTitle(String itemTitle) {
        this.itemTitle = itemTitle;
    }

    public String getItemImageUrl() {
        return itemImageUrl;
    }

    public void setItemImageUrl(String itemImageUrl) {
        this.itemImageUrl = itemImageUrl;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getBidDate() {
        return bidDate;
    }

    public void setBidDate(LocalDateTime bidDate) {
        this.bidDate = bidDate;
    }

    public BigDecimal getCurrentHighestBid() {
        return currentHighestBid;
    }

    public void setCurrentHighestBid(BigDecimal currentHighestBid) {
        this.currentHighestBid = currentHighestBid;
    }

    public boolean getIsHighestBid() {
        return isHighestBid;
    }

    public void setIsHighestBid(boolean isHighestBid) {
        this.isHighestBid = isHighestBid;
    }

    public boolean getIsOutbid() {
        return isOutbid;
    }

    public void setIsOutbid(boolean isOutbid) {
        this.isOutbid = isOutbid;
    }
} 