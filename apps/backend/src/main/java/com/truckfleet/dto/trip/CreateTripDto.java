package com.truckfleet.dto.trip;

import com.truckfleet.entity.enums.TripStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Schema(description = "DTO per la creazione di un viaggio")
public class CreateTripDto {

    @NotBlank(message = "Il numero viaggio e obbligatorio")
    @Schema(example = "VGG-2024-001", description = "Numero viaggio")
    private String tripNumber;

    @NotBlank(message = "L'ID veicolo e obbligatorio")
    @Schema(description = "ID del veicolo")
    private String vehicleId;

    @NotBlank(message = "L'ID autista e obbligatorio")
    @Schema(description = "ID dell'autista")
    private String driverId;

    @NotBlank(message = "L'ID cliente e obbligatorio")
    @Schema(description = "ID del cliente")
    private String clientId;

    @NotNull(message = "L'origine e obbligatoria")
    @Valid
    @Schema(description = "Luogo di partenza")
    private TripLocationDto origin;

    @NotNull(message = "La destinazione e obbligatoria")
    @Valid
    @Schema(description = "Luogo di arrivo")
    private TripLocationDto destination;

    @NotNull(message = "Le informazioni sul carico sono obbligatorie")
    @Valid
    @Schema(description = "Informazioni sul carico")
    private CargoInfoDto cargo;

    @Schema(description = "Stato del viaggio")
    private TripStatus status;

    @NotBlank(message = "La partenza pianificata e obbligatoria")
    @Schema(example = "2024-01-15T08:00:00", description = "Data/ora partenza pianificata")
    private String plannedDeparture;

    @Schema(example = "2024-01-15T08:30:00", description = "Data/ora partenza effettiva")
    private String actualDeparture;

    @NotBlank(message = "L'arrivo pianificato e obbligatorio")
    @Schema(example = "2024-01-15T18:00:00", description = "Data/ora arrivo pianificato")
    private String plannedArrival;

    @Schema(example = "2024-01-15T17:30:00", description = "Data/ora arrivo effettivo")
    private String actualArrival;

    @NotNull(message = "I km pianificati sono obbligatori")
    @Min(value = 0, message = "I km pianificati non possono essere negativi")
    @Schema(example = "450", description = "Km pianificati")
    private Integer kmPlanned;

    @Schema(example = "445", description = "Km effettivi")
    private Integer kmActual;

    @NotNull(message = "Il prezzo e obbligatorio")
    @Min(value = 0, message = "Il prezzo non puo essere negativo")
    @Schema(example = "1500.00", description = "Prezzo del trasporto")
    private BigDecimal price;

    @Schema(description = "Note")
    private String notes;
}
