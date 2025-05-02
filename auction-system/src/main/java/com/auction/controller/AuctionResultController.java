package com.auction.controller;

import com.auction.dto.AuctionResultDTO;
import com.auction.model.AuctionResult;
import com.auction.service.AuctionResultService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auction-results")
public class AuctionResultController {

    private final AuctionResultService auctionResultService;

    public AuctionResultController(AuctionResultService auctionResultService) {
        this.auctionResultService = auctionResultService;
    }

    @GetMapping
    public ResponseEntity<List<AuctionResultDTO>> getAllAuctionResults() {
        List<AuctionResultDTO> results = auctionResultService.getAllAuctionResults().stream()
                .map(auctionResultService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AuctionResultDTO> getAuctionResultById(@PathVariable("id") Long resultId) {
        AuctionResultDTO result = auctionResultService.convertToDTO(auctionResultService.getAuctionResultById(resultId));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<AuctionResultDTO> getAuctionResultByItemId(@PathVariable Long itemId) {
        Optional<AuctionResult> result = auctionResultService.getAuctionResultByItemId(itemId);
        return result.map(auctionResult -> ResponseEntity.ok(auctionResultService.convertToDTO(auctionResult)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/winner/{winnerId}")
    public ResponseEntity<List<AuctionResultDTO>> getAuctionResultsByWinner(@PathVariable Long winnerId) {
        List<AuctionResultDTO> results = auctionResultService.getAuctionResultsByWinner(winnerId).stream()
                .map(auctionResultService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AuctionResultDTO>> getAuctionResultsByStatus(
            @PathVariable AuctionResult.ResultStatus status) {
        List<AuctionResultDTO> results = auctionResultService.getAuctionResultsByStatus(status).stream()
                .map(auctionResultService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(results);
    }

    @PostMapping("/item/{itemId}")
    public ResponseEntity<AuctionResultDTO> createAuctionResult(@PathVariable Long itemId) {
        AuctionResult result = auctionResultService.createAuctionResult(itemId);
        return new ResponseEntity<>(auctionResultService.convertToDTO(result), HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<AuctionResultDTO> updateAuctionResultStatus(
            @PathVariable("id") Long resultId,
            @RequestBody AuctionResult.ResultStatus status) {
        AuctionResult result = auctionResultService.updateAuctionResultStatus(resultId, status);
        return ResponseEntity.ok(auctionResultService.convertToDTO(result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuctionResult(@PathVariable("id") Long resultId) {
        auctionResultService.deleteAuctionResult(resultId);
        return ResponseEntity.noContent().build();
    }
}