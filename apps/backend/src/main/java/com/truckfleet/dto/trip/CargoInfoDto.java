package com.truckfleet.dto.trip;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "DTO per le informazioni sul carico")
public class CargoInfoDto {

    @NotBlank(message = "La descrizione del carico e obbligatoria")
    @Schema(example = "Materiale edile", description = "Descrizione del carico")
    private String description;

    @NotNull(message = "Il peso e obbligatorio")
    @Min(value = 0, message = "Il peso non puo essere negativo")
    @Schema(example = "15000", description = "Peso in kg")
    private Double weight;

    @Schema(example = "50", description = "Volume in m3")
    private Double volume;

    @Schema(example = "10", description = "Numero colli")
    private Integer packages;

    @Schema(example = "false", description = "Merce pericolosa ADR")
    private Boolean isADR = false;

    @Schema(example = "-18", description = "Temperatura richiesta in gradi")
    private Double temperature;
}
