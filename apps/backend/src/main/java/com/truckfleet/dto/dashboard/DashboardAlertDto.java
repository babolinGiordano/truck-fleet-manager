package com.truckfleet.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAlertDto {
    private String id;
    private String type; // danger, warning, info
    private String icon;
    private String title;
    private String description;
    private String link; // Navigation link (e.g., /drivers/123, /vehicles/456)
}
