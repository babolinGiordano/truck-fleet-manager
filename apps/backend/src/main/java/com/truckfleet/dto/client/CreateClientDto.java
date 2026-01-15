package com.truckfleet.dto.client;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "DTO per la creazione di un cliente")
public class CreateClientDto {

    @NotBlank(message = "La ragione sociale e obbligatoria")
    @Schema(example = "Acme S.r.l.", description = "Ragione sociale")
    private String companyName;

    @NotBlank(message = "La partita IVA e obbligatoria")
    @Schema(example = "IT12345678901", description = "Partita IVA")
    private String vatNumber;

    @Schema(example = "12345678901", description = "Codice fiscale")
    private String fiscalCode;

    @NotBlank(message = "L'indirizzo e obbligatorio")
    @Schema(example = "Via Roma 1", description = "Indirizzo")
    private String address;

    @NotBlank(message = "La citta e obbligatoria")
    @Schema(example = "Milano", description = "Citta")
    private String city;

    @NotBlank(message = "La provincia e obbligatoria")
    @Schema(example = "MI", description = "Provincia")
    private String province;

    @NotBlank(message = "Il CAP e obbligatorio")
    @Schema(example = "20100", description = "CAP")
    private String postalCode;

    @Schema(example = "Italia", description = "Paese")
    private String country;

    @NotBlank(message = "Il telefono e obbligatorio")
    @Schema(example = "+39 02 1234567", description = "Telefono")
    private String phone;

    @NotBlank(message = "L'email e obbligatoria")
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
