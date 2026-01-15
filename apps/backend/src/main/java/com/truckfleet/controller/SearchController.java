package com.truckfleet.controller;

import com.truckfleet.dto.search.SearchResponseDto;
import com.truckfleet.service.SearchService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Global search across all entities")
public class SearchController {

    private final SearchService searchService;

    @GetMapping
    @Operation(summary = "Global search", description = "Search across trips, vehicles, drivers, clients, and invoices")
    public ResponseEntity<SearchResponseDto> search(
            @Parameter(description = "Search query (minimum 2 characters)")
            @RequestParam String q) {
        return ResponseEntity.ok(searchService.search(q));
    }
}
