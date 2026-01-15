package com.truckfleet.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponseDto {
    private List<SearchResultDto> trips;
    private List<SearchResultDto> vehicles;
    private List<SearchResultDto> drivers;
    private List<SearchResultDto> clients;
    private List<SearchResultDto> invoices;
    private int totalResults;
}
