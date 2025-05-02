package com.auction.dto;

import com.auction.model.Category;
import java.util.List;
import java.util.stream.Collectors;

public class CategoryDto {
    private Long categoryId;
    private String categoryName;
    private String description;
    private CategoryDto parentCategory;
    private List<CategoryDto> subcategories;

    // Default constructor
    public CategoryDto() {
    }

    // Constructor with fields
    public CategoryDto(Long categoryId, String categoryName, String description, CategoryDto parentCategory) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.description = description;
        this.parentCategory = parentCategory;
    }

    // Static method to convert Category entity to CategoryDto
    public static CategoryDto fromEntity(Category category) {
        if (category == null) {
            return null;
        }
    
        // Map the parentCategory
        CategoryDto parentCategoryDto = null;
        if (category.getParentCategory() != null) {
            parentCategoryDto = new CategoryDto(
                category.getParentCategory().getCategoryId(),
                category.getParentCategory().getCategoryName(),
                category.getParentCategory().getDescription(),
                null  // Avoid infinite recursion by not nesting the parent's parent
            );
        }
    
        // Create the CategoryDto
        CategoryDto dto = new CategoryDto(
            category.getCategoryId(),
            category.getCategoryName(),
            category.getDescription(),
            parentCategoryDto
        );
    
        // Map subcategories
        if (category.getSubcategories() != null && !category.getSubcategories().isEmpty()) {
            dto.setSubcategories(
                category.getSubcategories().stream()
                    .map(CategoryDto::fromEntity)
                    .collect(Collectors.toList())
            );
        }
    
        return dto;
    }

    // Getters and Setters
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public CategoryDto getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(CategoryDto parentCategory) {
        this.parentCategory = parentCategory;
    }

    public List<CategoryDto> getSubcategories() {
        return subcategories;
    }

    public void setSubcategories(List<CategoryDto> subcategories) {
        this.subcategories = subcategories;
    }

    @Override
    public String toString() {
        return "CategoryDto{" +
               "categoryId=" + categoryId +
               ", categoryName='" + categoryName + '\'' +
               ", description='" + description + '\'' +
               ", parentCategory=" + (parentCategory != null ? parentCategory.getCategoryName() : "null") +
               ", subcategoriesCount=" + (subcategories != null ? subcategories.size() : 0) +
               '}';
    }
}