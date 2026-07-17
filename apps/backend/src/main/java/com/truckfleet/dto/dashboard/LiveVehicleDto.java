package com.truckfleet.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LiveVehicleDto {
    private String vehicleId;
    private String tripId;
    private String plate;
    private Double lat;
    private Double lng;
    private String route; // "Bologna → Bari"
    private String client;
    private LocalDateTime lastPositionAt;
}
