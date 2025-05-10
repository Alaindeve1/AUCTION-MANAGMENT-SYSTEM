package com.auction.dto;

import com.auction.model.AuctionResult;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class AuctionResultDTO {
    private Long resultId;
    private Long itemId;
    private String itemTitle;
    private Long winnerId;
    private String winnerName;
    private LocalDateTime endDate;
    private BigDecimal finalPrice;
    private AuctionResult.ResultStatus resultStatus;
}