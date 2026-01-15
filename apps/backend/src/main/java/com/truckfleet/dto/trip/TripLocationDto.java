package com.truckfleet.dto.trip;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "DTO per la posizione di un viaggio")
public class TripLocationDto {

    @Schema(example = "Magazzino Nord", description = "Nome azienda/luogo")
    private String companyName;

    @NotBlank(message = "L'indirizzo e obbligatorio")
    @Schema(example = "Via Industriale 10", description = "Indirizzo")
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
    private String country = "Italia";

    @Schema(example = "45.4642", description = "Latitudine")
    private Double lat;

    @Schema(example = "9.19", description = "Longitudine")
    private Double lng;
}
