package com.truckfleet.controller;

import com.truckfleet.dto.trip.CreateTripDto;
import com.truckfleet.dto.trip.TripResponseDto;
import com.truckfleet.dto.trip.UpdateTripDto;
import com.truckfleet.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
@Tag(name = "trips", description = "Gestione viaggi")
public class TripController {

    private final TripService tripService;

    @GetMapping
    @Operation(summary = "Ottieni tutti i viaggi")
    @ApiResponse(responseCode = "200", description = "Lista di tutti i viaggi")
    public ResponseEntity<List<TripResponseDto>> findAll() {
        return ResponseEntity.ok(tripService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ottieni un viaggio per ID")
    @ApiResponse(responseCode = "200", description = "Viaggio trovato")
    @ApiResponse(responseCode = "404", description = "Viaggio non trovato")
    public ResponseEntity<TripResponseDto> findById(
            @Parameter(description = "ID del viaggio") @PathVariable String id) {
        return ResponseEntity.ok(tripService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crea un nuovo viaggio")
    @ApiResponse(responseCode = "201", description = "Viaggio creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi")
    public ResponseEntity<TripResponseDto> create(
            @Valid @RequestBody CreateTripDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tripService.create(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Aggiorna un viaggio")
    @ApiResponse(responseCode = "200", description = "Viaggio aggiornato")
    @ApiResponse(responseCode = "404", description = "Viaggio non trovato")
    public ResponseEntity<TripResponseDto> update(
            @Parameter(description = "ID del viaggio") @PathVariable String id,
            @Valid @RequestBody UpdateTripDto dto) {
        return ResponseEntity.ok(tripService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina un viaggio")
    @ApiResponse(responseCode = "204", description = "Viaggio eliminato")
    @ApiResponse(responseCode = "404", description = "Viaggio non trovato")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID del viaggio") @PathVariable String id) {
        tripService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
