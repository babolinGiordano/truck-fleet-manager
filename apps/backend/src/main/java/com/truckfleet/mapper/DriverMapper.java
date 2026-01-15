package com.truckfleet.mapper;

import com.truckfleet.dto.driver.CreateDriverDto;
import com.truckfleet.dto.driver.DriverResponseDto;
import com.truckfleet.dto.driver.UpdateDriverDto;
import com.truckfleet.entity.Driver;
import com.truckfleet.entity.enums.DriverStatus;
import org.mapstruct.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
            // Try parsing as LocalDateTime first (e.g., "2027-01-25T00:00:00")
            return LocalDateTime.parse(dateString);
        } catch (DateTimeParseException e) {
            // Fall back to LocalDate and convert to LocalDateTime at midnight (e.g., "2027-01-25")
            return LocalDate.parse(dateString).atStartOfDay();
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
