package com.truckfleet.dto.driver;

import com.truckfleet.entity.enums.DriverStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO di risposta per un autista")
public class DriverResponseDto {

    private String id;
    private String firstName;
    private String lastName;
    private String fiscalCode;
    private String phone;
    private String email;
    private String licenseNumber;
    private String licenseExpiry;
    private String cqcExpiry;
    private String adrExpiry;
    private DriverStatus status;
    private String assignedVehicleId;
    private String hireDate;
    private String notes;
    private String createdAt;
    private String updatedAt;
}
