package com.truckfleet.mapper;

import com.truckfleet.dto.maintenance.CreateMaintenanceRecordDto;
import com.truckfleet.dto.maintenance.MaintenanceRecordResponseDto;
import com.truckfleet.dto.maintenance.UpdateMaintenanceRecordDto;
import com.truckfleet.entity.MaintenanceRecord;
import com.truckfleet.entity.enums.MaintenanceStatus;
import org.mapstruct.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Mapper(componentModel = "spring")
public interface MaintenanceRecordMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "date", source = "date", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "nextMaintenanceDate", source = "nextMaintenanceDate", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "status", source = "status", qualifiedByName = "mapStatus")
    MaintenanceRecord toEntity(CreateMaintenanceRecordDto dto);

    @Mapping(target = "date", source = "date", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "nextMaintenanceDate", source = "nextMaintenanceDate", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    MaintenanceRecordResponseDto toResponseDto(MaintenanceRecord entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "date", source = "date", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "nextMaintenanceDate", source = "nextMaintenanceDate", qualifiedByName = "stringToLocalDateTime")
    void updateEntityFromDto(UpdateMaintenanceRecordDto dto, @MappingTarget MaintenanceRecord entity);

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

    @Named("mapStatus")
    default MaintenanceStatus mapStatus(MaintenanceStatus status) {
        return status != null ? status : MaintenanceStatus.SCHEDULED;
    }
}
