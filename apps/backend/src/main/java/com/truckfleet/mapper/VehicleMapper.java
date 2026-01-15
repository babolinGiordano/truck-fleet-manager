package com.truckfleet.mapper;

import com.truckfleet.dto.vehicle.CreateVehicleDto;
import com.truckfleet.dto.vehicle.UpdateVehicleDto;
import com.truckfleet.dto.vehicle.VehicleResponseDto;
import com.truckfleet.entity.Vehicle;
import com.truckfleet.entity.enums.VehicleStatus;
import org.mapstruct.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastPositionAt", ignore = true)
    @Mapping(target = "trips", ignore = true)
    @Mapping(target = "fuelRecords", ignore = true)
    @Mapping(target = "maintenanceRecords", ignore = true)
    @Mapping(target = "insuranceExpiry", source = "insuranceExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "revisionExpiry", source = "revisionExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "status", source = "status", qualifiedByName = "mapStatus")
    Vehicle toEntity(CreateVehicleDto dto);

    @Mapping(target = "insuranceExpiry", source = "insuranceExpiry", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "revisionExpiry", source = "revisionExpiry", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "lastPositionAt", source = "lastPositionAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    VehicleResponseDto toResponseDto(Vehicle entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "lastPositionAt", ignore = true)
    @Mapping(target = "trips", ignore = true)
    @Mapping(target = "fuelRecords", ignore = true)
    @Mapping(target = "maintenanceRecords", ignore = true)
    @Mapping(target = "insuranceExpiry", source = "insuranceExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "revisionExpiry", source = "revisionExpiry", qualifiedByName = "stringToLocalDateTime")
    void updateEntityFromDto(UpdateVehicleDto dto, @MappingTarget Vehicle entity);

    @Named("stringToLocalDateTime")
    default LocalDateTime stringToLocalDateTime(String dateString) {
        if (dateString == null || dateString.isEmpty()) {
            return null;
        }
        try {
            // Handle ISO 8601 format with timezone (e.g., 2026-01-15T15:22:00.000Z)
            if (dateString.endsWith("Z") || dateString.contains("+")) {
                Instant instant = Instant.parse(dateString);
                return LocalDateTime.ofInstant(instant, ZoneId.systemDefault());
            }
            // Handle ISO local date-time format (e.g., 2026-01-15T15:22:00)
            return LocalDateTime.parse(dateString);
        } catch (DateTimeParseException e) {
            try {
                return LocalDate.parse(dateString).atStartOfDay();
            } catch (DateTimeParseException e2) {
                throw new IllegalArgumentException("Invalid date format: " + dateString);
            }
        }
    }

    @Named("localDateTimeToString")
    default String localDateTimeToString(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    @Named("mapStatus")
    default VehicleStatus mapStatus(VehicleStatus status) {
        return status != null ? status : VehicleStatus.AVAILABLE;
    }
}
