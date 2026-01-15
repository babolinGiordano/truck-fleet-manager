package com.truckfleet.dto.trip;

import com.truckfleet.entity.enums.TripStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO per l'aggiornamento di un viaggio")
public class UpdateTripDto {

    @Schema(example = "VGG-2024-001", description = "Numero viaggio")
    private String tripNumber;

    @Schema(description = "ID del veicolo")
    private String vehicleId;

    @Schema(description = "ID dell'autista")
    private String driverId;

    @Schema(description = "ID del cliente")
    private String clientId;

    @Valid
    @Schema(description = "Luogo di partenza")
    private TripLocationDto origin;

    @Valid
    @Schema(description = "Luogo di arrivo")
    private TripLocationDto destination;

    @Valid
    @Schema(description = "Informazioni sul carico")
    private CargoInfoDto cargo;

    @Schema(description = "Stato del viaggio")
    private TripStatus status;

    @Schema(example = "2024-01-15T08:00:00", description = "Data/ora partenza pianificata")
    private String plannedDeparture;

    @Schema(example = "2024-01-15T08:30:00", description = "Data/ora partenza effettiva")
    private String actualDeparture;

    @Schema(example = "2024-01-15T18:00:00", description = "Data/ora arrivo pianificato")
    private String plannedArrival;

    @Schema(example = "2024-01-15T17:30:00", description = "Data/ora arrivo effettivo")
    private String actualArrival;

    @Min(value = 0, message = "I km pianificati non possono essere negativi")
    @Schema(example = "450", description = "Km pianificati")
    private Integer kmPlanned;

    @Schema(example = "445", description = "Km effettivi")
    private Integer kmActual;

    @Min(value = 0, message = "Il prezzo non puo essere negativo")
    @Schema(example = "1500.00", description = "Prezzo del trasporto")
    private BigDecimal price;

    @Schema(description = "Note")
    private String notes;
}
