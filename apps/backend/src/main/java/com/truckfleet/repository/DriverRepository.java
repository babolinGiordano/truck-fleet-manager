package com.truckfleet.repository;

import com.truckfleet.entity.Driver;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {
    Optional<Driver> findByFiscalCode(String fiscalCode);
    List<Driver> findAllByOrderByCreatedAtDesc();
    boolean existsByFiscalCode(String fiscalCode);

    // Dashboard queries
    @Query("SELECT d FROM Driver d WHERE d.licenseExpiry <= :deadline OR d.cqcExpiry <= :deadline OR d.adrExpiry <= :deadline")
    List<Driver> findWithExpiringDocuments(@Param("deadline") LocalDateTime deadline);

    // Search query
    @Query("SELECT d FROM Driver d WHERE " +
           "LOWER(d.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(CONCAT(d.firstName, ' ', d.lastName)) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Driver> search(@Param("query") String query, Pageable pageable);
}
