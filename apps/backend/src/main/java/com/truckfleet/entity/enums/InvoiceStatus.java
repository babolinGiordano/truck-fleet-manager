package com.truckfleet.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum InvoiceStatus {
    DRAFT("draft"),
    SENT("sent"),
    PAID("paid"),
    OVERDUE("overdue"),
    CANCELLED("cancelled");

    private final String value;

    InvoiceStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static InvoiceStatus fromValue(String value) {
        for (InvoiceStatus status : InvoiceStatus.values()) {
            if (status.value.equals(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown InvoiceStatus: " + value);
    }
}
