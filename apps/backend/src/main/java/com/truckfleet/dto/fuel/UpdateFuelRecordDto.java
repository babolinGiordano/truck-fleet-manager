package com.truckfleet.dto.fuel;

import com.truckfleet.entity.enums.FuelType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO per l'aggiornamento di un rifornimento")
public class UpdateFuelRecordDto {

    @Schema(description = "ID del veicolo")
    private String vehicleId;

    @Schema(description = "ID dell'autista")
    private String driverId;

    @Schema(example = "2024-01-15T10:30:00", description = "Data rifornimento")
    private String date;

    @Min(value = 0, message = "I litri non possono essere negativi")
    @Schema(example = "150.50", description = "Litri riforniti")
    private BigDecimal liters;

    @Min(value = 0, message = "Il prezzo al litro non puo essere negativo")
    @Schema(example = "1.759", description = "Prezzo al litro")
    private BigDecimal pricePerLiter;

    @Min(value = 0, message = "Il costo totale non puo essere negativo")
    @Schema(example = "264.73", description = "Costo totale")
    private BigDecimal totalCost;

    @Schema(description = "Tipo di carburante")
    private FuelType fuelType;

    @Schema(example = "Eni Station Milano", description = "Nome stazione")
    private String stationName;

    @Min(value = 0, message = "La lettura contachilometri non puo essere negativa")
    @Schema(example = "150000", description = "Lettura contachilometri")
    private Integer odometer;

    @Schema(example = "true", description = "Serbatoio pieno")
    private Boolean fullTank;

    @Schema(description = "Note")
    private String notes;
}
