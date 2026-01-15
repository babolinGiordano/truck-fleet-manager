package com.truckfleet.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum TripStatus {
    PLANNED("planned"),
    IN_PROGRESS("in_progress"),
    COMPLETED("completed"),
    CANCELLED("cancelled");

    private final String value;

    TripStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static TripStatus fromValue(String value) {
        for (TripStatus status : TripStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown TripStatus: " + value);
    }
}
