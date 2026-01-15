package com.truckfleet.common.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resourceName, String fieldName, String fieldValue) {
        super(String.format("%s con %s '%s' non trovato", resourceName, fieldName, fieldValue));
    }
}
