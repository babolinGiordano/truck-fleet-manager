package com.truckfleet.dto.maintenance;

import com.truckfleet.entity.enums.MaintenanceStatus;
import com.truckfleet.entity.enums.MaintenanceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO di risposta per una manutenzione")
public class MaintenanceRecordResponseDto {

    private String id;
    private String vehicleId;
    private MaintenanceType type;
    private String description;
    private String date;
    private Integer odometer;
    private BigDecimal cost;
    private String workshop;
    private String invoiceNumber;
    private String nextMaintenanceDate;
    private Integer nextMaintenanceKm;
    private MaintenanceStatus status;
    private String notes;
    private String createdAt;
    private String updatedAt;
}
