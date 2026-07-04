package com.shipintel.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierRecommendationDto {
    private String courierName;
    private String courierLogoInitials;
    private double cost;
    private int days;
    private String tag;
    private String tagClass;
    private String logoBgClass;
}
