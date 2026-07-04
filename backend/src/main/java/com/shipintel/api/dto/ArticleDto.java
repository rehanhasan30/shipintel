package com.shipintel.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDto {
    private String id; // maps to slug for routing ease
    private String title;
    private String excerpt;
    private String content;
    private String date; // formatted string e.g. "Oct 12, 2023"
    private String readTime; // e.g. "5 min"
    private String category; // category name
    private String imageUrl;
    private String author;
    private String authorInitials;
    private String authorBgClass;
    private boolean highlighted;
}
