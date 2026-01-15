package com.truckfleet.dto.client;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "DTO di risposta per un cliente")
public class ClientResponseDto {

    private String id;
    private String companyName;
    private String vatNumber;
    private String fiscalCode;
    private String address;
    private String city;
    private String province;
    private String postalCode;
    private String country;
    private String phone;
    private String email;
    private String pec;
    private String sdiCode;
    private String contactPerson;
    private String notes;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;
}
