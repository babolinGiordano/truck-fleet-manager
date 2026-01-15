package com.truckfleet.mapper;

import com.truckfleet.dto.invoice.CreateInvoiceDto;
import com.truckfleet.dto.invoice.InvoiceItemDto;
import com.truckfleet.dto.invoice.InvoiceResponseDto;
import com.truckfleet.dto.invoice.UpdateInvoiceDto;
import com.truckfleet.entity.Invoice;
import com.truckfleet.entity.InvoiceItem;
import com.truckfleet.entity.enums.InvoiceStatus;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Mapper(componentModel = "spring")
public interface InvoiceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "client", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "status", source = "status", qualifiedByName = "mapStatus")
    @Mapping(target = "vatRate", source = "vatRate", qualifiedByName = "mapVatRate")
    @Mapping(target = "issueDate", source = "issueDate", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "dueDate", source = "dueDate", qualifiedByName = "stringToLocalDateTime")
    @Mapping(target = "paidDate", source = "paidDate", qualifiedByName = "stringToLocalDateTime")
    Invoice toEntity(CreateInvoiceDto dto);

    @Mapping(target = "issueDate", source = "issueDate", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "dueDate", source = "dueDate", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "paidDate", source = "paidDate", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "createdAt", source = "createdAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "updatedAt", source = "updatedAt", qualifiedByName = "localDateTimeToString")
    @Mapping(target = "items", source = "items")
    InvoiceResponseDto toResponseDto(Invoice entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "trip", ignore = true)
    @Mapping(target = "invoiceId", ignore = true)
    InvoiceItem toItemEntity(InvoiceItemDto dto);

    InvoiceItemDto toItemDto(InvoiceItem entity);

    List<InvoiceItem> toItemEntities(List<InvoiceItemDto> dtos);

    List<InvoiceItemDto> toItemDtos(List<InvoiceItem> entities);

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
    default InvoiceStatus mapStatus(InvoiceStatus status) {
        return status != null ? status : InvoiceStatus.DRAFT;
    }

    @Named("mapVatRate")
    default BigDecimal mapVatRate(BigDecimal vatRate) {
        return vatRate != null ? vatRate : new BigDecimal("22");
    }
}
