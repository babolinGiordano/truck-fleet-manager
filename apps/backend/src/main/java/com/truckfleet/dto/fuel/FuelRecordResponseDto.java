package com.truckfleet.dto.fuel;

import com.truckfleet.entity.enums.FuelType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO di risposta per un rifornimento")
public class FuelRecordResponseDto {

    private String id;
    private String vehicleId;
    private String driverId;
    private String date;
    private BigDecimal liters;
    private BigDecimal pricePerLiter;
    private BigDecimal totalCost;
    private FuelType fuelType;
    private String stationName;
    private Integer odometer;
    private Boolean fullTank;
    private String notes;
    private String createdAt;
    private String updatedAt;
}
