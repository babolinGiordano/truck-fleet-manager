package com.truckfleet.repository;

import com.truckfleet.entity.FuelRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FuelRecordRepository extends JpaRepository<FuelRecord, String> {
    List<FuelRecord> findAllByOrderByCreatedAtDesc();
    List<FuelRecord> findByVehicleId(String vehicleId);
    List<FuelRecord> findByDriverId(String driverId);
}
