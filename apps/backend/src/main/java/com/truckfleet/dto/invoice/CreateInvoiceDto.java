package com.truckfleet.dto.invoice;

import com.truckfleet.entity.enums.InvoiceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(description = "DTO per la creazione di una fattura")
public class CreateInvoiceDto {

    @NotBlank(message = "Il numero fattura e obbligatorio")
    @Schema(example = "FT-2024-001", description = "Numero fattura")
    private String invoiceNumber;

    @NotBlank(message = "L'ID cliente e obbligatorio")
    @Schema(description = "ID del cliente")
    private String clientId;

    @NotBlank(message = "La data emissione e obbligatoria")
    @Schema(example = "2024-01-15T00:00:00", description = "Data emissione")
    private String issueDate;

    @NotBlank(message = "La data scadenza e obbligatoria")
    @Schema(example = "2024-02-15T00:00:00", description = "Data scadenza")
    private String dueDate;

    @Schema(description = "Stato della fattura")
    private InvoiceStatus status;

    @NotNull(message = "Le voci fattura sono obbligatorie")
    @Valid
    @Schema(description = "Voci della fattura")
    private List<InvoiceItemDto> items;

    @NotNull(message = "Il subtotale e obbligatorio")
    @Min(value = 0, message = "Il subtotale non puo essere negativo")
    @Schema(example = "1000.00", description = "Subtotale")
    private BigDecimal subtotal;

    @Schema(example = "22", description = "Aliquota IVA")
    private BigDecimal vatRate;

    @NotNull(message = "L'importo IVA e obbligatorio")
    @Min(value = 0, message = "L'importo IVA non puo essere negativo")
    @Schema(example = "220.00", description = "Importo IVA")
    private BigDecimal vatAmount;

    @NotNull(message = "Il totale e obbligatorio")
    @Min(value = 0, message = "Il totale non puo essere negativo")
    @Schema(example = "1220.00", description = "Totale fattura")
    private BigDecimal total;

    @Schema(description = "Note")
    private String notes;

    @Schema(example = "2024-01-20T00:00:00", description = "Data pagamento")
    private String paidDate;
}
