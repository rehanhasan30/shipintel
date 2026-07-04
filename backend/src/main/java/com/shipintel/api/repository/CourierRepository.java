package com.shipintel.api.repository;

import com.shipintel.api.entity.Courier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourierRepository extends JpaRepository<Courier, Long> {

    @Query("SELECT DISTINCT c FROM Courier c " +
           "LEFT JOIN FETCH c.coverageAreas " +
           "LEFT JOIN FETCH c.services")
    List<Courier> findAllWithRelations();
}
