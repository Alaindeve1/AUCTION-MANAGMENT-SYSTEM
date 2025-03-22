package com.auction.dto;

import com.auction.model.Bid;
import com.auction.model.AuctionResult;
import com.auction.model.Item;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class BidDto {
    private Long bidId;
    private Long itemId;
    private String itemTitle;
    private Long bidderId;
    private String bidderUsername;
    private BigDecimal bidAmount;
    private LocalDateTime bidTime;
    private Boolean isWinningBid;
    private Long itemBidId; // New field for item-specific bid ID

    // Default constructor
    public BidDto() {
    }

    // Constructor with fields
    public BidDto(Long bidId, Long itemId, Long bidderId,
                 BigDecimal bidAmount, LocalDateTime bidTime) {
        this.bidId = bidId;
        this.itemId = itemId;
        this.bidderId = bidderId;
        this.bidAmount = bidAmount;
        this.bidTime = bidTime;
    }

    // Static method to convert Bid entity to BidDto
    public static BidDto fromEntity(Bid bid) {
        BidDto dto = new BidDto(
                bid.getBidId(),
                bid.getItem().getItemId(),
                bid.getBidder().getUserId(),
                bid.getBidAmount(),
                bid.getBidTime()
        );

        // Set additional fields
        dto.setItemTitle(bid.getItem().getTitle());
        dto.setBidderUsername(bid.getBidder().getUsername());
        dto.setItemBidId(bid.getItemBidId()); // Set the item-specific bid ID

        // Determine if this is the winning bid
        dto.setIsWinningBid(determineIfWinningBid(bid));

        return dto;
    }

    /**
     * Determines if a bid is the winning bid based on auction status and results
     * @param bid The bid to check
     * @return true if this is the winning bid, false otherwise
     */
    private static Boolean determineIfWinningBid(Bid bid) {
        Item item = bid.getItem();

        // If auction is still active, no winning bid yet
        if (item.getEndDate().isAfter(LocalDateTime.now())) {
            return false;
        }

        // Check if there's an explicit auction result
        AuctionResult result = item.getAuctionResult();
        if (result != null) {
            // If there's a winner and it matches our bidder, and final price matches bid amount
            if (result.getWinner() != null &&
                    result.getWinner().getUserId().equals(bid.getBidder().getUserId()) &&
                    result.getFinalPrice().compareTo(bid.getBidAmount()) == 0) {
                return true;
            }
        } else {
            // No explicit result, check if this is the highest bid
            return isHighestBid(bid);
        }

        return false;
    }

    /**
     * Determines if a bid is the highest bid on an item
     * @param bid The bid to check
     * @return true if this is the highest bid, false otherwise
     */
    private static Boolean isHighestBid(Bid bid) {
        Item item = bid.getItem();
        BigDecimal highestAmount = BigDecimal.ZERO;

        // Find the highest bid amount
        for (Bid itemBid : item.getBids()) {
            if (itemBid.getBidAmount().compareTo(highestAmount) > 0) {
                highestAmount = itemBid.getBidAmount();
            }
        }

        // Check if this bid matches the highest amount
        return bid.getBidAmount().compareTo(highestAmount) == 0;
    }

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

    public Long getBidderId() {
        return bidderId;
    }

    public void setBidderId(Long bidderId) {
        this.bidderId = bidderId;
    }

    public String getBidderUsername() {
        return bidderUsername;
    }

    public void setBidderUsername(String bidderUsername) {
        this.bidderUsername = bidderUsername;
    }

    public BigDecimal getBidAmount() {
        return bidAmount;
    }

    public void setBidAmount(BigDecimal bidAmount) {
        this.bidAmount = bidAmount;
    }

    public LocalDateTime getBidTime() {
        return bidTime;
    }

    public void setBidTime(LocalDateTime bidTime) {
        this.bidTime = bidTime;
    }

    public Boolean getIsWinningBid() {
        return isWinningBid;
    }

    public void setIsWinningBid(Boolean isWinningBid) {
        this.isWinningBid = isWinningBid;
    }

    public Long getItemBidId() {
        return itemBidId;
    }

    public void setItemBidId(Long itemBidId) {
        this.itemBidId = itemBidId;
    }

    @Override
    public String toString() {
        return "BidDto{" +
                "bidId=" + bidId +
                ", itemId=" + itemId +
                ", itemTitle='" + itemTitle + '\'' +
                ", bidderId=" + bidderId +
                ", bidderUsername='" + bidderUsername + '\'' +
                ", bidAmount=" + bidAmount +
                ", bidTime=" + bidTime +
                ", isWinningBid=" + isWinningBid +
                ", itemBidId=" + itemBidId +
                '}';
    }
}