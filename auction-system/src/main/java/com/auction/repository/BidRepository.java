package com.auction.repository;

import com.auction.model.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findByItemItemId(Long itemId);
    List<Bid> findByBidderUserId(Long userId);
    List<Bid> findByBidderUserIdOrderByBidTimeDesc(Long userId);
    
    @Query("SELECT MAX(b.bidAmount) FROM Bid b WHERE b.item.itemId = :itemId")
    Optional<BigDecimal> findHighestBidForItem(@Param("itemId") Long itemId);
    
    @Query("SELECT MAX(b.bidAmount) FROM Bid b WHERE b.item.itemId = :itemId")
    Optional<BigDecimal> findHighestBidAmountByItemId(@Param("itemId") Long itemId);
    
    @Query("SELECT b FROM Bid b WHERE b.item.itemId = :itemId AND b.bidAmount = " +
           "(SELECT MAX(b2.bidAmount) FROM Bid b2 WHERE b2.item.itemId = :itemId)")
    Optional<Bid> findHighestBidWithBidderForItem(@Param("itemId") Long itemId);
    
    @Query("SELECT COUNT(b) FROM Bid b WHERE b.item.itemId = :itemId")
    long countBidsByItemId(@Param("itemId") Long itemId);
    
    @Query("SELECT COUNT(DISTINCT b.bidder.userId) FROM Bid b")
    long countUniqueBidders();
    
    @Query("SELECT SUM(b.bidAmount) FROM Bid b")
    BigDecimal getTotalBidValue();
    
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Bid b WHERE b.item.itemId = :itemId AND b.bidAmount > :amount")
    boolean existsByItemIdAndAmountGreaterThan(@Param("itemId") Long itemId, @Param("amount") BigDecimal amount);
}