package com.truckfleet.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum MaintenanceType {
    OIL_CHANGE("oil_change"),
    TIRES("tires"),
    BRAKES("brakes"),
    FILTERS("filters"),
    REVISION("revision"),
    REPAIR("repair"),
    OTHER("other");

    private final String value;

    MaintenanceType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static MaintenanceType fromValue(String value) {
        for (MaintenanceType type : MaintenanceType.values()) {
            if (type.value.equals(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown MaintenanceType: " + value);
    }
}
