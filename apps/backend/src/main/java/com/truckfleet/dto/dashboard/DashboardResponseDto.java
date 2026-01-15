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
}
