package com.shipintel.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourierDto {
    private String id;
    private String name;
    private double rating;
    private String logoUrl;
    private List<String> modes;
    private List<String> coverage;
    private List<String> tags;
    private String type;
    private String description;
    private String damageClaims;
    private Double transitTimeRating;
    private Double billingAccuracy;
    private List<ServiceLevelDto> serviceLevels;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceLevelDto {
        private String name;
        private String transitTime;
        private String maxWeight;
        private String specialHandling;
        private String baseIndex;
    }
}
