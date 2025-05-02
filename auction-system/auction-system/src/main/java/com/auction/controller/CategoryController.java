package com.auction.controller;

import com.auction.dto.CategoryDto;
import com.auction.model.Category;
import com.auction.model.Item;
import com.auction.service.CategoryService;
import com.auction.service.ItemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;
    private final ItemService itemService;

    public CategoryController(CategoryService categoryService, ItemService itemService) {
        this.categoryService = categoryService;
        this.itemService = itemService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryDto>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        List<CategoryDto> categoryDtos = categories.stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoryDtos);
    }

    @GetMapping("/root")
    public ResponseEntity<List<CategoryDto>> getRootCategories() {
        List<Category> rootCategories = categoryService.getRootCategories();
        List<CategoryDto> categoryDtos = rootCategories.stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoryDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable("id") Long categoryId) {
        Category category = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(CategoryDto.fromEntity(category));
    }

    @GetMapping("/{id}/subcategories")
    public ResponseEntity<List<CategoryDto>> getSubcategories(@PathVariable("id") Long categoryId) {
        List<Category> subcategories = categoryService.getSubcategories(categoryId);
        List<CategoryDto> categoryDtos = subcategories.stream()
                .map(CategoryDto::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(categoryDtos);
    }

    @GetMapping("/{id}/items")
    public ResponseEntity<List<Item>> getCategoryItems(@PathVariable("id") Long categoryId) {
        return ResponseEntity.ok(itemService.getItemsByCategory(categoryId));
    }

    @PostMapping
    public ResponseEntity<CategoryDto> createCategory(@Valid @RequestBody Category category) {
        Category createdCategory = categoryService.createCategory(category);
        return new ResponseEntity<>(CategoryDto.fromEntity(createdCategory), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @PathVariable("id") Long categoryId,
            @Valid @RequestBody Category categoryDetails) {
        Category updatedCategory = categoryService.updateCategory(categoryId, categoryDetails);
        return ResponseEntity.ok(CategoryDto.fromEntity(updatedCategory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable("id") Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getCategoryCount() {
        return ResponseEntity.ok(categoryService.getCategoryCount());
    }
}