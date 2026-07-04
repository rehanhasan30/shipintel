package com.shipintel.api.repository;

import com.shipintel.api.entity.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {

    @Query("SELECT a FROM Article a JOIN FETCH a.category ORDER BY a.createdAt DESC")
    List<Article> findAllWithCategory();

    @Query("SELECT a FROM Article a JOIN FETCH a.category WHERE a.slug = :slug")
    Optional<Article> findBySlugWithCategory(@Param("slug") String slug);

    @Query("SELECT a FROM Article a JOIN FETCH a.category WHERE a.id = :id")
    Optional<Article> findByIdWithCategory(@Param("id") Long id);
}
