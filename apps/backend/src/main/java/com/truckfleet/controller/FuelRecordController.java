package com.truckfleet.controller;

import com.truckfleet.dto.fuel.CreateFuelRecordDto;
import com.truckfleet.dto.fuel.FuelRecordResponseDto;
import com.truckfleet.dto.fuel.UpdateFuelRecordDto;
import com.truckfleet.service.FuelRecordService;
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
@RequestMapping("/fuel")
@RequiredArgsConstructor
@Tag(name = "fuel", description = "Gestione rifornimenti")
public class FuelRecordController {

    private final FuelRecordService fuelRecordService;

    @GetMapping
    @Operation(summary = "Ottieni tutti i rifornimenti")
    @ApiResponse(responseCode = "200", description = "Lista di tutti i rifornimenti")
    public ResponseEntity<List<FuelRecordResponseDto>> findAll() {
        return ResponseEntity.ok(fuelRecordService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ottieni un rifornimento per ID")
    @ApiResponse(responseCode = "200", description = "Rifornimento trovato")
    @ApiResponse(responseCode = "404", description = "Rifornimento non trovato")
    public ResponseEntity<FuelRecordResponseDto> findById(
            @Parameter(description = "ID del rifornimento") @PathVariable String id) {
        return ResponseEntity.ok(fuelRecordService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crea un nuovo rifornimento")
    @ApiResponse(responseCode = "201", description = "Rifornimento creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi")
    public ResponseEntity<FuelRecordResponseDto> create(
            @Valid @RequestBody CreateFuelRecordDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(fuelRecordService.create(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Aggiorna un rifornimento")
    @ApiResponse(responseCode = "200", description = "Rifornimento aggiornato")
    @ApiResponse(responseCode = "404", description = "Rifornimento non trovato")
    public ResponseEntity<FuelRecordResponseDto> update(
            @Parameter(description = "ID del rifornimento") @PathVariable String id,
            @Valid @RequestBody UpdateFuelRecordDto dto) {
        return ResponseEntity.ok(fuelRecordService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina un rifornimento")
    @ApiResponse(responseCode = "204", description = "Rifornimento eliminato")
    @ApiResponse(responseCode = "404", description = "Rifornimento non trovato")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID del rifornimento") @PathVariable String id) {
        fuelRecordService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
