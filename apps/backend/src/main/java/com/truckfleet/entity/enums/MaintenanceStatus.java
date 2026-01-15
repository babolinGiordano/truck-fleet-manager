package com.truckfleet.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MaintenanceStatus {
    SCHEDULED("scheduled"),
    IN_PROGRESS("in_progress"),
    COMPLETED("completed"),
    CANCELLED("cancelled");

    private final String value;

    MaintenanceStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static MaintenanceStatus fromValue(String value) {
        for (MaintenanceStatus status : MaintenanceStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown MaintenanceStatus: " + value);
    }
}
