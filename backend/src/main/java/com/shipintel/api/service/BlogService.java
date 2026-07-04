package com.shipintel.api.service;

import com.shipintel.api.dto.ArticleDto;
import com.shipintel.api.entity.Article;
import com.shipintel.api.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.cache.annotation.Cacheable;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogService {

    private final ArticleRepository articleRepository;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy");

    @Transactional(readOnly = true)
    @Cacheable(value = "articles")
    public List<ArticleDto> getAllArticles() {
        return articleRepository.findAllWithCategory().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "articles", key = "#identifier")
    public Optional<ArticleDto> getArticleBySlugOrId(String identifier) {
        // Try parsing as ID first
        try {
            Long id = Long.parseLong(identifier);
            return articleRepository.findByIdWithCategory(id).map(this::mapToDto);
        } catch (NumberFormatException e) {
            // Otherwise lookup by slug
            return articleRepository.findBySlugWithCategory(identifier).map(this::mapToDto);
        }
    }

    private ArticleDto mapToDto(Article article) {
        String cleanContent = article.getContent()
                .replaceAll("<[^>]*>", "") // strip html tags for excerpt
                .replaceAll("\\s+", " ")
                .trim();
        
        String excerpt = cleanContent.length() > 150 
                ? cleanContent.substring(0, 147) + "..." 
                : cleanContent;

        // Estimate read time
        int wordCount = cleanContent.split("\\s+").length;
        int minutes = Math.max(1, wordCount / 200);
        String readTime = minutes + " min";

        // Dynamic formatting of published/created date
        String dateStr = article.getPublishedAt() != null 
                ? article.getPublishedAt().format(DATE_FORMATTER)
                : article.getCreatedAt().format(DATE_FORMATTER);

        ArticleDto.ArticleDtoBuilder builder = ArticleDto.builder()
                .id(article.getSlug()) // Use slug as ID for routing matching in Angular
                .title(article.getTitle())
                .excerpt(excerpt)
                .content(article.getContent())
                .date(dateStr)
                .readTime(readTime)
                .category(article.getCategory() != null ? article.getCategory().getName() : "Uncategorized")
                .highlighted(article.getSlug().contains("volumetric")); // highlight the volumetric weight guide

        populateMetadata(article, builder);

        return builder.build();
    }

    private void populateMetadata(Article article, ArticleDto.ArticleDtoBuilder builder) {
        String slug = article.getSlug().toLowerCase();
        
        if (slug.contains("volumetric")) {
            builder.author("Amit Verma")
                   .authorInitials("AV")
                   .authorBgClass("bg-primary-fixed text-on-primary-fixed")
                   .imageUrl("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop");
        } else if (slug.contains("eway")) {
            builder.author("Neha Gupta")
                   .authorInitials("NG")
                   .authorBgClass("bg-secondary-fixed text-on-secondary-fixed")
                   .imageUrl("https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop");
        } else if (slug.contains("cod")) {
            builder.author("Rajesh Kumar")
                   .authorInitials("RK")
                   .authorBgClass("bg-tertiary-fixed text-on-tertiary-fixed")
                   .imageUrl("https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=600&auto=format&fit=crop");
        } else {
            builder.author("ShipIntel Team")
                   .authorInitials("SI")
                   .authorBgClass("bg-surface-variant text-on-surface-variant")
                   .imageUrl("https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop");
        }
    }
}
