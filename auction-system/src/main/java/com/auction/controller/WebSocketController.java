package com.auction.controller;

import com.auction.model.BidMessage;
import com.auction.model.User;
import com.auction.repository.UserRepository;
import com.auction.service.BidService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.math.BigDecimal;

@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;
    private final BidService bidService;

    @Autowired
    public WebSocketController(
            SimpMessagingTemplate messagingTemplate, 
            UserRepository userRepository,
            BidService bidService) {
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
        this.bidService = bidService;
    }

    @MessageMapping("/placeBid")
    @SendTo("/topic/bidUpdates")
    public BidMessage handleBid(@Payload BidMessage bidMessage) {
        try {
            // Get current user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                throw new RuntimeException("User not authenticated");
            }

            String currentUsername = authentication.getName();
            User currentUser = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update the bid message with bidder info
            bidMessage.setBidderId(currentUser.getUserId());
            bidMessage.setBidderName(currentUser.getUsername());

            logger.info("Bid placed: {}", bidMessage);
            
            return bidMessage;
        } catch (Exception e) {
            logger.error("Error processing bid: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    @MessageMapping("/bid/{itemId}")
    @SendTo("/topic/bid/{itemId}")
    public BidMessage handleItemBid(@DestinationVariable Long itemId, @Payload BidMessage bidMessage) {
        try {
            // Save the bid to the database
            try {
                // Set the item ID in the message
                bidMessage.setItemId(itemId);
                
                // Place the bid
                bidService.placeBid(
                    itemId,
                    1L, // Default user ID
                    BigDecimal.valueOf(bidMessage.getAmount())
                );
                
                // Update the bid message with success info
                bidMessage.setBidderId(1L);
                bidMessage.setBidderName("Anonymous");
                
                // Broadcast the successful bid to both topics
                messagingTemplate.convertAndSend("/topic/bidUpdates", bidMessage);
                messagingTemplate.convertAndSend("/topic/bid/" + itemId, bidMessage);
                
                logger.info("Bid placed on item {}: {}", itemId, bidMessage);
                return bidMessage;
            } catch (Exception e) {
                logger.error("Error saving bid: {}", e.getMessage());
                BidMessage errorMessage = new BidMessage();
                errorMessage.setItemId(itemId);
                errorMessage.setAmount(bidMessage.getAmount());
                errorMessage.setBidderId(1L);
                errorMessage.setBidderName("Anonymous");
                return errorMessage;
            }
        } catch (Exception e) {
            logger.error("Error processing bid for item {}: {}", itemId, e.getMessage(), e);
            BidMessage errorMessage = new BidMessage();
            errorMessage.setItemId(itemId);
            errorMessage.setAmount(bidMessage.getAmount());
            errorMessage.setBidderId(1L);
            errorMessage.setBidderName("Anonymous");
            return errorMessage;
        }
    }
    
    @MessageExceptionHandler
    @SendToUser("/queue/errors")
    public String handleException(Throwable exception) {
        logger.error("WebSocket error: {}", exception.getMessage(), exception);
        return "Error: " + HtmlUtils.htmlEscape(exception.getMessage());
    }
}
