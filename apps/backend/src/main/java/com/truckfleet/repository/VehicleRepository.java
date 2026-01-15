package com.truckfleet.repository;

import com.truckfleet.entity.Vehicle;
import com.truckfleet.entity.enums.VehicleStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Optional<Vehicle> findByPlate(String plate);
    List<Vehicle> findAllByOrderByCreatedAtDesc();
    boolean existsByPlate(String plate);

    // Dashboard queries
    @Query("SELECT COUNT(v) FROM Vehicle v WHERE v.status = :status")
    Long countByStatus(@Param("status") VehicleStatus status);

    @Query("SELECT v FROM Vehicle v WHERE v.insuranceExpiry <= :deadline OR v.revisionExpiry <= :deadline")
    List<Vehicle> findWithExpiringDocuments(@Param("deadline") LocalDateTime deadline);

    // Search query
    @Query("SELECT v FROM Vehicle v WHERE " +
           "LOWER(v.plate) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(v.model) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Vehicle> search(@Param("query") String query, Pageable pageable);
}
