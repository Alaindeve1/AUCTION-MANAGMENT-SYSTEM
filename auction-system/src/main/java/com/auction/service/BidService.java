package com.auction.service;

import com.auction.exception.ResourceNotFoundException;
import com.auction.model.Bid;
import com.auction.model.Item;
import com.auction.model.User;
import com.auction.repository.BidRepository;
import com.auction.repository.ItemRepository;
import com.auction.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BidService {

    private final BidRepository bidRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    public BidService(
            BidRepository bidRepository,
            ItemRepository itemRepository,
            UserRepository userRepository) {
        this.bidRepository = bidRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
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

    // Ensure lastItemBidId is initialized
    if (item.getLastItemBidId() == null) {
        item.setLastItemBidId(0L); // Initialize to 0L if null
    }

    // Generate item-specific bid ID
    Long itemBidId = item.getLastItemBidId() + 1;
    item.setLastItemBidId(itemBidId); // Update the last item-specific bid ID
    itemRepository.save(item); // Save the updated item

    // Create and save the bid
    Bid bid = new Bid();
    bid.setItem(item);
    bid.setBidder(bidder);
    bid.setBidAmount(bidAmount);
    bid.setBidTime(LocalDateTime.now());
    bid.setItemBidId(itemBidId); // Set the item-specific bid ID

    return bidRepository.save(bid);
}

    @Transactional
    public void deleteBid(Long bidId) {
        if (!bidRepository.existsById(bidId)) {
            throw new ResourceNotFoundException("Bid not found with id: " + bidId);
        }
        bidRepository.deleteById(bidId);
    }
}