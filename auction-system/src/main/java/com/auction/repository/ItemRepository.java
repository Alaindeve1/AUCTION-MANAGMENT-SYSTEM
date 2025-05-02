package com.auction.repository;

import com.auction.model.Item;
import com.auction.model.Item.ItemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
}