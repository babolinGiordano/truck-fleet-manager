package com.truckfleet.dto.invoice;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO per una voce di fattura")
public class InvoiceItemDto {

    private String id;

    @NotBlank(message = "La descrizione e obbligatoria")
    @Schema(example = "Trasporto Milano-Roma", description = "Descrizione della voce")
    private String description;

    @Min(value = 1, message = "La quantita deve essere almeno 1")
    @Schema(example = "1", description = "Quantita")
    private Integer quantity = 1;

    @NotNull(message = "Il prezzo unitario e obbligatorio")
    @Min(value = 0, message = "Il prezzo unitario non puo essere negativo")
    @Schema(example = "1000.00", description = "Prezzo unitario")
    private BigDecimal unitPrice;

    @NotNull(message = "Il prezzo totale e obbligatorio")
    @Min(value = 0, message = "Il prezzo totale non puo essere negativo")
    @Schema(example = "1000.00", description = "Prezzo totale")
    private BigDecimal totalPrice;

    @Schema(description = "ID del viaggio collegato")
    private String tripId;
}
