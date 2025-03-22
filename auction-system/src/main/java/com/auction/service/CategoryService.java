package com.auction.service;

import com.auction.exception.ResourceNotFoundException;
import com.auction.model.Category;
import com.auction.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getRootCategories() {
        return categoryRepository.findByParentCategoryIsNull();
    }

    public List<Category> getSubcategories(Long parentCategoryId) {
        return categoryRepository.findByParentCategoryCategoryId(parentCategoryId);
    }

    public Category getCategoryById(Long categoryId) {
        return categoryRepository.findByIdWithParent(categoryId)  // Use the custom query
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));
    }

    public Category getCategoryByName(String categoryName) {
        return categoryRepository.findByCategoryName(categoryName)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with name: " + categoryName));
    }

    @Transactional
    public Category createCategory(Category category) {
        Category savedCategory = categoryRepository.save(category);
        // Fetch the complete category with parent data after saving
        return categoryRepository.findByIdWithParent(savedCategory.getCategoryId())
                .orElse(savedCategory);
    }

    @Transactional
    public Category updateCategory(Long categoryId, Category categoryDetails) {
        Category category = getCategoryById(categoryId);
        
        category.setCategoryName(categoryDetails.getCategoryName());
        category.setDescription(categoryDetails.getDescription()); // Added to ensure description is updated
        
        if (categoryDetails.getParentCategory() != null) {
            // Prevent circular references
            if (categoryDetails.getParentCategory().getCategoryId().equals(categoryId)) {
                throw new IllegalArgumentException("A category cannot be its own parent");
            }
            category.setParentCategory(categoryDetails.getParentCategory());
        } else {
            category.setParentCategory(null);
        }
        
        Category updatedCategory = categoryRepository.save(category);
        // Fetch the complete category with parent data after updating
        return categoryRepository.findByIdWithParent(updatedCategory.getCategoryId())
                .orElse(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category not found with id: " + categoryId);
        }
        categoryRepository.deleteById(categoryId);
    }
}