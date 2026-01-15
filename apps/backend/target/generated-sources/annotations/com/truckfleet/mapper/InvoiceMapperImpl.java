package com.truckfleet.mapper;

import com.truckfleet.dto.invoice.CreateInvoiceDto;
import com.truckfleet.dto.invoice.InvoiceItemDto;
import com.truckfleet.dto.invoice.InvoiceResponseDto;
import com.truckfleet.entity.Invoice;
import com.truckfleet.entity.InvoiceItem;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-15T13:38:33+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class InvoiceMapperImpl implements InvoiceMapper {

    @Override
    public Invoice toEntity(CreateInvoiceDto dto) {
        if ( dto == null ) {
            return null;
        }

        Invoice.InvoiceBuilder invoice = Invoice.builder();

        invoice.status( mapStatus( dto.getStatus() ) );
        invoice.vatRate( mapVatRate( dto.getVatRate() ) );
        invoice.issueDate( stringToLocalDateTime( dto.getIssueDate() ) );
        invoice.dueDate( stringToLocalDateTime( dto.getDueDate() ) );
        invoice.paidDate( stringToLocalDateTime( dto.getPaidDate() ) );
        invoice.invoiceNumber( dto.getInvoiceNumber() );
        invoice.clientId( dto.getClientId() );
        invoice.subtotal( dto.getSubtotal() );
        invoice.vatAmount( dto.getVatAmount() );
        invoice.total( dto.getTotal() );
        invoice.notes( dto.getNotes() );

        return invoice.build();
    }

    @Override
    public InvoiceResponseDto toResponseDto(Invoice entity) {
        if ( entity == null ) {
            return null;
        }

        InvoiceResponseDto invoiceResponseDto = new InvoiceResponseDto();

        invoiceResponseDto.setIssueDate( localDateTimeToString( entity.getIssueDate() ) );
        invoiceResponseDto.setDueDate( localDateTimeToString( entity.getDueDate() ) );
        invoiceResponseDto.setPaidDate( localDateTimeToString( entity.getPaidDate() ) );
        invoiceResponseDto.setCreatedAt( localDateTimeToString( entity.getCreatedAt() ) );
        invoiceResponseDto.setUpdatedAt( localDateTimeToString( entity.getUpdatedAt() ) );
        invoiceResponseDto.setItems( toItemDtos( entity.getItems() ) );
        invoiceResponseDto.setId( entity.getId() );
        invoiceResponseDto.setInvoiceNumber( entity.getInvoiceNumber() );
        invoiceResponseDto.setClientId( entity.getClientId() );
        invoiceResponseDto.setStatus( entity.getStatus() );
        invoiceResponseDto.setSubtotal( entity.getSubtotal() );
        invoiceResponseDto.setVatRate( entity.getVatRate() );
        invoiceResponseDto.setVatAmount( entity.getVatAmount() );
        invoiceResponseDto.setTotal( entity.getTotal() );
        invoiceResponseDto.setNotes( entity.getNotes() );

        return invoiceResponseDto;
    }

    @Override
    public InvoiceItem toItemEntity(InvoiceItemDto dto) {
        if ( dto == null ) {
            return null;
        }

        InvoiceItem.InvoiceItemBuilder invoiceItem = InvoiceItem.builder();

        invoiceItem.description( dto.getDescription() );
        invoiceItem.quantity( dto.getQuantity() );
        invoiceItem.unitPrice( dto.getUnitPrice() );
        invoiceItem.totalPrice( dto.getTotalPrice() );
        invoiceItem.tripId( dto.getTripId() );

        return invoiceItem.build();
    }

    @Override
    public InvoiceItemDto toItemDto(InvoiceItem entity) {
        if ( entity == null ) {
            return null;
        }

        InvoiceItemDto invoiceItemDto = new InvoiceItemDto();

        invoiceItemDto.setId( entity.getId() );
        invoiceItemDto.setDescription( entity.getDescription() );
        invoiceItemDto.setQuantity( entity.getQuantity() );
        invoiceItemDto.setUnitPrice( entity.getUnitPrice() );
        invoiceItemDto.setTotalPrice( entity.getTotalPrice() );
        invoiceItemDto.setTripId( entity.getTripId() );

        return invoiceItemDto;
    }

    @Override
    public List<InvoiceItem> toItemEntities(List<InvoiceItemDto> dtos) {
        if ( dtos == null ) {
            return null;
        }

        List<InvoiceItem> list = new ArrayList<InvoiceItem>( dtos.size() );
        for ( InvoiceItemDto invoiceItemDto : dtos ) {
            list.add( toItemEntity( invoiceItemDto ) );
        }

        return list;
    }

    @Override
    public List<InvoiceItemDto> toItemDtos(List<InvoiceItem> entities) {
        if ( entities == null ) {
            return null;
        }

        List<InvoiceItemDto> list = new ArrayList<InvoiceItemDto>( entities.size() );
        for ( InvoiceItem invoiceItem : entities ) {
            list.add( toItemDto( invoiceItem ) );
        }

        return list;
    }
}
