package com.shipintel.api.controller;

import com.shipintel.api.dto.ApiResponse;
import com.shipintel.api.dto.CourierDto;
import com.shipintel.api.service.CourierService;
import com.shipintel.api.security.RateLimit;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/couriers")
@RequiredArgsConstructor
@RateLimit(limit = 60, periodSeconds = 60)
public class CourierController {

    private final CourierService courierService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CourierDto>>> getAllCouriers() {
        List<CourierDto> couriers = courierService.getAllCouriers();
        return ResponseEntity.ok(ApiResponse.success(couriers, "Couriers retrieved successfully"));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourierDto>> getCourierById(@PathVariable Long id) {
        return courierService.getCourierById(id)
                .map(courier -> ResponseEntity.ok(ApiResponse.success(courier, "Courier profile loaded")))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Courier profile not found")));
    }
}
