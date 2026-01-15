package com.truckfleet.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentTripDto {
    private String id;
    private String route;
    private String client;
    private String vehicle;
    private String status;
    private BigDecimal price;
    private Integer km;
}
