package com.truckfleet.mapper;

import com.truckfleet.dto.trip.*;
import com.truckfleet.entity.Trip;
import com.truckfleet.entity.enums.TripStatus;
import org.mapstruct.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Mapper(componentModel = "spring")
public interface TripMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "driver", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "invoiceItems", ignore = true)
    @Mapping(target = "status", source = "status", qualifiedByName = "mapStatus")
    @Mapping(target = "plannedDeparture", source = "plannedDeparture", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "actualDeparture", source = "actualDeparture", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "plannedArrival", source = "plannedArrival", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "actualArrival", source = "actualArrival", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "originCompany", source = "origin.companyName")
    @Mapping(target = "originAddress", source = "origin.address")
    @Mapping(target = "originCity", source = "origin.city")
    @Mapping(target = "originProvince", source = "origin.province")
    @Mapping(target = "originPostalCode", source = "origin.postalCode")
    @Mapping(target = "originCountry", source = "origin.country", qualifiedByName = "mapCountry")
    @Mapping(target = "originLat", source = "origin.lat")
    @Mapping(target = "originLng", source = "origin.lng")
    @Mapping(target = "destCompany", source = "destination.companyName")
    @Mapping(target = "destAddress", source = "destination.address")
    @Mapping(target = "destCity", source = "destination.city")
    @Mapping(target = "destProvince", source = "destination.province")
    @Mapping(target = "destPostalCode", source = "destination.postalCode")
    @Mapping(target = "destCountry", source = "destination.country", qualifiedByName = "mapCountry")
    @Mapping(target = "destLat", source = "destination.lat")
    @Mapping(target = "destLng", source = "destination.lng")
    @Mapping(target = "cargoDescription", source = "cargo.description")
    @Mapping(target = "cargoWeight", source = "cargo.weight")
    @Mapping(target = "cargoVolume", source = "cargo.volume")
    @Mapping(target = "cargoPackages", source = "cargo.packages")
    @Mapping(target = "cargoIsADR", source = "cargo.isADR", qualifiedByName = "mapIsADR")
    @Mapping(target = "cargoTemperature", source = "cargo.temperature")
    Trip toEntity(CreateTripDto dto);

    @Mapping(target = "origin", expression = "java(mapOrigin(entity))")
    @Mapping(target = "destination", expression = "java(mapDestination(entity))")
    @Mapping(target = "cargo", expression = "java(mapCargo(entity))")
    @Mapping(target = "plannedDeparture", source = "plannedDeparture", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "actualDeparture", source = "actualDeparture", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "plannedArrival", source = "plannedArrival", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "actualArrival", source = "actualArrival", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    TripResponseDto toResponseDto(Trip entity);

    default TripLocationDto mapOrigin(Trip entity) {
        TripLocationDto dto = new TripLocationDto();
        dto.setCompanyName(entity.getOriginCompany());
        dto.setAddress(entity.getOriginAddress());
        dto.setCity(entity.getOriginCity());
        dto.setProvince(entity.getOriginProvince());
        dto.setPostalCode(entity.getOriginPostalCode());
        dto.setCountry(entity.getOriginCountry());
        dto.setLat(entity.getOriginLat());
        dto.setLng(entity.getOriginLng());
        return dto;
    }

    default TripLocationDto mapDestination(Trip entity) {
        TripLocationDto dto = new TripLocationDto();
        dto.setCompanyName(entity.getDestCompany());
        dto.setAddress(entity.getDestAddress());
        dto.setCity(entity.getDestCity());
        dto.setProvince(entity.getDestProvince());
        dto.setPostalCode(entity.getDestPostalCode());
        dto.setCountry(entity.getDestCountry());
        dto.setLat(entity.getDestLat());
        dto.setLng(entity.getDestLng());
        return dto;
    }

    default CargoInfoDto mapCargo(Trip entity) {
        CargoInfoDto dto = new CargoInfoDto();
        dto.setDescription(entity.getCargoDescription());
        dto.setWeight(entity.getCargoWeight());
        dto.setVolume(entity.getCargoVolume());
        dto.setPackages(entity.getCargoPackages());
        dto.setIsADR(entity.getCargoIsADR());
        dto.setTemperature(entity.getCargoTemperature());
        return dto;
    }

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
    default TripStatus mapStatus(TripStatus status) {
        return status != null ? status : TripStatus.PLANNED;
    }

    @Named("mapCountry")
    default String mapCountry(String country) {
        return country != null ? country : "Italia";
    }

    @Named("mapIsADR")
    default Boolean mapIsADR(Boolean isADR) {
        return isADR != null ? isADR : false;
    }
}
