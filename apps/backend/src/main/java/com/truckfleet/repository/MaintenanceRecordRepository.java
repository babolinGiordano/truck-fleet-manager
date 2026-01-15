package com.truckfleet.repository;

import com.truckfleet.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, String> {
    List<MaintenanceRecord> findAllByOrderByCreatedAtDesc();
    List<MaintenanceRecord> findByVehicleId(String vehicleId);
}
