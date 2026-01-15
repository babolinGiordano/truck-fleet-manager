package com.truckfleet.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResultDto {
    private String id;
    private String type; // trip, vehicle, driver, client, invoice
    private String title;
    private String subtitle;
    private String icon;
    private String link;
}
