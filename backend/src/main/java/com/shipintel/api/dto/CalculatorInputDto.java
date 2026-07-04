package com.shipintel.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalculatorInputDto {
    private String origin;
    private String destination;
    private double length;
    private double width;
    private double height;
    private double weight;
    private String service; // "standard" or "express"
}
