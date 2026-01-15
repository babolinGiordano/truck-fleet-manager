package com.truckfleet.mapper;

import com.truckfleet.dto.maintenance.CreateMaintenanceRecordDto;
import com.truckfleet.dto.maintenance.MaintenanceRecordResponseDto;
import com.truckfleet.dto.maintenance.UpdateMaintenanceRecordDto;
import com.truckfleet.entity.MaintenanceRecord;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-15T13:38:33+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class MaintenanceRecordMapperImpl implements MaintenanceRecordMapper {

    @Override
    public MaintenanceRecord toEntity(CreateMaintenanceRecordDto dto) {
        if ( dto == null ) {
            return null;
        }

        MaintenanceRecord.MaintenanceRecordBuilder maintenanceRecord = MaintenanceRecord.builder();

        maintenanceRecord.date( stringToLocalDateTime( dto.getDate() ) );
        maintenanceRecord.nextMaintenanceDate( stringToLocalDateTime( dto.getNextMaintenanceDate() ) );
        maintenanceRecord.status( mapStatus( dto.getStatus() ) );
        maintenanceRecord.vehicleId( dto.getVehicleId() );
        maintenanceRecord.type( dto.getType() );
        maintenanceRecord.description( dto.getDescription() );
        maintenanceRecord.odometer( dto.getOdometer() );
        maintenanceRecord.cost( dto.getCost() );
        maintenanceRecord.workshop( dto.getWorkshop() );
        maintenanceRecord.invoiceNumber( dto.getInvoiceNumber() );
        maintenanceRecord.nextMaintenanceKm( dto.getNextMaintenanceKm() );
        maintenanceRecord.notes( dto.getNotes() );

        return maintenanceRecord.build();
    }

    @Override
    public MaintenanceRecordResponseDto toResponseDto(MaintenanceRecord entity) {
        if ( entity == null ) {
            return null;
        }

        MaintenanceRecordResponseDto maintenanceRecordResponseDto = new MaintenanceRecordResponseDto();

        maintenanceRecordResponseDto.setDate( localDateTimeToString( entity.getDate() ) );
        maintenanceRecordResponseDto.setNextMaintenanceDate( localDateTimeToString( entity.getNextMaintenanceDate() ) );
        maintenanceRecordResponseDto.setCreatedAt( localDateTimeToString( entity.getCreatedAt() ) );
        maintenanceRecordResponseDto.setUpdatedAt( localDateTimeToString( entity.getUpdatedAt() ) );
        maintenanceRecordResponseDto.setId( entity.getId() );
        maintenanceRecordResponseDto.setVehicleId( entity.getVehicleId() );
        maintenanceRecordResponseDto.setType( entity.getType() );
        maintenanceRecordResponseDto.setDescription( entity.getDescription() );
        maintenanceRecordResponseDto.setOdometer( entity.getOdometer() );
        maintenanceRecordResponseDto.setCost( entity.getCost() );
        maintenanceRecordResponseDto.setWorkshop( entity.getWorkshop() );
        maintenanceRecordResponseDto.setInvoiceNumber( entity.getInvoiceNumber() );
        maintenanceRecordResponseDto.setNextMaintenanceKm( entity.getNextMaintenanceKm() );
        maintenanceRecordResponseDto.setStatus( entity.getStatus() );
        maintenanceRecordResponseDto.setNotes( entity.getNotes() );

        return maintenanceRecordResponseDto;
    }

    @Override
    public void updateEntityFromDto(UpdateMaintenanceRecordDto dto, MaintenanceRecord entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getDate() != null ) {
            entity.setDate( stringToLocalDateTime( dto.getDate() ) );
        }
        if ( dto.getNextMaintenanceDate() != null ) {
            entity.setNextMaintenanceDate( stringToLocalDateTime( dto.getNextMaintenanceDate() ) );
        }
        if ( dto.getVehicleId() != null ) {
            entity.setVehicleId( dto.getVehicleId() );
        }
        if ( dto.getType() != null ) {
            entity.setType( dto.getType() );
        }
        if ( dto.getDescription() != null ) {
            entity.setDescription( dto.getDescription() );
        }
        if ( dto.getOdometer() != null ) {
            entity.setOdometer( dto.getOdometer() );
        }
        if ( dto.getCost() != null ) {
            entity.setCost( dto.getCost() );
        }
        if ( dto.getWorkshop() != null ) {
            entity.setWorkshop( dto.getWorkshop() );
        }
        if ( dto.getInvoiceNumber() != null ) {
            entity.setInvoiceNumber( dto.getInvoiceNumber() );
        }
        if ( dto.getNextMaintenanceKm() != null ) {
            entity.setNextMaintenanceKm( dto.getNextMaintenanceKm() );
        }
        if ( dto.getStatus() != null ) {
            entity.setStatus( dto.getStatus() );
        }
        if ( dto.getNotes() != null ) {
            entity.setNotes( dto.getNotes() );
        }
    }
}
