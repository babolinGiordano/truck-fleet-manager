package com.truckfleet.controller;

import com.truckfleet.dto.client.ClientResponseDto;
import com.truckfleet.dto.client.CreateClientDto;
import com.truckfleet.dto.client.UpdateClientDto;
import com.truckfleet.service.ClientService;
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
@RequestMapping("/clients")
@RequiredArgsConstructor
@Tag(name = "clients", description = "Gestione clienti")
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    @Operation(summary = "Ottieni tutti i clienti")
    @ApiResponse(responseCode = "200", description = "Lista di tutti i clienti")
    public ResponseEntity<List<ClientResponseDto>> findAll() {
        return ResponseEntity.ok(clientService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ottieni un cliente per ID")
    @ApiResponse(responseCode = "200", description = "Cliente trovato")
    @ApiResponse(responseCode = "404", description = "Cliente non trovato")
    public ResponseEntity<ClientResponseDto> findById(
            @Parameter(description = "ID del cliente") @PathVariable String id) {
        return ResponseEntity.ok(clientService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crea un nuovo cliente")
    @ApiResponse(responseCode = "201", description = "Cliente creato con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi")
    public ResponseEntity<ClientResponseDto> create(
            @Valid @RequestBody CreateClientDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientService.create(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Aggiorna un cliente")
    @ApiResponse(responseCode = "200", description = "Cliente aggiornato")
    @ApiResponse(responseCode = "404", description = "Cliente non trovato")
    public ResponseEntity<ClientResponseDto> update(
            @Parameter(description = "ID del cliente") @PathVariable String id,
            @Valid @RequestBody UpdateClientDto dto) {
        return ResponseEntity.ok(clientService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina un cliente")
    @ApiResponse(responseCode = "204", description = "Cliente eliminato")
    @ApiResponse(responseCode = "404", description = "Cliente non trovato")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID del cliente") @PathVariable String id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
