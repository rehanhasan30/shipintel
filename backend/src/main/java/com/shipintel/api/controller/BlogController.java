package com.shipintel.api.controller;

import com.shipintel.api.dto.ApiResponse;
import com.shipintel.api.dto.ArticleDto;
import com.shipintel.api.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blog/articles")
@RequiredArgsConstructor
public class BlogController {

    private final BlogService blogService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ArticleDto>>> getAllArticles() {
        List<ArticleDto> articles = blogService.getAllArticles();
        return ResponseEntity.ok(ApiResponse.success(articles, "Articles retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ArticleDto>> getArticleByIdOrSlug(@PathVariable String id) {
        return blogService.getArticleBySlugOrId(id)
                .map(article -> ResponseEntity.ok(ApiResponse.success(article, "Article details loaded")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Article not found")));
    }
}
