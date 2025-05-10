package com.auction.controller;

import com.auction.dto.BidDto;
import com.auction.model.Bid;
import com.auction.service.BidService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    private final BidService bidService;

    public BidController(BidService bidService) {
        this.bidService = bidService;
    }

    @GetMapping("/stats")
    public ResponseEntity<com.auction.dto.BidStatsDto> getBidStats() {
        return ResponseEntity.ok(bidService.getBidStats());
    }

    @GetMapping
    public ResponseEntity<List<BidDto>> getAllBids() {
        List<Bid> bids = bidService.getAllBids();
        List<BidDto> bidDtos = bids.stream()
                .map(BidDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BidDto> getBidById(@PathVariable("id") Long bidId) {
        Bid bid = bidService.getBidById(bidId);
        return ResponseEntity.ok(BidDto.fromEntity(bid));
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<BidDto>> getBidsByItem(@PathVariable Long itemId) {
        List<Bid> bids = bidService.getBidsByItem(itemId);
        List<BidDto> bidDtos = bids.stream()
                .map(BidDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDtos);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BidDto>> getBidsByUser(@PathVariable Long userId) {
        List<Bid> bids = bidService.getBidsByUser(userId);
        List<BidDto> bidDtos = bids.stream()
                .map(BidDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDtos);
    }

    @GetMapping("/item/{itemId}/highest")
    public ResponseEntity<BigDecimal> getHighestBidForItem(@PathVariable Long itemId) {
        Optional<BigDecimal> highestBid = bidService.getHighestBidForItem(itemId);
        return highestBid.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @GetMapping("/item/{itemId}/count")
    public ResponseEntity<Long> countBidsByItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(bidService.countBidsByItem(itemId));
    }

    @PostMapping
    public ResponseEntity<BidDto> placeBid(
            @RequestParam Long itemId,
            @RequestParam Long bidderId,
            @RequestParam BigDecimal bidAmount) {
        Bid bid = bidService.placeBid(itemId, bidderId, bidAmount);
        return new ResponseEntity<>(BidDto.fromEntity(bid), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBid(@PathVariable("id") Long bidId) {
        bidService.deleteBid(bidId);
        return ResponseEntity.noContent().build();
    }
}