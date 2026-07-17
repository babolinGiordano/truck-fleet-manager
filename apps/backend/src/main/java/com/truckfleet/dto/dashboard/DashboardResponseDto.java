package com.truckfleet.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponseDto {
    private DashboardStatsDto stats;
    private List<DashboardAlertDto> alerts;
    private List<RecentTripDto> recentTrips;
    private List<MonthlyTripDataDto> chartData;
    private Integer chartYear; // Year the chart data refers to
    private List<Integer> availableYears; // Years that actually have trips, newest first
    private List<LiveVehicleDto> liveVehicles; // Vehicles currently on the road, with position
}
