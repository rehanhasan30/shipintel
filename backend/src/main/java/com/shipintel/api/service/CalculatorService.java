package com.shipintel.api.service;

import com.shipintel.api.dto.CalculatorInputDto;
import com.shipintel.api.dto.CourierRecommendationDto;
import com.shipintel.api.entity.Courier;
import com.shipintel.api.entity.CourierServiceEntity;
import com.shipintel.api.entity.FreightRate;
import com.shipintel.api.entity.TransportMode;
import com.shipintel.api.repository.CourierRepository;
import com.shipintel.api.repository.FreightRateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalculatorService {

    private final FreightRateRepository freightRateRepository;
    private final CourierRepository courierRepository;

    @Transactional(readOnly = true)
    public List<CourierRecommendationDto> calculateRates(CalculatorInputDto input) {
        double volumetricWeight = (input.getLength() * input.getWidth() * input.getHeight()) / 5000.0;
        double chargeableWeight = Math.max(input.getWeight(), volumetricWeight);
        BigDecimal weightParam = BigDecimal.valueOf(chargeableWeight).setScale(2, RoundingMode.HALF_UP);

        // Map frontend service to database transport modes
        List<TransportMode> targetModes = new ArrayList<>();
        if ("express".equalsIgnoreCase(input.getService())) {
            targetModes.add(TransportMode.AIR);
        } else {
            targetModes.add(TransportMode.ROAD);
            targetModes.add(TransportMode.SEA);
        }

        // Try to query direct rates from database
        List<FreightRate> matchedRates = freightRateRepository.findMatchingRates(
                mapCityToZip(input.getOrigin()),
                mapCityToZip(input.getDestination()),
                weightParam
        );

        // Filter matched rates to fit service type modes
        matchedRates = matchedRates.stream()
                .filter(rate -> targetModes.contains(rate.getCourierService().getTransportMode()))
                .collect(Collectors.toList());

        List<CourierRecommendationDto> recommendations = new ArrayList<>();

        if (!matchedRates.isEmpty()) {
            for (FreightRate rate : matchedRates) {
                CourierServiceEntity service = rate.getCourierService();
                Courier courier = service.getCourier();
                
                recommendations.add(CourierRecommendationDto.builder()
                        .courierName(courier.getName())
                        .courierLogoInitials(courier.getName().substring(0, 1))
                        .cost(rate.getCost().doubleValue())
                        .days(rate.getEstimatedDays() != null ? rate.getEstimatedDays() : 3)
                        .logoBgClass(getLogoBgClass(courier.getName()))
                        .build());
            }
        } else {
            // Fallback: Generate realistic rates for all database couriers matching the requested mode
            List<Courier> allCouriers = courierRepository.findAllWithRelations();
            for (Courier courier : allCouriers) {
                List<CourierServiceEntity> matchingServices = courier.getServices().stream()
                        .filter(s -> targetModes.contains(s.getTransportMode()))
                        .collect(Collectors.toList());

                for (CourierServiceEntity service : matchingServices) {
                    double costPerKg = service.getTransportMode() == TransportMode.AIR ? 18.5 : 7.2;
                    double baseFee = service.getTransportMode() == TransportMode.AIR ? 250.0 : 120.0;
                    int days = service.getTransportMode() == TransportMode.AIR ? 2 : 5;

                    // Apply courier-specific rate factors to make rates and times different
                    String cName = courier.getName().toLowerCase();
                    if (cName.contains("blue dart")) {
                        baseFee *= 1.35;
                        costPerKg *= 1.35;
                        days = Math.max(1, days - 1);
                    } else if (cName.contains("dtdc")) {
                        baseFee *= 0.95;
                        costPerKg *= 0.95;
                    } else if (cName.contains("xpressbees")) {
                        baseFee *= 0.9;
                        costPerKg *= 0.9;
                    } else if (cName.contains("india post")) {
                        baseFee *= 0.6;
                        costPerKg *= 0.6;
                        days += 1;
                    } // Delhivery remains at 1.0 (standard benchmark)

                    double cost = Math.round((chargeableWeight * costPerKg + baseFee) * 100.0) / 100.0;

                    recommendations.add(CourierRecommendationDto.builder()
                            .courierName(courier.getName() + " (" + getModeLabel(service.getTransportMode()) + ")")
                            .courierLogoInitials(courier.getName().substring(0, 1))
                            .cost(cost)
                            .days(days)
                            .logoBgClass(getLogoBgClass(courier.getName()))
                            .build());
                }
            }
        }

        // Sort by cost ascending
        recommendations.sort(Comparator.comparingDouble(CourierRecommendationDto::getCost));

        // Add special UI tags for the top options
        if (!recommendations.isEmpty()) {
            // Mark the cheapest option as "Best Value"
            CourierRecommendationDto bestValue = recommendations.get(0);
            bestValue.setTag("Best Value");
            bestValue.setTagClass("bg-tertiary-fixed text-on-tertiary-fixed");

            // Find and mark the fastest option as "Fastest"
            recommendations.stream()
                    .min(Comparator.comparingInt(CourierRecommendationDto::getDays))
                    .ifPresent(fastest -> {
                        if (fastest != bestValue) {
                            fastest.setTag("Fastest");
                            fastest.setTagClass("bg-primary-fixed text-on-primary-fixed");
                        } else {
                            bestValue.setTag("Fastest & Best Value");
                            bestValue.setTagClass("bg-primary-fixed text-on-primary-fixed");
                        }
                    });
        }

        return recommendations;
    }

    private String getLogoBgClass(String name) {
        String n = name.toLowerCase();
        if (n.contains("delhivery")) return "bg-primary-container text-on-primary";
        if (n.contains("dtdc")) return "bg-secondary-container text-on-secondary-container";
        if (n.contains("blue dart")) return "bg-tertiary-container text-on-tertiary-container";
        if (n.contains("india post")) return "bg-error-container text-on-error-container";
        return "bg-surface-variant text-on-surface-variant";
    }

    private String getModeLabel(TransportMode mode) {
        switch (mode) {
            case AIR: return "Air";
            case ROAD: return "Ground";
            case SEA: return "Ocean";
            default: return mode.name();
        }
    }

    private String mapCityToZip(String input) {
        if (input == null) return "";
        String clean = input.trim().toLowerCase();
        if (clean.contains("delhi")) return "110001";
        if (clean.contains("mumbai")) return "400001";
        if (clean.contains("bangalore") || clean.contains("bengaluru")) return "560001";
        if (clean.contains("chennai")) return "600001";
        if (clean.contains("kolkata")) return "700001";
        if (clean.contains("hyderabad")) return "500001";
        return input.trim();
    }
}
