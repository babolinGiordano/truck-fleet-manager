package com.truckfleet.dto.vehicle;

import com.truckfleet.entity.enums.VehicleStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
@Schema(description = "DTO per la creazione di un veicolo")
public class CreateVehicleDto {

    @NotBlank(message = "La targa e obbligatoria")
    @Schema(example = "AB123CD", description = "Targa del veicolo")
    private String plate;

    @NotBlank(message = "La marca e obbligatoria")
    @Schema(example = "Iveco", description = "Marca del veicolo")
    private String brand;

    @NotBlank(message = "Il modello e obbligatorio")
    @Schema(example = "Stralis", description = "Modello del veicolo")
    private String model;

    @NotNull(message = "L'anno e obbligatorio")
    @Min(value = 1990, message = "L'anno deve essere almeno 1990")
    @Schema(example = "2021", description = "Anno di immatricolazione")
    private Integer year;

    @Schema(description = "Stato del veicolo")
    private VehicleStatus status;

    @Schema(description = "ID autista assegnato")
    private String currentDriverId;

    @Schema(example = "45.4642", description = "Latitudine ultima posizione")
    private Double lastLat;

    @Schema(example = "9.19", description = "Longitudine ultima posizione")
    private Double lastLng;

    @NotNull(message = "I km totali sono obbligatori")
    @Min(value = 0, message = "I km totali non possono essere negativi")
    @Schema(example = "150000", description = "Chilometri totali")
    private Integer kmTotal;

    @NotBlank(message = "La scadenza assicurazione e obbligatoria")
    @Schema(example = "2025-12-31T00:00:00", description = "Scadenza assicurazione")
    private String insuranceExpiry;

    @NotBlank(message = "La scadenza revisione e obbligatoria")
    @Schema(example = "2025-06-30T00:00:00", description = "Scadenza revisione")
    private String revisionExpiry;

    @Schema(description = "Note aggiuntive")
    private String notes;
}
