package com.truckfleet.mapper;

import com.truckfleet.dto.fuel.CreateFuelRecordDto;
import com.truckfleet.dto.fuel.FuelRecordResponseDto;
import com.truckfleet.dto.fuel.UpdateFuelRecordDto;
import com.truckfleet.entity.FuelRecord;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-15T16:48:43+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class FuelRecordMapperImpl implements FuelRecordMapper {

    @Override
    public FuelRecord toEntity(CreateFuelRecordDto dto) {
        if ( dto == null ) {
            return null;
        }

        FuelRecord.FuelRecordBuilder fuelRecord = FuelRecord.builder();

        fuelRecord.date( stringToLocalDateTime( dto.getDate() ) );
        fuelRecord.fuelType( mapFuelType( dto.getFuelType() ) );
        fuelRecord.fullTank( mapFullTank( dto.getFullTank() ) );
        fuelRecord.vehicleId( dto.getVehicleId() );
        fuelRecord.driverId( dto.getDriverId() );
        fuelRecord.liters( dto.getLiters() );
        fuelRecord.pricePerLiter( dto.getPricePerLiter() );
        fuelRecord.totalCost( dto.getTotalCost() );
        fuelRecord.stationName( dto.getStationName() );
        fuelRecord.odometer( dto.getOdometer() );
        fuelRecord.notes( dto.getNotes() );

        return fuelRecord.build();
    }

    @Override
    public FuelRecordResponseDto toResponseDto(FuelRecord entity) {
        if ( entity == null ) {
            return null;
        }

        FuelRecordResponseDto fuelRecordResponseDto = new FuelRecordResponseDto();

        fuelRecordResponseDto.setDate( localDateTimeToString( entity.getDate() ) );
        fuelRecordResponseDto.setCreatedAt( localDateTimeToString( entity.getCreatedAt() ) );
        fuelRecordResponseDto.setUpdatedAt( localDateTimeToString( entity.getUpdatedAt() ) );
        fuelRecordResponseDto.setId( entity.getId() );
        fuelRecordResponseDto.setVehicleId( entity.getVehicleId() );
        fuelRecordResponseDto.setDriverId( entity.getDriverId() );
        fuelRecordResponseDto.setLiters( entity.getLiters() );
        fuelRecordResponseDto.setPricePerLiter( entity.getPricePerLiter() );
        fuelRecordResponseDto.setTotalCost( entity.getTotalCost() );
        fuelRecordResponseDto.setFuelType( entity.getFuelType() );
        fuelRecordResponseDto.setStationName( entity.getStationName() );
        fuelRecordResponseDto.setOdometer( entity.getOdometer() );
        fuelRecordResponseDto.setFullTank( entity.getFullTank() );
        fuelRecordResponseDto.setNotes( entity.getNotes() );

        return fuelRecordResponseDto;
    }

    @Override
    public void updateEntityFromDto(UpdateFuelRecordDto dto, FuelRecord entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getDate() != null ) {
            entity.setDate( stringToLocalDateTime( dto.getDate() ) );
        }
        if ( dto.getVehicleId() != null ) {
            entity.setVehicleId( dto.getVehicleId() );
        }
        if ( dto.getDriverId() != null ) {
            entity.setDriverId( dto.getDriverId() );
        }
        if ( dto.getLiters() != null ) {
            entity.setLiters( dto.getLiters() );
        }
        if ( dto.getPricePerLiter() != null ) {
            entity.setPricePerLiter( dto.getPricePerLiter() );
        }
        if ( dto.getTotalCost() != null ) {
            entity.setTotalCost( dto.getTotalCost() );
        }
        if ( dto.getFuelType() != null ) {
            entity.setFuelType( dto.getFuelType() );
        }
        if ( dto.getStationName() != null ) {
            entity.setStationName( dto.getStationName() );
        }
        if ( dto.getOdometer() != null ) {
            entity.setOdometer( dto.getOdometer() );
        }
        if ( dto.getFullTank() != null ) {
            entity.setFullTank( dto.getFullTank() );
        }
        if ( dto.getNotes() != null ) {
            entity.setNotes( dto.getNotes() );
        }
    }
}
