package com.truckfleet.mapper;

import com.truckfleet.dto.client.ClientResponseDto;
import com.truckfleet.dto.client.CreateClientDto;
import com.truckfleet.dto.client.UpdateClientDto;
import com.truckfleet.entity.Client;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface ClientMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "trips", ignore = true)
    @Mapping(target = "invoices", ignore = true)
    @Mapping(target = "country", source = "country", qualifiedByName = "mapCountry")
    @Mapping(target = "isActive", source = "isActive", qualifiedByName = "mapIsActive")
    Client toEntity(CreateClientDto dto);

    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    ClientResponseDto toResponseDto(Client entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "trips", ignore = true)
    @Mapping(target = "invoices", ignore = true)
    void updateEntityFromDto(UpdateClientDto dto, @MappingTarget Client entity);

    @Named("localDateTimeToString")
    default String localDateTimeToString(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    @Named("mapCountry")
    default String mapCountry(String country) {
        return country != null ? country : "Italia";
    }

    @Named("mapIsActive")
    default Boolean mapIsActive(Boolean isActive) {
        return isActive != null ? isActive : true;
    }
}
