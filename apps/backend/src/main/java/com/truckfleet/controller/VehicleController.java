package com.truckfleet.controller;

import com.truckfleet.dto.vehicle.CreateVehicleDto;
import com.truckfleet.dto.vehicle.UpdateVehicleDto;
import com.truckfleet.dto.vehicle.VehicleResponseDto;
import com.truckfleet.service.VehicleService;
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
@RequestMapping("/vehicles")
@RequiredArgsConstructor
@Tag(name = "vehicles", description = "Gestione veicoli")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    @Operation(summary = "Ottieni tutti i veicoli")
    @ApiResponse(responseCode = "200", description = "Lista di tutti i veicoli")
    public ResponseEntity<List<VehicleResponseDto>> findAll() {
        return ResponseEntity.ok(vehicleService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ottieni un veicolo per ID")
    @ApiResponse(responseCode = "200", description = "Veicolo trovato")
    @ApiResponse(responseCode = "404", description = "Veicolo non trovato")
    public ResponseEntity<VehicleResponseDto> findById(
            @Parameter(description = "ID del veicolo") @PathVariable String id) {
        return ResponseEntity.ok(vehicleService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crea un nuovo veicolo")
    @ApiResponse(responseCode = "201", description = "Veicolo creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi")
    public ResponseEntity<VehicleResponseDto> create(
            @Valid @RequestBody CreateVehicleDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vehicleService.create(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Aggiorna un veicolo")
    @ApiResponse(responseCode = "200", description = "Veicolo aggiornato")
    @ApiResponse(responseCode = "404", description = "Veicolo non trovato")
    public ResponseEntity<VehicleResponseDto> update(
            @Parameter(description = "ID del veicolo") @PathVariable String id,
            @Valid @RequestBody UpdateVehicleDto dto) {
        return ResponseEntity.ok(vehicleService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina un veicolo")
    @ApiResponse(responseCode = "204", description = "Veicolo eliminato")
    @ApiResponse(responseCode = "404", description = "Veicolo non trovato")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID del veicolo") @PathVariable String id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
