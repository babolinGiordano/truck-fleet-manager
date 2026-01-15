package com.truckfleet.controller;

import com.truckfleet.dto.driver.CreateDriverDto;
import com.truckfleet.dto.driver.DriverResponseDto;
import com.truckfleet.dto.driver.UpdateDriverDto;
import com.truckfleet.service.DriverService;
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
@RequestMapping("/drivers")
@RequiredArgsConstructor
@Tag(name = "drivers", description = "Gestione autisti")
public class DriverController {

    private final DriverService driverService;

    @GetMapping
    @Operation(summary = "Ottieni tutti gli autisti")
    @ApiResponse(responseCode = "200", description = "Lista di tutti gli autisti")
    public ResponseEntity<List<DriverResponseDto>> findAll() {
        return ResponseEntity.ok(driverService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ottieni un autista per ID")
    @ApiResponse(responseCode = "200", description = "Autista trovato")
    @ApiResponse(responseCode = "404", description = "Autista non trovato")
    public ResponseEntity<DriverResponseDto> findById(
            @Parameter(description = "ID dell'autista") @PathVariable String id) {
        return ResponseEntity.ok(driverService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crea un nuovo autista")
    @ApiResponse(responseCode = "201", description = "Autista creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi")
    public ResponseEntity<DriverResponseDto> create(
            @Valid @RequestBody CreateDriverDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(driverService.create(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Aggiorna un autista")
    @ApiResponse(responseCode = "200", description = "Autista aggiornato")
    @ApiResponse(responseCode = "404", description = "Autista non trovato")
    public ResponseEntity<DriverResponseDto> update(
            @Parameter(description = "ID dell'autista") @PathVariable String id,
            @Valid @RequestBody UpdateDriverDto dto) {
        return ResponseEntity.ok(driverService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina un autista")
    @ApiResponse(responseCode = "204", description = "Autista eliminato")
    @ApiResponse(responseCode = "404", description = "Autista non trovato")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID dell'autista") @PathVariable String id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
