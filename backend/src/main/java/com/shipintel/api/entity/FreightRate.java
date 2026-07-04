package com.shipintel.api.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "freight_rates")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreightRate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courier_service_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private CourierServiceEntity courierService;

    @Column(name = "origin_zip", nullable = false, length = 20)
    private String originZip;

    @Column(name = "destination_zip", nullable = false, length = 20)
    private String destinationZip;

    @Column(name = "min_weight_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal minWeightKg;

    @Column(name = "max_weight_kg", nullable = false, precision = 10, scale = 2)
    private BigDecimal maxWeightKg;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal cost;

    @Column(nullable = false, length = 3)
    @Builder.Default
    private String currency = "USD";

    @Column(name = "estimated_days")
    private Integer estimatedDays;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
