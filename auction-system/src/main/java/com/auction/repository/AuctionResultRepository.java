package com.auction.repository;

import com.auction.model.AuctionResult;
import com.auction.model.AuctionResult.ResultStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionResultRepository extends JpaRepository<AuctionResult, Long> {
    Optional<AuctionResult> findByItemItemId(Long itemId);
    
    @Query("SELECT ar FROM AuctionResult ar WHERE ar.winner.userId = :userId")
    List<AuctionResult> findByWinnerUserId(Long userId);
    
    List<AuctionResult> findByResultStatus(ResultStatus status);
}