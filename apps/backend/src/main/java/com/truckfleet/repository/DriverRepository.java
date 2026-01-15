package com.truckfleet.repository;

import com.truckfleet.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, String> {
    Optional<Driver> findByFiscalCode(String fiscalCode);
    List<Driver> findAllByOrderByCreatedAtDesc();
    boolean existsByFiscalCode(String fiscalCode);
}
