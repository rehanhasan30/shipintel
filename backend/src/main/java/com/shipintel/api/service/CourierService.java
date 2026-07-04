package com.shipintel.api.service;

import com.shipintel.api.dto.CourierDto;
import com.shipintel.api.entity.Courier;
import com.shipintel.api.entity.CoverageArea;
import com.shipintel.api.entity.CourierServiceEntity;
import com.shipintel.api.repository.CourierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourierService {

    private final CourierRepository courierRepository;

    @Transactional(readOnly = true)
    public List<CourierDto> getAllCouriers() {
        return courierRepository.findAllWithRelations().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CourierDto> getCourierById(Long id) {
        return courierRepository.findById(id)
                .map(this::mapToDto);
    }

    private CourierDto mapToDto(Courier courier) {
        List<String> modes = courier.getServices().stream()
                .map(service -> {
                    switch (service.getTransportMode()) {
                        case AIR:
                            return "Express";
                        case ROAD:
                            return "Ground";
                        case SEA:
                            return "Sea";
                        default:
                            return service.getTransportMode().name();
                    }
                })
                .distinct()
                .collect(Collectors.toList());

        List<String> coverage = courier.getCoverageAreas().stream()
                .map(area -> {
                    if ("International".equalsIgnoreCase(area.getName())) {
                        return "Global";
                    }
                    return area.getName();
                })
                .distinct()
                .collect(Collectors.toList());

        CourierDto.CourierDtoBuilder builder = CourierDto.builder()
                .id(String.valueOf(courier.getId()))
                .name(courier.getName())
                .description(courier.getDescription())
                .logoUrl(null) // UI automatically falls back to nice letter-avatar
                .modes(modes)
                .coverage(coverage);

        populateMetadata(courier, builder);

        return builder.build();
    }

    private void populateMetadata(Courier courier, CourierDto.CourierDtoBuilder builder) {
        String name = courier.getName().toLowerCase();
        if (name.contains("delhivery")) {
            builder.rating(4.6)
                   .type("Integrated Logistics Provider")
                   .tags(List.of("Domestic Express", "Next Day Delivery", "Automated Sorting"))
                   .damageClaims("0.15%")
                   .transitTimeRating(97.2)
                   .billingAccuracy(99.1)
                   .serviceLevels(List.of(
                       CourierDto.ServiceLevelDto.builder()
                           .name("Delhivery Express")
                           .transitTime("1-2 Business Days")
                           .maxWeight("10 kg")
                           .specialHandling("Standard")
                           .baseIndex("1.2x")
                           .build(),
                       CourierDto.ServiceLevelDto.builder()
                           .name("Delhivery Surface")
                           .transitTime("3-5 Business Days")
                           .maxWeight("1000 kg")
                           .specialHandling("Heavy Goods")
                           .baseIndex("0.8x")
                           .build()
                   ));
        } else if (name.contains("dtdc")) {
            builder.rating(4.3)
                   .type("Express Courier Network")
                   .tags(List.of("Desk-to-Desk", "Large Network", "International Delivery"))
                   .damageClaims("0.22%")
                   .transitTimeRating(95.4)
                   .billingAccuracy(98.5)
                   .serviceLevels(List.of(
                       CourierDto.ServiceLevelDto.builder()
                           .name("DTDC Express")
                           .transitTime("2-3 Business Days")
                           .maxWeight("20 kg")
                           .specialHandling("Priority")
                           .baseIndex("1.3x")
                           .build(),
                       CourierDto.ServiceLevelDto.builder()
                           .name("DTDC Lite")
                           .transitTime("5-7 Business Days")
                           .maxWeight("50 kg")
                           .specialHandling("Standard")
                           .baseIndex("0.9x")
                           .build()
                   ));
        } else if (name.contains("blue dart")) {
            builder.rating(4.8)
                   .type("Premium Express Air")
                   .tags(List.of("Guaranteed SLA", "Air Express", "High Security"))
                   .damageClaims("0.05%")
                   .transitTimeRating(99.2)
                   .billingAccuracy(99.7)
                   .serviceLevels(List.of(
                       CourierDto.ServiceLevelDto.builder()
                           .name("Blue Dart Apex")
                           .transitTime("1 Business Day")
                           .maxWeight("30 kg")
                           .specialHandling("Secure / Valuables")
                           .baseIndex("1.5x")
                           .build(),
                       CourierDto.ServiceLevelDto.builder()
                           .name("Blue Dart Surfaceline")
                           .transitTime("3-4 Business Days")
                           .maxWeight("500 kg")
                           .specialHandling("Standard")
                           .baseIndex("1.0x")
                           .build()
                   ));
        } else if (name.contains("india post")) {
            builder.rating(4.1)
                   .type("National Postal System")
                   .tags(List.of("Government Operated", "Unmatched Reach", "Affordable"))
                   .damageClaims("0.35%")
                   .transitTimeRating(90.1)
                   .billingAccuracy(97.2)
                   .serviceLevels(List.of(
                       CourierDto.ServiceLevelDto.builder()
                           .name("Speed Post")
                           .transitTime("2-4 Business Days")
                           .maxWeight("35 kg")
                           .specialHandling("Standard")
                           .baseIndex("0.7x")
                           .build(),
                       CourierDto.ServiceLevelDto.builder()
                           .name("Registered Post")
                           .transitTime("5-10 Business Days")
                           .maxWeight("20 kg")
                           .specialHandling("Registered Mail")
                           .baseIndex("0.4x")
                           .build()
                   ));
        } else if (name.contains("xpressbees")) {
            builder.rating(4.4)
                   .type("E-commerce Logistics Specialist")
                   .tags(List.of("COD Support", "Fast Remittance", "Scalable Delivery"))
                   .damageClaims("0.18%")
                   .transitTimeRating(96.1)
                   .billingAccuracy(98.9)
                   .serviceLevels(List.of(
                       CourierDto.ServiceLevelDto.builder()
                           .name("XpressBees Express")
                           .transitTime("2-3 Business Days")
                           .maxWeight("15 kg")
                           .specialHandling("COD / E-commerce")
                           .baseIndex("1.1x")
                           .build()
                   ));
        } else {
            builder.rating(4.0)
                   .type("Logistics Partner")
                   .tags(List.of("Standard Shipping"))
                   .damageClaims("0.20%")
                   .transitTimeRating(95.0)
                   .billingAccuracy(98.0)
                   .serviceLevels(List.of());
        }
    }
}
