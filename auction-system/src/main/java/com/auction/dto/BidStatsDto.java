package com.auction.dto;

import java.math.BigDecimal;

public class BidStatsDto {
    private long totalBids;
    private BigDecimal totalValue;
    private long activeAuctions;
    private long uniqueBidders;

    public BidStatsDto() {}

    public BidStatsDto(long totalBids, BigDecimal totalValue, long activeAuctions, long uniqueBidders) {
        this.totalBids = totalBids;
        this.totalValue = totalValue;
        this.activeAuctions = activeAuctions;
        this.uniqueBidders = uniqueBidders;
    }

    public long getTotalBids() { return totalBids; }
    public void setTotalBids(long totalBids) { this.totalBids = totalBids; }
    public BigDecimal getTotalValue() { return totalValue; }
    public void setTotalValue(BigDecimal totalValue) { this.totalValue = totalValue; }
    public long getActiveAuctions() { return activeAuctions; }
    public void setActiveAuctions(long activeAuctions) { this.activeAuctions = activeAuctions; }
    public long getUniqueBidders() { return uniqueBidders; }
    public void setUniqueBidders(long uniqueBidders) { this.uniqueBidders = uniqueBidders; }
}
