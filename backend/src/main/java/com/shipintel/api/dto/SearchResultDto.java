package com.shipintel.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private SearchType type;
    private String title;
    private String description;
    private String url;
    private double score;

    // Optional metadata to support frontend tracking, blog and calculator displays
    private String carrierName;
    private String trackingNumber;
    private String supportEmail;
    private String supportPhone;
    private String logoBgClass;
    private String logoInitials;
    private String tab;
    private String category;
}
