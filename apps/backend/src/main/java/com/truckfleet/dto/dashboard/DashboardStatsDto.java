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
public class DashboardStatsDto {
    private Long tripsToday;
    private Long vehiclesInTransit;
    private Long kmThisMonth;
    private BigDecimal revenueThisMonth;

    // Trend percentages (compared to previous month)
    private Double tripsTrend;
    private Double kmTrend;
    private Double revenueTrend;
}
