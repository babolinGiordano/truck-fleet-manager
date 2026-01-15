package com.truckfleet.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FuelType {
    DIESEL("diesel"),
    GASOLINE("gasoline"),
    LPG("lpg"),
    METHANE("methane"),
    ELECTRIC("electric");

    private final String value;

    FuelType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static FuelType fromValue(String value) {
        for (FuelType type : FuelType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown FuelType: " + value);
    }
}
