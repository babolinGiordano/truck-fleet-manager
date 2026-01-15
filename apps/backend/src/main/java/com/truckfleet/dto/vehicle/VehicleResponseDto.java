package com.truckfleet.dto.vehicle;

import com.truckfleet.entity.enums.VehicleStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO di risposta per un veicolo")
public class VehicleResponseDto {

    private String id;
    private String plate;
    private String brand;
    private String model;
    private Integer year;
    private VehicleStatus status;
    private String currentDriverId;
    private Double lastLat;
    private Double lastLng;
    private String lastPositionAt;
    private Integer kmTotal;
    private String insuranceExpiry;
    private String revisionExpiry;
    private String notes;
    private String createdAt;
    private String updatedAt;
}
