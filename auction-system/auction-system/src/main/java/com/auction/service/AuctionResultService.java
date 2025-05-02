package com.auction.service;

import com.auction.dto.AuctionResultDTO;
import com.auction.exception.ResourceNotFoundException;
import com.auction.model.AuctionResult;
import com.auction.model.Bid;
import com.auction.model.Item;
import com.auction.repository.AuctionResultRepository;
import com.auction.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
//import java.util.stream.Collectors;

@Service
public class AuctionResultService {

    private final AuctionResultRepository auctionResultRepository;
    private final ItemRepository itemRepository;
    private final BidService bidService;

    public AuctionResultService(
            AuctionResultRepository auctionResultRepository,
            ItemRepository itemRepository,
            BidService bidService) {
        this.auctionResultRepository = auctionResultRepository;
        this.itemRepository = itemRepository;
        this.bidService = bidService;
    }

    public List<AuctionResult> getAllAuctionResults() {
        return auctionResultRepository.findAll();
    }

    public AuctionResult getAuctionResultById(Long resultId) {
        return auctionResultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction result not found with id: " + resultId));
    }

    public Optional<AuctionResult> getAuctionResultByItemId(Long itemId) {
        return auctionResultRepository.findByItemItemId(itemId);
    }

    public List<AuctionResult> getAuctionResultsByWinner(Long winnerId) {
        return auctionResultRepository.findByWinnerUserId(winnerId);
    }

    public List<AuctionResult> getAuctionResultsByStatus(AuctionResult.ResultStatus status) {
        return auctionResultRepository.findByResultStatus(status);
    }

    @Transactional
    public AuctionResult createAuctionResult(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        // Check if auction result already exists
        if (auctionResultRepository.findByItemItemId(itemId).isPresent()) {
            throw new IllegalStateException("Auction result already exists for item with id: " + itemId);
        }

        // Get highest bid with bidder
        Optional<Bid> highestBid = bidService.getHighestBidWithBidder(itemId);

        AuctionResult auctionResult = new AuctionResult();
        auctionResult.setItem(item);

        if (highestBid.isPresent()) {
            auctionResult.setWinner(highestBid.get().getBidder());
            auctionResult.setFinalPrice(highestBid.get().getBidAmount());
            auctionResult.setResultStatus(AuctionResult.ResultStatus.PENDING);

            // Update item status to SOLD
            item.setItemStatus(Item.ItemStatus.SOLD);
            itemRepository.save(item);
        } else {
            // No bids were placed
            auctionResult.setFinalPrice(BigDecimal.ZERO);
            auctionResult.setResultStatus(AuctionResult.ResultStatus.CANCELLED);

            // Update item status to ENDED
            item.setItemStatus(Item.ItemStatus.ENDED);
            itemRepository.save(item);
        }

        return auctionResultRepository.save(auctionResult);
    }

    @Transactional
    public AuctionResult updateAuctionResultStatus(Long resultId, AuctionResult.ResultStatus status) {
        AuctionResult auctionResult = getAuctionResultById(resultId);
        auctionResult.setResultStatus(status);
        return auctionResultRepository.save(auctionResult);
    }

    @Transactional
    public void deleteAuctionResult(Long resultId) {
        if (!auctionResultRepository.existsById(resultId)) {
            throw new ResourceNotFoundException("Auction result not found with id: " + resultId);
        }
        auctionResultRepository.deleteById(resultId);
    }

    // New method to convert AuctionResult to AuctionResultDTO
    public AuctionResultDTO convertToDTO(AuctionResult auctionResult) {
        AuctionResultDTO dto = new AuctionResultDTO();
        dto.setResultId(auctionResult.getResultId());
        dto.setItemId(auctionResult.getItem().getItemId());
        dto.setWinnerId(auctionResult.getWinner() != null ? auctionResult.getWinner().getUserId() : null);
        dto.setFinalPrice(auctionResult.getFinalPrice());
        dto.setResultStatus(auctionResult.getResultStatus());
        return dto;
    }
}