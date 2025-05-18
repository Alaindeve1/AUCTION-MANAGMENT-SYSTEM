package com.auction.repository;

import com.auction.model.Item;
import com.auction.model.Item.ItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findBySellerUserId(Long userId);
    List<Item> findByCategoryCategoryId(Long categoryId);
    List<Item> findByItemStatus(ItemStatus status);
    
    @Query("SELECT i FROM Item i WHERE i.itemStatus = 'ACTIVE' AND i.endDate < :now")
    List<Item> findExpiredAuctions(LocalDateTime now);
    
    List<Item> findByTitleContainingIgnoreCase(String keyword);
    long countByItemStatus(ItemStatus status);

    // Add pagination support
    Page<Item> findAll(Pageable pageable);
    Page<Item> findByCategoryCategoryId(Long categoryId, Pageable pageable);
    Page<Item> findBySellerUserId(Long sellerId, Pageable pageable);
    Page<Item> findByItemStatus(ItemStatus status, Pageable pageable);
    
    // Add search support
    @Query("SELECT i FROM Item i WHERE " +
           "LOWER(i.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Item> searchItems(@Param("query") String query, Pageable pageable);

    Page<Item> findByCategory_CategoryId(Long categoryId, Pageable pageable);
    Page<Item> findBySellerId(Long sellerId, Pageable pageable);
}