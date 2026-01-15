package com.truckfleet.dto.trip;

import com.truckfleet.entity.enums.TripStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO di risposta per un viaggio")
public class TripResponseDto {

    private String id;
    private String tripNumber;
    private String vehicleId;
    private String driverId;
    private String clientId;
    private TripLocationDto origin;
    private TripLocationDto destination;
    private CargoInfoDto cargo;
    private TripStatus status;
    private String plannedDeparture;
    private String actualDeparture;
    private String plannedArrival;
    private String actualArrival;
    private Integer kmPlanned;
    private Integer kmActual;
    private BigDecimal price;
    private String notes;
    private String createdAt;
    private String updatedAt;
}
