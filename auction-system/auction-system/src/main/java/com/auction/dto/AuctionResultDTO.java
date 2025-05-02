package com.auction.dto;

import com.auction.model.AuctionResult;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AuctionResultDTO {
    private Long resultId;
    private Long itemId;
    private Long winnerId;
    private BigDecimal finalPrice;
    private AuctionResult.ResultStatus resultStatus;
}