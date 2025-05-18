package com.auction.service;

import com.auction.model.Item;
import com.auction.model.User;
import com.auction.model.Category;
import com.auction.repository.ItemRepository;
import com.auction.repository.UserRepository;
import com.auction.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class SearchService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Map<String, Object>> search(String query) {
        List<Map<String, Object>> results = new ArrayList<>();

        // Search items
        itemRepository.searchItems(query, null).getContent().forEach(item -> {
            Map<String, Object> result = new HashMap<>();
            result.put("type", "ITEM");
            result.put("id", item.getItemId());
            result.put("title", item.getTitle());
            result.put("description", item.getDescription());
            results.add(result);
        });

        // Search users
        userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query)
            .forEach(user -> {
                Map<String, Object> result = new HashMap<>();
                result.put("type", "USER");
                result.put("id", user.getUserId());
                result.put("name", user.getUsername());
                result.put("description", user.getEmail());
                results.add(result);
            });

        // Search categories
        categoryRepository.findByCategoryNameContainingIgnoreCase(query)
            .forEach(category -> {
                Map<String, Object> result = new HashMap<>();
                result.put("type", "CATEGORY");
                result.put("id", category.getCategoryId());
                result.put("name", category.getName());
                result.put("description", category.getDescription());
                results.add(result);
            });

        return results;
    }
} 