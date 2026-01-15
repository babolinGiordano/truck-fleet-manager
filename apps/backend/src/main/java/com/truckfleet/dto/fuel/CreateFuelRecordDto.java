package com.truckfleet.dto.fuel;

import com.truckfleet.entity.enums.FuelType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO per la creazione di un rifornimento")
public class CreateFuelRecordDto {

    @NotBlank(message = "L'ID veicolo e obbligatorio")
    @Schema(description = "ID del veicolo")
    private String vehicleId;

    @Schema(description = "ID dell'autista")
    private String driverId;

    @NotBlank(message = "La data e obbligatoria")
    @Schema(example = "2024-01-15T10:30:00", description = "Data rifornimento")
    private String date;

    @NotNull(message = "I litri sono obbligatori")
    @Min(value = 0, message = "I litri non possono essere negativi")
    @Schema(example = "150.50", description = "Litri riforniti")
    private BigDecimal liters;

    @NotNull(message = "Il prezzo al litro e obbligatorio")
    @Min(value = 0, message = "Il prezzo al litro non puo essere negativo")
    @Schema(example = "1.759", description = "Prezzo al litro")
    private BigDecimal pricePerLiter;

    @NotNull(message = "Il costo totale e obbligatorio")
    @Min(value = 0, message = "Il costo totale non puo essere negativo")
    @Schema(example = "264.73", description = "Costo totale")
    private BigDecimal totalCost;

    @Schema(description = "Tipo di carburante")
    private FuelType fuelType;

    @Schema(example = "Eni Station Milano", description = "Nome stazione")
    private String stationName;

    @NotNull(message = "La lettura contachilometri e obbligatoria")
    @Min(value = 0, message = "La lettura contachilometri non puo essere negativa")
    @Schema(example = "150000", description = "Lettura contachilometri")
    private Integer odometer;

    @Schema(example = "true", description = "Serbatoio pieno")
    private Boolean fullTank;

    @Schema(description = "Note")
    private String notes;
}
