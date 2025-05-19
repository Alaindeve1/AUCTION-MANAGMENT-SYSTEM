package com.auction.service;

import com.auction.model.Item;
import com.auction.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    @Autowired
    private ItemRepository itemRepository;

    public List<Item> search(String query) {
        // Search in item names, descriptions, and categories
        return itemRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrCategoryNameContainingIgnoreCase(
            query, query, query
        );
    }
} 