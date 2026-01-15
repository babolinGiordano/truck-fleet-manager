package com.truckfleet.dto.invoice;

import com.truckfleet.entity.enums.InvoiceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Schema(description = "DTO di risposta per una fattura")
public class InvoiceResponseDto {

    private String id;
    private String invoiceNumber;
    private String clientId;
    private String issueDate;
    private String dueDate;
    private InvoiceStatus status;
    private List<InvoiceItemDto> items;
    private BigDecimal subtotal;
    private BigDecimal vatRate;
    private BigDecimal vatAmount;
    private BigDecimal total;
    private String notes;
    private String paidDate;
    private String createdAt;
    private String updatedAt;
}
