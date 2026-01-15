package com.truckfleet.dto.maintenance;

import com.truckfleet.entity.enums.MaintenanceStatus;
import com.truckfleet.entity.enums.MaintenanceType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO per l'aggiornamento di una manutenzione")
public class UpdateMaintenanceRecordDto {

    @Schema(description = "ID del veicolo")
    private String vehicleId;

    @Schema(description = "Tipo di manutenzione")
    private MaintenanceType type;

    @Schema(example = "Cambio olio motore e filtri", description = "Descrizione")
    private String description;

    @Schema(example = "2024-01-15T09:00:00", description = "Data manutenzione")
    private String date;

    @Min(value = 0, message = "La lettura contachilometri non puo essere negativa")
    @Schema(example = "150000", description = "Lettura contachilometri")
    private Integer odometer;

    @Min(value = 0, message = "Il costo non puo essere negativo")
    @Schema(example = "350.00", description = "Costo")
    private BigDecimal cost;

    @Schema(example = "Officina Rossi", description = "Nome officina")
    private String workshop;

    @Schema(example = "FT-OFF-2024-001", description = "Numero fattura officina")
    private String invoiceNumber;

    @Schema(example = "2024-07-15T00:00:00", description = "Prossima manutenzione (data)")
    private String nextMaintenanceDate;

    @Schema(example = "165000", description = "Prossima manutenzione (km)")
    private Integer nextMaintenanceKm;

    @Schema(description = "Stato manutenzione")
    private MaintenanceStatus status;

    @Schema(description = "Note")
    private String notes;
}
