package com.auction.service;

import com.auction.model.Item;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class AuctionScheduler {

    private static final Logger logger = LoggerFactory.getLogger(AuctionScheduler.class);

    private final ItemService itemService;
    private final AuctionResultService auctionResultService;

    public AuctionScheduler(ItemService itemService, AuctionResultService auctionResultService) {
        this.itemService = itemService;
        this.auctionResultService = auctionResultService;
    }

    /**
     * Runs every 15 minutes to check for expired auctions and process them
     */
    @Scheduled(fixedRate = 900000) // 15 minutes in milliseconds
    @Transactional
    public void processExpiredAuctions() {
        logger.info("Running scheduled task to process expired auctions");
        
        List<Item> expiredAuctions = itemService.findExpiredAuctions();
        logger.info("Found {} expired auctions", expiredAuctions.size());
        
        for (Item item : expiredAuctions) {
            try {
                logger.info("Processing expired auction for item ID: {}", item.getItemId());
                auctionResultService.createAuctionResult(item.getItemId());
                logger.info("Successfully processed auction for item ID: {}", item.getItemId());
            } catch (Exception e) {
                logger.error("Error processing auction for item ID: {}", item.getItemId(), e);
            }
        }
    }
}