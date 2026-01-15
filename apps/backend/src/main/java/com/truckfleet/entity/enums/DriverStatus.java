package com.truckfleet.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum DriverStatus {
    ACTIVE("active"),
    ON_LEAVE("on_leave"),
    INACTIVE("inactive");

    private final String value;

    DriverStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static DriverStatus fromValue(String value) {
        for (DriverStatus status : DriverStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown DriverStatus: " + value);
    }
}
