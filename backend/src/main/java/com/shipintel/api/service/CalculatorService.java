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
            double distance = getDistanceBetween(mapCityToZip(input.getOrigin()), mapCityToZip(input.getDestination()));
            double distanceMultiplier = 0.6 + (distance / 2000.0);

            for (Courier courier : allCouriers) {
                List<CourierServiceEntity> matchingServices = courier.getServices().stream()
                        .filter(s -> targetModes.contains(s.getTransportMode()))
                        .collect(Collectors.toList());

                for (CourierServiceEntity service : matchingServices) {
                    double costPerKg = service.getTransportMode() == TransportMode.AIR ? 18.5 : 7.2;
                    double baseFee = service.getTransportMode() == TransportMode.AIR ? 250.0 : 120.0;
                    int days = service.getTransportMode() == TransportMode.AIR ? 
                            (distance < 1000 ? 1 : 2) : 
                            (distance < 1000 ? 3 : (distance < 1800 ? 5 : 6));

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

                    double cost = Math.round((chargeableWeight * costPerKg + baseFee) * distanceMultiplier * 100.0) / 100.0;

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

    private double getDistanceBetween(String zip1, String zip2) {
        // Approximate latitude and longitude coordinates for major Indian metro zip codes:
        // Delhi (110001): Lat 28.61, Lon 77.20
        // Mumbai (400001): Lat 18.92, Lon 72.82
        // Bangalore (560001): Lat 12.97, Lon 77.59
        // Chennai (600001): Lat 13.08, Lon 80.27
        // Kolkata (700001): Lat 22.57, Lon 88.36
        // Hyderabad (500001): Lat 17.38, Lon 78.48
        
        double lat1 = 20.0;
        double lon1 = 78.0;
        double lat2 = 20.0;
        double lon2 = 78.0;
        
        if ("110001".equals(zip1)) { lat1 = 28.61; lon1 = 77.20; }
        else if ("400001".equals(zip1)) { lat1 = 18.92; lon1 = 72.82; }
        else if ("560001".equals(zip1)) { lat1 = 12.97; lon1 = 77.59; }
        else if ("600001".equals(zip1)) { lat1 = 13.08; lon1 = 80.27; }
        else if ("700001".equals(zip1)) { lat1 = 22.57; lon1 = 88.36; }
        else if ("500001".equals(zip1)) { lat1 = 17.38; lon1 = 78.48; }
        
        if ("110001".equals(zip2)) { lat2 = 28.61; lon2 = 77.20; }
        else if ("400001".equals(zip2)) { lat2 = 18.92; lon2 = 72.82; }
        else if ("560001".equals(zip2)) { lat2 = 12.97; lon2 = 77.59; }
        else if ("600001".equals(zip2)) { lat2 = 13.08; lon2 = 80.27; }
        else if ("700001".equals(zip2)) { lat2 = 22.57; lon2 = 88.36; }
        else if ("500001".equals(zip2)) { lat2 = 17.38; lon2 = 78.48; }
        
        // Haversine formula to calculate distance in km
        final int R = 6371; // Radius of the earth
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = R * c;
        
        return distance > 10.0 ? distance : 500.0; // Default fallback to 500km if same city/zip
    }
}
