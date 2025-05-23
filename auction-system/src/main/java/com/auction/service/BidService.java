package com.auction.service;

import com.auction.dto.UserBidDTO;
import com.auction.model.BidMessage;
import com.auction.exception.ResourceNotFoundException;
import com.auction.model.Bid;
import com.auction.model.Item;
import com.auction.model.User;
import com.auction.repository.BidRepository;
import com.auction.repository.ItemRepository;
import com.auction.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public BidService(
            BidRepository bidRepository,
            ItemRepository itemRepository,
            UserRepository userRepository,
            SimpMessagingTemplate messagingTemplate) {
        this.bidRepository = bidRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    // Bid stats aggregation
    public com.auction.dto.BidStatsDto getBidStats() {
        long totalBids = bidRepository.count();
        java.math.BigDecimal totalValue = bidRepository.getTotalBidValue();
        long uniqueBidders = bidRepository.countUniqueBidders();
        long activeAuctions = itemRepository.countByItemStatus(com.auction.model.Item.ItemStatus.ACTIVE);
        return new com.auction.dto.BidStatsDto(totalBids, totalValue, activeAuctions, uniqueBidders);
    }

    public List<Bid> getAllBids() {
        return bidRepository.findAll();
    }

    public Bid getBidById(Long bidId) {
        return bidRepository.findById(bidId)
                .orElseThrow(() -> new ResourceNotFoundException("Bid not found with id: " + bidId));
    }

    public List<Bid> getBidsByItem(Long itemId) {
        return bidRepository.findByItemItemId(itemId);
    }

    public List<Bid> getBidsByUser(Long userId) {
        return bidRepository.findByBidderUserId(userId);
    }

    public Optional<BigDecimal> getHighestBidForItem(Long itemId) {
        return bidRepository.findHighestBidForItem(itemId);
    }

    public Optional<Bid> getHighestBidWithBidder(Long itemId) {
        return bidRepository.findHighestBidWithBidderForItem(itemId);
    }

    public long countBidsByItem(Long itemId) {
        return bidRepository.countBidsByItemId(itemId);
    }

    @Transactional
    public Bid placeBid(Long itemId, Long bidderId, BigDecimal bidAmount) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));

        User bidder = userRepository.findById(bidderId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + bidderId));

        // Check if auction is active
        if (item.getItemStatus() != Item.ItemStatus.ACTIVE) {
            throw new IllegalStateException("Cannot bid on an item that is not active");
        }

        // Check if auction has ended
        if (item.getEndDate() != null && item.getEndDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot bid on an auction that has ended");
        }

        // Check if bid amount is higher than starting price
        if (bidAmount.compareTo(item.getStartingPrice()) < 0) {
            throw new IllegalArgumentException("Bid amount must be higher than the starting price");
        }

        // Check if bid amount is higher than current highest bid
        Optional<BigDecimal> highestBid = bidRepository.findHighestBidForItem(itemId);
        if (highestBid.isPresent() && bidAmount.compareTo(highestBid.get()) <= 0) {
            throw new IllegalArgumentException("Bid amount must be higher than the current highest bid");
        }

        // Create new bid
        Bid bid = new Bid();
        bid.setItem(item);
        bid.setBidder(bidder);
        bid.setAmount(bidAmount);
        bid.setBidDate(LocalDateTime.now());
        
        // Save the bid
        Bid savedBid = bidRepository.save(bid);
        
        // Broadcast the bid update via WebSocket
        BidMessage bidMessage = new BidMessage();
        bidMessage.setItemId(itemId);
        bidMessage.setAmount(bidAmount.doubleValue());
        bidMessage.setBidderId(bidderId);
        bidMessage.setBidderName(bidder.getUsername());

        // Send to both general and item-specific topics
        messagingTemplate.convertAndSend("/topic/bidUpdates", bidMessage);
        messagingTemplate.convertAndSend("/topic/bid/" + itemId, bidMessage);

        return savedBid;
    }

    public void deleteBid(Long bidId) {
        if (!bidRepository.existsById(bidId)) {
            throw new ResourceNotFoundException("Bid not found with id: " + bidId);
        }
        bidRepository.deleteById(bidId);
    }

    public List<UserBidDTO> getUserBids() {
        // Use a default user ID (1) for testing
        User currentUser = userRepository.findById(1L)
                .orElseThrow(() -> new ResourceNotFoundException("Default user not found"));

        // Get all bids for the default user
        List<Bid> userBids = bidRepository.findByBidderUserIdOrderByBidTimeDesc(currentUser.getUserId());

        return userBids.stream().map(bid -> {
            UserBidDTO dto = new UserBidDTO();
            dto.setBidId(bid.getBidId());
            dto.setItemId(bid.getItem().getItemId());
            dto.setItemTitle(bid.getItem().getTitle());
            dto.setItemImageUrl(bid.getItem().getImageUrl());
            dto.setAmount(bid.getAmount());
            dto.setBidDate(bid.getBidDate());
            
            // Get current highest bid for the item
            BigDecimal currentHighestBid = bidRepository.findHighestBidAmountByItemId(bid.getItem().getItemId())
                    .orElse(bid.getItem().getStartingPrice());
            dto.setCurrentHighestBid(currentHighestBid);
            
            // Check if this is the highest bid
            dto.setIsHighestBid(bid.getAmount().compareTo(currentHighestBid) >= 0);
            
            // Check if user has been outbid
            dto.setIsOutbid(!dto.getIsHighestBid() && 
                bidRepository.existsByItemIdAndAmountGreaterThan(bid.getItem().getItemId(), bid.getAmount()));
            
            return dto;
        }).collect(Collectors.toList());
    }
}