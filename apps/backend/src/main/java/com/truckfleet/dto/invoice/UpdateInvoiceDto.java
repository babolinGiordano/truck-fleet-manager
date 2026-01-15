package com.truckfleet.dto.invoice;

import com.truckfleet.entity.enums.InvoiceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(description = "DTO per l'aggiornamento di una fattura")
public class UpdateInvoiceDto {

    @Schema(example = "FT-2024-001", description = "Numero fattura")
    private String invoiceNumber;

    @Schema(description = "ID del cliente")
    private String clientId;

    @Schema(example = "2024-01-15T00:00:00", description = "Data emissione")
    private String issueDate;

    @Schema(example = "2024-02-15T00:00:00", description = "Data scadenza")
    private String dueDate;

    @Schema(description = "Stato della fattura")
    private InvoiceStatus status;

    @Valid
    @Schema(description = "Voci della fattura")
    private List<InvoiceItemDto> items;

    @Min(value = 0, message = "Il subtotale non puo essere negativo")
    @Schema(example = "1000.00", description = "Subtotale")
    private BigDecimal subtotal;

    @Schema(example = "22", description = "Aliquota IVA")
    private BigDecimal vatRate;

    @Min(value = 0, message = "L'importo IVA non puo essere negativo")
    @Schema(example = "220.00", description = "Importo IVA")
    private BigDecimal vatAmount;

    @Min(value = 0, message = "Il totale non puo essere negativo")
    @Schema(example = "1220.00", description = "Totale fattura")
    private BigDecimal total;

    @Schema(description = "Note")
    private String notes;

    @Schema(example = "2024-01-20T00:00:00", description = "Data pagamento")
    private String paidDate;
}
