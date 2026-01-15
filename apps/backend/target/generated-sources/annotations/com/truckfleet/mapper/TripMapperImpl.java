package com.truckfleet.mapper;

import com.truckfleet.dto.trip.CargoInfoDto;
import com.truckfleet.dto.trip.CreateTripDto;
import com.truckfleet.dto.trip.TripLocationDto;
import com.truckfleet.dto.trip.TripResponseDto;
import com.truckfleet.entity.Trip;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-15T16:48:44+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class TripMapperImpl implements TripMapper {

    @Override
    public Trip toEntity(CreateTripDto dto) {
        if ( dto == null ) {
            return null;
        }

        Trip.TripBuilder trip = Trip.builder();

        trip.status( mapStatus( dto.getStatus() ) );
        trip.plannedDeparture( stringToLocalDateTime( dto.getPlannedDeparture() ) );
        trip.actualDeparture( stringToLocalDateTime( dto.getActualDeparture() ) );
        trip.plannedArrival( stringToLocalDateTime( dto.getPlannedArrival() ) );
        trip.actualArrival( stringToLocalDateTime( dto.getActualArrival() ) );
        trip.originCompany( dtoOriginCompanyName( dto ) );
        trip.originAddress( dtoOriginAddress( dto ) );
        trip.originCity( dtoOriginCity( dto ) );
        trip.originProvince( dtoOriginProvince( dto ) );
        trip.originPostalCode( dtoOriginPostalCode( dto ) );
        trip.originCountry( mapCountry( dtoOriginCountry( dto ) ) );
        trip.originLat( dtoOriginLat( dto ) );
        trip.originLng( dtoOriginLng( dto ) );
        trip.destCompany( dtoDestinationCompanyName( dto ) );
        trip.destAddress( dtoDestinationAddress( dto ) );
        trip.destCity( dtoDestinationCity( dto ) );
        trip.destProvince( dtoDestinationProvince( dto ) );
        trip.destPostalCode( dtoDestinationPostalCode( dto ) );
        trip.destCountry( mapCountry( dtoDestinationCountry( dto ) ) );
        trip.destLat( dtoDestinationLat( dto ) );
        trip.destLng( dtoDestinationLng( dto ) );
        trip.cargoDescription( dtoCargoDescription( dto ) );
        trip.cargoWeight( dtoCargoWeight( dto ) );
        trip.cargoVolume( dtoCargoVolume( dto ) );
        trip.cargoPackages( dtoCargoPackages( dto ) );
        trip.cargoIsADR( mapIsADR( dtoCargoIsADR( dto ) ) );
        trip.cargoTemperature( dtoCargoTemperature( dto ) );
        trip.tripNumber( dto.getTripNumber() );
        trip.vehicleId( dto.getVehicleId() );
        trip.driverId( dto.getDriverId() );
        trip.clientId( dto.getClientId() );
        trip.kmPlanned( dto.getKmPlanned() );
        trip.kmActual( dto.getKmActual() );
        trip.price( dto.getPrice() );
        trip.notes( dto.getNotes() );

        return trip.build();
    }

    @Override
    public TripResponseDto toResponseDto(Trip entity) {
        if ( entity == null ) {
            return null;
        }

        TripResponseDto tripResponseDto = new TripResponseDto();

        tripResponseDto.setPlannedDeparture( localDateTimeToString( entity.getPlannedDeparture() ) );
        tripResponseDto.setActualDeparture( localDateTimeToString( entity.getActualDeparture() ) );
        tripResponseDto.setPlannedArrival( localDateTimeToString( entity.getPlannedArrival() ) );
        tripResponseDto.setActualArrival( localDateTimeToString( entity.getActualArrival() ) );
        tripResponseDto.setCreatedAt( localDateTimeToString( entity.getCreatedAt() ) );
        tripResponseDto.setUpdatedAt( localDateTimeToString( entity.getUpdatedAt() ) );
        tripResponseDto.setId( entity.getId() );
        tripResponseDto.setTripNumber( entity.getTripNumber() );
        tripResponseDto.setVehicleId( entity.getVehicleId() );
        tripResponseDto.setDriverId( entity.getDriverId() );
        tripResponseDto.setClientId( entity.getClientId() );
        tripResponseDto.setStatus( entity.getStatus() );
        tripResponseDto.setKmPlanned( entity.getKmPlanned() );
        tripResponseDto.setKmActual( entity.getKmActual() );
        tripResponseDto.setPrice( entity.getPrice() );
        tripResponseDto.setNotes( entity.getNotes() );

        tripResponseDto.setOrigin( mapOrigin(entity) );
        tripResponseDto.setDestination( mapDestination(entity) );
        tripResponseDto.setCargo( mapCargo(entity) );

        return tripResponseDto;
    }

    private String dtoOriginCompanyName(CreateTripDto createTripDto) {
        TripLocationDto origin = createTripDto.getOrigin();
        if ( origin == null ) {
            return null;
        }
        return origin.getCompanyName();
    }

    private String dtoOriginAddress(CreateTripDto createTripDto) {
        TripLocationDto origin = createTripDto.getOrigin();
        if ( origin == null ) {
            return null;
        }
        return origin.getAddress();
    }

    private String dtoOriginCity(CreateTripDto createTripDto) {
        TripLocationDto origin = createTripDto.getOrigin();
        if ( origin == null ) {
            return null;
        }
        return origin.getCity();
    }

    private String dtoOriginProvince(CreateTripDto createTripDto) {
        TripLocationDto origin = createTripDto.getOrigin();
        if ( origin == null ) {
            return null;
        }
        return origin.getProvince();
    }

    private String dtoOriginPostalCode(CreateTripDto createTripDto) {
        TripLocationDto origin = createTripDto.getOrigin();
        if ( origin == null ) {
            return null;
        }
        return origin.getPostalCode();
    }

    private String dtoOriginCountry(CreateTripDto createTripDto) {
        TripLocationDto origin = createTripDto.getOrigin();
        if ( origin == null ) {
            return null;
        }
        return origin.getCountry();
    }

    private Double dtoOriginLat(CreateTripDto createTripDto) {
        TripLocationDto origin = createTripDto.getOrigin();
        if ( origin == null ) {
            return null;
        }
        return origin.getLat();
    }

    private Double dtoOriginLng(CreateTripDto createTripDto) {
        TripLocationDto origin = createTripDto.getOrigin();
        if ( origin == null ) {
            return null;
        }
        return origin.getLng();
    }

    private String dtoDestinationCompanyName(CreateTripDto createTripDto) {
        TripLocationDto destination = createTripDto.getDestination();
        if ( destination == null ) {
            return null;
        }
        return destination.getCompanyName();
    }

    private String dtoDestinationAddress(CreateTripDto createTripDto) {
        TripLocationDto destination = createTripDto.getDestination();
        if ( destination == null ) {
            return null;
        }
        return destination.getAddress();
    }

    private String dtoDestinationCity(CreateTripDto createTripDto) {
        TripLocationDto destination = createTripDto.getDestination();
        if ( destination == null ) {
            return null;
        }
        return destination.getCity();
    }

    private String dtoDestinationProvince(CreateTripDto createTripDto) {
        TripLocationDto destination = createTripDto.getDestination();
        if ( destination == null ) {
            return null;
        }
        return destination.getProvince();
    }

    private String dtoDestinationPostalCode(CreateTripDto createTripDto) {
        TripLocationDto destination = createTripDto.getDestination();
        if ( destination == null ) {
            return null;
        }
        return destination.getPostalCode();
    }

    private String dtoDestinationCountry(CreateTripDto createTripDto) {
        TripLocationDto destination = createTripDto.getDestination();
        if ( destination == null ) {
            return null;
        }
        return destination.getCountry();
    }

    private Double dtoDestinationLat(CreateTripDto createTripDto) {
        TripLocationDto destination = createTripDto.getDestination();
        if ( destination == null ) {
            return null;
        }
        return destination.getLat();
    }

    private Double dtoDestinationLng(CreateTripDto createTripDto) {
        TripLocationDto destination = createTripDto.getDestination();
        if ( destination == null ) {
            return null;
        }
        return destination.getLng();
    }

    private String dtoCargoDescription(CreateTripDto createTripDto) {
        CargoInfoDto cargo = createTripDto.getCargo();
        if ( cargo == null ) {
            return null;
        }
        return cargo.getDescription();
    }

    private Double dtoCargoWeight(CreateTripDto createTripDto) {
        CargoInfoDto cargo = createTripDto.getCargo();
        if ( cargo == null ) {
            return null;
        }
        return cargo.getWeight();
    }

    private Double dtoCargoVolume(CreateTripDto createTripDto) {
        CargoInfoDto cargo = createTripDto.getCargo();
        if ( cargo == null ) {
            return null;
        }
        return cargo.getVolume();
    }

    private Integer dtoCargoPackages(CreateTripDto createTripDto) {
        CargoInfoDto cargo = createTripDto.getCargo();
        if ( cargo == null ) {
            return null;
        }
        return cargo.getPackages();
    }

    private Boolean dtoCargoIsADR(CreateTripDto createTripDto) {
        CargoInfoDto cargo = createTripDto.getCargo();
        if ( cargo == null ) {
            return null;
        }
        return cargo.getIsADR();
    }

    private Double dtoCargoTemperature(CreateTripDto createTripDto) {
        CargoInfoDto cargo = createTripDto.getCargo();
        if ( cargo == null ) {
            return null;
        }
        return cargo.getTemperature();
    }
}
