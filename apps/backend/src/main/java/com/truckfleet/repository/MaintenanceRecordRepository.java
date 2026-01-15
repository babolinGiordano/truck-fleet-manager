package com.truckfleet.repository;

import com.truckfleet.entity.MaintenanceRecord;
import com.truckfleet.entity.enums.MaintenanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, String> {
    List<MaintenanceRecord> findAllByOrderByCreatedAtDesc();
    List<MaintenanceRecord> findByVehicleId(String vehicleId);

    // Dashboard queries
    @Query("SELECT m FROM MaintenanceRecord m LEFT JOIN FETCH m.vehicle WHERE m.status = :status AND m.nextMaintenanceDate <= :deadline")
    List<MaintenanceRecord> findScheduledMaintenance(@Param("status") MaintenanceStatus status, @Param("deadline") LocalDateTime deadline);
}
