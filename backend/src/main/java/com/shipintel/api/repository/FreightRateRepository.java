package com.shipintel.api.repository;

import com.shipintel.api.entity.FreightRate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FreightRateRepository extends JpaRepository<FreightRate, Long> {

    @Query("SELECT r FROM FreightRate r " +
           "JOIN FETCH r.courierService s " +
           "JOIN FETCH s.courier c " +
           "WHERE ((r.originZip = :origin AND r.destinationZip = :destination) " +
           "OR (r.originZip = :destination AND r.destinationZip = :origin)) " +
           "AND :weight >= r.minWeightKg " +
           "AND :weight <= r.maxWeightKg")
    List<FreightRate> findMatchingRates(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("weight") BigDecimal weight
    );

    @Query("SELECT r FROM FreightRate r " +
           "JOIN FETCH r.courierService s " +
           "JOIN FETCH s.courier c")
    List<FreightRate> findAllWithRelations();
}
