package com.shipintel.api.controller;

import com.shipintel.api.dto.ApiResponse;
import com.shipintel.api.dto.CalculatorInputDto;
import com.shipintel.api.dto.CourierRecommendationDto;
import com.shipintel.api.service.CalculatorService;
import com.shipintel.api.security.RateLimit;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/calculator")
@RequiredArgsConstructor
public class CalculatorController {

    private final CalculatorService calculatorService;

    @PostMapping("/rates")
    @RateLimit(limit = 30, periodSeconds = 60)
    public ResponseEntity<ApiResponse<List<CourierRecommendationDto>>> calculateRates(
            @RequestBody CalculatorInputDto input
    ) {
        List<CourierRecommendationDto> recommendations = calculatorService.calculateRates(input);
        return ResponseEntity.ok(ApiResponse.success(recommendations, "Rates calculated successfully"));
    }
}
