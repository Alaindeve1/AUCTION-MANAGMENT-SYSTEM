package com.auction.controller;

import com.auction.dto.BidDto;
import com.auction.dto.ItemDto;
import com.auction.dto.SellingItemDto;
import com.auction.model.Bid;
import com.auction.model.Item;
import com.auction.service.BidService;
import com.auction.service.ItemService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "http://localhost:3000")
public class ItemController {

    private final ItemService itemService;
    private final BidService bidService;

    public ItemController(ItemService itemService, BidService bidService) {
        this.itemService = itemService;
        this.bidService = bidService;
    }

    @GetMapping
    public ResponseEntity<Page<Item>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "title") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(itemService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDto> getItemById(@PathVariable("id") Long itemId) {
        Item item = itemService.getItemById(itemId);
        return ResponseEntity.ok(ItemDto.fromEntity(item));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Item>> searchItems(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(itemService.searchItems(query, pageable));
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<Item>> getItemsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(itemService.findByCategoryId(categoryId, pageable));
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<Page<Item>> getItemsBySeller(
            @PathVariable Long sellerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(itemService.findBySellerId(sellerId, pageable));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<Item>> getItemsByStatus(
            @PathVariable Item.ItemStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(itemService.findByItemStatus(status, pageable));
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

    @GetMapping("/owner/{userId}")
    public ResponseEntity<List<SellingItemDto>> getItemsByOwner(@PathVariable("userId") Long userId) {
        List<Item> items = itemService.getItemsBySeller(userId);
        List<SellingItemDto> dtos = items.stream()
            .map(item -> new SellingItemDto(
                item.getItemId(),
                item.getTitle(),
                item.getImageUrl(),
                item.getStartingPrice(),
                item.getItemStatus() != null ? item.getItemStatus().name() : null
            ))
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable("id") Long itemId) {
        // TODO: Restrict to admin only (add proper security check here)
        itemService.deleteItem(itemId);
        return ResponseEntity.noContent().build();
    }
}