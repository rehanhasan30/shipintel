package com.shipintel.api.repository;

import com.shipintel.api.entity.CourierServiceEntity;
import com.shipintel.api.entity.TransportMode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourierServiceEntityRepository extends JpaRepository<CourierServiceEntity, Long> {
    List<CourierServiceEntity> findByTransportMode(TransportMode transportMode);
}
