package com.truckfleet.dto.client;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
@Schema(description = "DTO per l'aggiornamento di un cliente")
public class UpdateClientDto {

    @Schema(example = "Acme S.r.l.", description = "Ragione sociale")
    private String companyName;

    @Schema(example = "IT12345678901", description = "Partita IVA")
    private String vatNumber;

    @Schema(example = "12345678901", description = "Codice fiscale")
    private String fiscalCode;

    @Schema(example = "Via Roma 1", description = "Indirizzo")
    private String address;

    @Schema(example = "Milano", description = "Citta")
    private String city;

    @Schema(example = "MI", description = "Provincia")
    private String province;

    @Schema(example = "20100", description = "CAP")
    private String postalCode;

    @Schema(example = "Italia", description = "Paese")
    private String country;

    @Schema(example = "+39 02 1234567", description = "Telefono")
    private String phone;

    @Email(message = "Email non valida")
    @Schema(example = "info@acme.it", description = "Email")
    private String email;

    @Email(message = "PEC non valida")
    @Schema(example = "acme@pec.it", description = "PEC")
    private String pec;

    @Schema(example = "ABC1234", description = "Codice SDI")
    private String sdiCode;

    @Schema(example = "Mario Rossi", description = "Persona di contatto")
    private String contactPerson;

    @Schema(description = "Note")
    private String notes;

    @Schema(description = "Cliente attivo")
    private Boolean isActive;
}
