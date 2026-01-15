package com.truckfleet.controller;

import com.truckfleet.dto.maintenance.CreateMaintenanceRecordDto;
import com.truckfleet.dto.maintenance.MaintenanceRecordResponseDto;
import com.truckfleet.dto.maintenance.UpdateMaintenanceRecordDto;
import com.truckfleet.service.MaintenanceRecordService;
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
@RequestMapping("/maintenance")
@RequiredArgsConstructor
@Tag(name = "maintenance", description = "Gestione manutenzioni")
public class MaintenanceRecordController {

    private final MaintenanceRecordService maintenanceRecordService;

    @GetMapping
    @Operation(summary = "Ottieni tutte le manutenzioni")
    @ApiResponse(responseCode = "200", description = "Lista di tutte le manutenzioni")
    public ResponseEntity<List<MaintenanceRecordResponseDto>> findAll() {
        return ResponseEntity.ok(maintenanceRecordService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ottieni una manutenzione per ID")
    @ApiResponse(responseCode = "200", description = "Manutenzione trovata")
    @ApiResponse(responseCode = "404", description = "Manutenzione non trovata")
    public ResponseEntity<MaintenanceRecordResponseDto> findById(
            @Parameter(description = "ID della manutenzione") @PathVariable String id) {
        return ResponseEntity.ok(maintenanceRecordService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crea una nuova manutenzione")
    @ApiResponse(responseCode = "201", description = "Manutenzione creata con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi")
    public ResponseEntity<MaintenanceRecordResponseDto> create(
            @Valid @RequestBody CreateMaintenanceRecordDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(maintenanceRecordService.create(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Aggiorna una manutenzione")
    @ApiResponse(responseCode = "200", description = "Manutenzione aggiornata")
    @ApiResponse(responseCode = "404", description = "Manutenzione non trovata")
    public ResponseEntity<MaintenanceRecordResponseDto> update(
            @Parameter(description = "ID della manutenzione") @PathVariable String id,
            @Valid @RequestBody UpdateMaintenanceRecordDto dto) {
        return ResponseEntity.ok(maintenanceRecordService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina una manutenzione")
    @ApiResponse(responseCode = "204", description = "Manutenzione eliminata")
    @ApiResponse(responseCode = "404", description = "Manutenzione non trovata")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID della manutenzione") @PathVariable String id) {
        maintenanceRecordService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
