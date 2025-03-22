package com.auction.repository;

import com.auction.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Find a category by its name
    Optional<Category> findByCategoryName(String categoryName);

    // Find all top-level categories (categories with no parent)
    List<Category> findByParentCategoryIsNull();

    // Find all subcategories of a specific parent category
    List<Category> findByParentCategoryCategoryId(Long parentCategoryId);

    // Custom query to fetch a category along with its parentCategory
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parentCategory WHERE c.categoryId = :id")
    Optional<Category> findByIdWithParent(@Param("id") Long id);
    
    // Fetch a category with parent and parent's subcategories
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.parentCategory p LEFT JOIN FETCH p.subcategories WHERE c.categoryId = :id")
    Optional<Category> findByIdWithParentAndParentSubcategories(@Param("id") Long id);
    
    // Fetch a category with its own subcategories
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.subcategories WHERE c.categoryId = :id")
    Optional<Category> findByIdWithSubcategories(@Param("id") Long id);
    
    // Fetch a complete category with parent, parent's subcategories, and its own subcategories
    @Query("SELECT DISTINCT c FROM Category c " +
           "LEFT JOIN FETCH c.parentCategory p " +
           "LEFT JOIN FETCH c.subcategories " +
           "LEFT JOIN FETCH p.subcategories " +
           "WHERE c.categoryId = :id")
    Optional<Category> findByIdWithFullHierarchy(@Param("id") Long id);
}