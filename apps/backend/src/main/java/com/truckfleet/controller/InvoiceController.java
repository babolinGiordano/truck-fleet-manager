package com.truckfleet.controller;

import com.truckfleet.dto.invoice.CreateInvoiceDto;
import com.truckfleet.dto.invoice.InvoiceResponseDto;
import com.truckfleet.dto.invoice.UpdateInvoiceDto;
import com.truckfleet.service.InvoiceService;
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
@RequestMapping("/invoices")
@RequiredArgsConstructor
@Tag(name = "invoices", description = "Gestione fatture")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    @Operation(summary = "Ottieni tutte le fatture")
    @ApiResponse(responseCode = "200", description = "Lista di tutte le fatture")
    public ResponseEntity<List<InvoiceResponseDto>> findAll() {
        return ResponseEntity.ok(invoiceService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Ottieni una fattura per ID")
    @ApiResponse(responseCode = "200", description = "Fattura trovata")
    @ApiResponse(responseCode = "404", description = "Fattura non trovata")
    public ResponseEntity<InvoiceResponseDto> findById(
            @Parameter(description = "ID della fattura") @PathVariable String id) {
        return ResponseEntity.ok(invoiceService.findById(id));
    }

    @PostMapping
    @Operation(summary = "Crea una nuova fattura")
    @ApiResponse(responseCode = "201", description = "Fattura creata con successo")
    @ApiResponse(responseCode = "400", description = "Dati non validi")
    public ResponseEntity<InvoiceResponseDto> create(
            @Valid @RequestBody CreateInvoiceDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(invoiceService.create(dto));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Aggiorna una fattura")
    @ApiResponse(responseCode = "200", description = "Fattura aggiornata")
    @ApiResponse(responseCode = "404", description = "Fattura non trovata")
    public ResponseEntity<InvoiceResponseDto> update(
            @Parameter(description = "ID della fattura") @PathVariable String id,
            @Valid @RequestBody UpdateInvoiceDto dto) {
        return ResponseEntity.ok(invoiceService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Elimina una fattura")
    @ApiResponse(responseCode = "204", description = "Fattura eliminata")
    @ApiResponse(responseCode = "404", description = "Fattura non trovata")
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID della fattura") @PathVariable String id) {
        invoiceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
