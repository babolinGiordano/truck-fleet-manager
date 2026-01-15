package com.truckfleet.dto.driver;

import com.truckfleet.entity.enums.DriverStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
@Schema(description = "DTO per l'aggiornamento di un autista")
public class UpdateDriverDto {

    @Schema(example = "Mario", description = "Nome")
    private String firstName;

    @Schema(example = "Rossi", description = "Cognome")
    private String lastName;

    @Schema(example = "RSSMRA80A01H501Z", description = "Codice fiscale")
    private String fiscalCode;

    @Schema(example = "+39 333 1234567", description = "Telefono")
    private String phone;

    @Email(message = "Email non valida")
    @Schema(example = "mario.rossi@email.com", description = "Email")
    private String email;

    @Schema(example = "AB1234567", description = "Numero patente")
    private String licenseNumber;

    @Schema(example = "2025-12-31T00:00:00", description = "Scadenza patente")
    private String licenseExpiry;

    @Schema(example = "2025-06-30T00:00:00", description = "Scadenza CQC")
    private String cqcExpiry;

    @Schema(example = "2025-06-30T00:00:00", description = "Scadenza ADR")
    private String adrExpiry;

    @Schema(description = "Stato dell'autista")
    private DriverStatus status;

    @Schema(description = "ID veicolo assegnato")
    private String assignedVehicleId;

    @Schema(example = "2020-01-15T00:00:00", description = "Data assunzione")
    private String hireDate;

    @Schema(description = "Note")
    private String notes;
}
