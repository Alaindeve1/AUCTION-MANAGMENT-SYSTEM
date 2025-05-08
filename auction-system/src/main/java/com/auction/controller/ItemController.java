package com.auction.controller;

import com.auction.dto.BidDto;
import com.auction.dto.ItemDto;
import com.auction.model.Bid;
import com.auction.model.Item;
import com.auction.service.BidService;
import com.auction.service.ItemService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;
    private final BidService bidService;

    public ItemController(ItemService itemService, BidService bidService) {
        this.itemService = itemService;
        this.bidService = bidService;
    }

    @GetMapping
    public ResponseEntity<List<ItemDto>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        List<ItemDto> itemDtos = items.stream()
                .map(ItemDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(itemDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDto> getItemById(@PathVariable("id") Long itemId) {
        Item item = itemService.getItemById(itemId);
        return ResponseEntity.ok(ItemDto.fromEntity(item));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ItemDto>> searchItems(@RequestParam String keyword) {
        List<Item> items = itemService.searchItems(keyword);
        List<ItemDto> itemDtos = items.stream()
                .map(ItemDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(itemDtos);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ItemDto>> getItemsByStatus(@PathVariable Item.ItemStatus status) {
        List<Item> items = itemService.getItemsByStatus(status);
        List<ItemDto> itemDtos = items.stream()
                .map(ItemDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(itemDtos);
    }

    @GetMapping("/{id}/bids")
    public ResponseEntity<List<BidDto>> getItemBids(@PathVariable("id") Long itemId) {
        List<Bid> bids = bidService.getBidsByItem(itemId);
        List<BidDto> bidDtos = bids.stream()
                .map(BidDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bidDtos);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemDto> createItem(@RequestBody Map<String, Object> request) {
        // TODO: Restrict to admin only (add proper security check here)
        String title = (String) request.get("title");
        String description = (String) request.getOrDefault("description", "");
        String imageUrl = (String) request.getOrDefault("imageUrl", "");
        Double startingPrice = Double.valueOf(request.get("startingPrice").toString());
        String itemStatusStr = (String) request.getOrDefault("itemStatus", "DRAFT");
        Long categoryId = request.get("categoryId") != null ? Long.valueOf(request.get("categoryId").toString()) : null;

        Item item = new Item();
        item.setTitle(title);
        item.setDescription(description);
        item.setImageUrl(imageUrl);
        item.setStartingPrice(java.math.BigDecimal.valueOf(startingPrice));
        item.setItemStatus(Item.ItemStatus.valueOf(itemStatusStr));

        Item createdItem = itemService.createItem(item, categoryId);
        return new ResponseEntity<>(ItemDto.fromEntity(createdItem), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemDto> updateItem(
            @PathVariable("id") Long itemId,
            @Valid @RequestBody Item itemDetails) {
        // TODO: Restrict to admin only (add proper security check here)
        Item updatedItem = itemService.updateItem(itemId, itemDetails);
        return ResponseEntity.ok(ItemDto.fromEntity(updatedItem));
    }

    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemDto> publishItem(
            @PathVariable("id") Long itemId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        Item publishedItem = itemService.publishItem(itemId, startDate, endDate);
        return ResponseEntity.ok(ItemDto.fromEntity(publishedItem));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ItemDto> updateItemStatus(
            @PathVariable("id") Long itemId,
            @RequestBody Item.ItemStatus status) {
        // TODO: Restrict to admin only (add proper security check here)
        Item updatedItem = itemService.updateItemStatus(itemId, status);
        return ResponseEntity.ok(ItemDto.fromEntity(updatedItem));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable("id") Long itemId) {
        // TODO: Restrict to admin only (add proper security check here)
        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}