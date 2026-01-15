package com.truckfleet.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum VehicleStatus {
    AVAILABLE("available"),
    IN_TRANSIT("in_transit"),
    MAINTENANCE("maintenance"),
    INACTIVE("inactive");

    private final String value;

    VehicleStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static VehicleStatus fromValue(String value) {
        for (VehicleStatus status : VehicleStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown VehicleStatus: " + value);
    }
}
