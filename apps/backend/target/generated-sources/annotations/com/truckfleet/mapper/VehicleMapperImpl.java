package com.truckfleet.mapper;

import com.truckfleet.dto.vehicle.CreateVehicleDto;
import com.truckfleet.dto.vehicle.UpdateVehicleDto;
import com.truckfleet.dto.vehicle.VehicleResponseDto;
import com.truckfleet.entity.Vehicle;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-15T16:48:44+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class VehicleMapperImpl implements VehicleMapper {

    @Override
    public Vehicle toEntity(CreateVehicleDto dto) {
        if ( dto == null ) {
            return null;
        }

        Vehicle.VehicleBuilder vehicle = Vehicle.builder();

        vehicle.insuranceExpiry( stringToLocalDateTime( dto.getInsuranceExpiry() ) );
        vehicle.revisionExpiry( stringToLocalDateTime( dto.getRevisionExpiry() ) );
        vehicle.status( mapStatus( dto.getStatus() ) );
        vehicle.plate( dto.getPlate() );
        vehicle.brand( dto.getBrand() );
        vehicle.model( dto.getModel() );
        vehicle.year( dto.getYear() );
        vehicle.currentDriverId( dto.getCurrentDriverId() );
        vehicle.lastLat( dto.getLastLat() );
        vehicle.lastLng( dto.getLastLng() );
        vehicle.kmTotal( dto.getKmTotal() );
        vehicle.notes( dto.getNotes() );

        return vehicle.build();
    }

    @Override
    public VehicleResponseDto toResponseDto(Vehicle entity) {
        if ( entity == null ) {
            return null;
        }

        VehicleResponseDto vehicleResponseDto = new VehicleResponseDto();

        vehicleResponseDto.setInsuranceExpiry( localDateTimeToString( entity.getInsuranceExpiry() ) );
        vehicleResponseDto.setRevisionExpiry( localDateTimeToString( entity.getRevisionExpiry() ) );
        vehicleResponseDto.setLastPositionAt( localDateTimeToString( entity.getLastPositionAt() ) );
        vehicleResponseDto.setCreatedAt( localDateTimeToString( entity.getCreatedAt() ) );
        vehicleResponseDto.setUpdatedAt( localDateTimeToString( entity.getUpdatedAt() ) );
        vehicleResponseDto.setId( entity.getId() );
        vehicleResponseDto.setPlate( entity.getPlate() );
        vehicleResponseDto.setBrand( entity.getBrand() );
        vehicleResponseDto.setModel( entity.getModel() );
        vehicleResponseDto.setYear( entity.getYear() );
        vehicleResponseDto.setStatus( entity.getStatus() );
        vehicleResponseDto.setCurrentDriverId( entity.getCurrentDriverId() );
        vehicleResponseDto.setLastLat( entity.getLastLat() );
        vehicleResponseDto.setLastLng( entity.getLastLng() );
        vehicleResponseDto.setKmTotal( entity.getKmTotal() );
        vehicleResponseDto.setNotes( entity.getNotes() );

        return vehicleResponseDto;
    }

    @Override
    public void updateEntityFromDto(UpdateVehicleDto dto, Vehicle entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getInsuranceExpiry() != null ) {
            entity.setInsuranceExpiry( stringToLocalDateTime( dto.getInsuranceExpiry() ) );
        }
        if ( dto.getRevisionExpiry() != null ) {
            entity.setRevisionExpiry( stringToLocalDateTime( dto.getRevisionExpiry() ) );
        }
        if ( dto.getPlate() != null ) {
            entity.setPlate( dto.getPlate() );
        }
        if ( dto.getBrand() != null ) {
            entity.setBrand( dto.getBrand() );
        }
        if ( dto.getModel() != null ) {
            entity.setModel( dto.getModel() );
        }
        if ( dto.getYear() != null ) {
            entity.setYear( dto.getYear() );
        }
        if ( dto.getStatus() != null ) {
            entity.setStatus( dto.getStatus() );
        }
        if ( dto.getCurrentDriverId() != null ) {
            entity.setCurrentDriverId( dto.getCurrentDriverId() );
        }
        if ( dto.getLastLat() != null ) {
            entity.setLastLat( dto.getLastLat() );
        }
        if ( dto.getLastLng() != null ) {
            entity.setLastLng( dto.getLastLng() );
        }
        if ( dto.getKmTotal() != null ) {
            entity.setKmTotal( dto.getKmTotal() );
        }
        if ( dto.getNotes() != null ) {
            entity.setNotes( dto.getNotes() );
        }
    }
}
