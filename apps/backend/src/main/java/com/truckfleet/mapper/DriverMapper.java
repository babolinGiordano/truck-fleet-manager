package com.truckfleet.mapper;

import com.truckfleet.dto.driver.CreateDriverDto;
import com.truckfleet.dto.driver.DriverResponseDto;
import com.truckfleet.dto.driver.UpdateDriverDto;
import com.truckfleet.entity.Driver;
import com.truckfleet.entity.enums.DriverStatus;
import org.mapstruct.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Mapper(componentModel = "spring")
public interface DriverMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "trips", ignore = true)
    @Mapping(target = "fuelRecords", ignore = true)
    @Mapping(target = "licenseExpiry", source = "licenseExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "cqcExpiry", source = "cqcExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "adrExpiry", source = "adrExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "hireDate", source = "hireDate", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "status", source = "status", qualifiedByName = "mapStatus")
    Driver toEntity(CreateDriverDto dto);

    @Mapping(target = "licenseExpiry", source = "licenseExpiry", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "cqcExpiry", source = "cqcExpiry", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "adrExpiry", source = "adrExpiry", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "hireDate", source = "hireDate", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    DriverResponseDto toResponseDto(Driver entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "trips", ignore = true)
    @Mapping(target = "fuelRecords", ignore = true)
    @Mapping(target = "licenseExpiry", source = "licenseExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "cqcExpiry", source = "cqcExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "adrExpiry", source = "adrExpiry", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "hireDate", source = "hireDate", qualifiedByName = "stringToLocalDateTime")
    void updateEntityFromDto(UpdateDriverDto dto, @MappingTarget Driver entity);

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
    default DriverStatus mapStatus(DriverStatus status) {
        return status != null ? status : DriverStatus.ACTIVE;
    }
}
