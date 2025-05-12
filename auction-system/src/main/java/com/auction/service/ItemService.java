package com.auction.service;

import com.auction.exception.ResourceNotFoundException;
import com.auction.model.Category;
import com.auction.model.Item;
import com.auction.model.User;
import com.auction.repository.CategoryRepository;
import com.auction.repository.ItemRepository;
import com.auction.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ItemService(
            ItemRepository itemRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found with id: " + itemId));
    }

    public List<Item> getItemsByCategory(Long categoryId) {
        return itemRepository.findByCategoryCategoryId(categoryId);
    }

    public List<Item> getItemsBySeller(Long sellerId) {
        return itemRepository.findBySellerUserId(sellerId);
    }

    public List<Item> getItemsByStatus(Item.ItemStatus status) {
        return itemRepository.findByItemStatus(status);
    }

    public List<Item> searchItems(String keyword) {
        return itemRepository.findByTitleContainingIgnoreCase(keyword);
    }

    @Transactional
    public Item createItem(Item item, Long categoryId) {
        Category category = null;
        if (categoryId != null) {
            category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
        }
        item.setCategory(category);
        // Set initial status only if not set
        if (item.getItemStatus() == null) {
            item.setItemStatus(Item.ItemStatus.DRAFT);
        }
        // Do not set seller here
        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItem(Long itemId, Item itemDetails) {
        Item item = getItemById(itemId);
        if (itemDetails.getTitle() != null) item.setTitle(itemDetails.getTitle());
        if (itemDetails.getDescription() != null) item.setDescription(itemDetails.getDescription());
        if (itemDetails.getImageUrl() != null) item.setImageUrl(itemDetails.getImageUrl());
        if (itemDetails.getStartingPrice() != null) item.setStartingPrice(itemDetails.getStartingPrice());
        if (itemDetails.getCategory() != null && itemDetails.getCategory().getCategoryId() != null) {
            Category category = categoryRepository.findById(itemDetails.getCategory().getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Category not found with id: " + itemDetails.getCategory().getCategoryId()));
            item.setCategory(category);
        }
        if (itemDetails.getStartDate() != null) item.setStartDate(itemDetails.getStartDate());
        if (itemDetails.getEndDate() != null) item.setEndDate(itemDetails.getEndDate());
        if (itemDetails.getItemStatus() != null) item.setItemStatus(itemDetails.getItemStatus());
        return itemRepository.save(item);
    }

    @Transactional
    public Item publishItem(Long itemId, LocalDateTime startDate, LocalDateTime endDate) {
        Item item = getItemById(itemId);
        
        if (startDate == null) {
            startDate = LocalDateTime.now();
        }
        
        if (endDate == null || endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("End date must be after start date");
        }
        
        item.setStartDate(startDate);
        item.setEndDate(endDate);
        item.setItemStatus(Item.ItemStatus.ACTIVE);
        
        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItemStatus(Long itemId, Item.ItemStatus status) {
        Item item = getItemById(itemId);
        item.setItemStatus(status);
        return itemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long itemId) {
        if (!itemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException("Item not found with id: " + itemId);
        }
        itemRepository.deleteById(itemId);
    }

    public List<Item> findExpiredAuctions() {
        return itemRepository.findExpiredAuctions(LocalDateTime.now());
    }
}