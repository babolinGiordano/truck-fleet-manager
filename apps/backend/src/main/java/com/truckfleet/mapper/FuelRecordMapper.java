package com.truckfleet.mapper;

import com.truckfleet.dto.fuel.CreateFuelRecordDto;
import com.truckfleet.dto.fuel.FuelRecordResponseDto;
import com.truckfleet.dto.fuel.UpdateFuelRecordDto;
import com.truckfleet.entity.FuelRecord;
import com.truckfleet.entity.enums.FuelType;
import org.mapstruct.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Mapper(componentModel = "spring")
public interface FuelRecordMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "driver", ignore = true)
    @Mapping(target = "date", source = "date", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "fuelType", source = "fuelType", qualifiedByName = "mapFuelType")
    @Mapping(target = "fullTank", source = "fullTank", qualifiedByName = "mapFullTank")
    FuelRecord toEntity(CreateFuelRecordDto dto);

    @Mapping(target = "date", source = "date", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    FuelRecordResponseDto toResponseDto(FuelRecord entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "driver", ignore = true)
    @Mapping(target = "date", source = "date", qualifiedByName = "stringToLocalDateTime")
    void updateEntityFromDto(UpdateFuelRecordDto dto, @MappingTarget FuelRecord entity);

    @Named("stringToLocalDateTime")
    default LocalDateTime stringToLocalDateTime(String dateString) {
        if (dateString == null || dateString.isEmpty()) {
            return null;
        }
        try {
            return LocalDateTime.parse(dateString);
        } catch (DateTimeParseException e) {
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

    @Named("mapFuelType")
    default FuelType mapFuelType(FuelType fuelType) {
        return fuelType != null ? fuelType : FuelType.DIESEL;
    }

    @Named("mapFullTank")
    default Boolean mapFullTank(Boolean fullTank) {
        return fullTank != null ? fullTank : true;
    }
}
