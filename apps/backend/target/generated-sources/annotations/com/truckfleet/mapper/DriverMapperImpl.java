package com.truckfleet.mapper;

import com.truckfleet.dto.driver.CreateDriverDto;
import com.truckfleet.dto.driver.DriverResponseDto;
import com.truckfleet.dto.driver.UpdateDriverDto;
import com.truckfleet.entity.Driver;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-15T13:38:33+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class DriverMapperImpl implements DriverMapper {

    @Override
    public Driver toEntity(CreateDriverDto dto) {
        if ( dto == null ) {
            return null;
        }

        Driver.DriverBuilder driver = Driver.builder();

        driver.licenseExpiry( stringToLocalDateTime( dto.getLicenseExpiry() ) );
        driver.cqcExpiry( stringToLocalDateTime( dto.getCqcExpiry() ) );
        driver.adrExpiry( stringToLocalDateTime( dto.getAdrExpiry() ) );
        driver.hireDate( stringToLocalDateTime( dto.getHireDate() ) );
        driver.status( mapStatus( dto.getStatus() ) );
        driver.firstName( dto.getFirstName() );
        driver.lastName( dto.getLastName() );
        driver.fiscalCode( dto.getFiscalCode() );
        driver.phone( dto.getPhone() );
        driver.email( dto.getEmail() );
        driver.licenseNumber( dto.getLicenseNumber() );
        driver.assignedVehicleId( dto.getAssignedVehicleId() );
        driver.notes( dto.getNotes() );

        return driver.build();
    }

    @Override
    public DriverResponseDto toResponseDto(Driver entity) {
        if ( entity == null ) {
            return null;
        }

        DriverResponseDto driverResponseDto = new DriverResponseDto();

        driverResponseDto.setLicenseExpiry( localDateTimeToString( entity.getLicenseExpiry() ) );
        driverResponseDto.setCqcExpiry( localDateTimeToString( entity.getCqcExpiry() ) );
        driverResponseDto.setAdrExpiry( localDateTimeToString( entity.getAdrExpiry() ) );
        driverResponseDto.setHireDate( localDateTimeToString( entity.getHireDate() ) );
        driverResponseDto.setCreatedAt( localDateTimeToString( entity.getCreatedAt() ) );
        driverResponseDto.setUpdatedAt( localDateTimeToString( entity.getUpdatedAt() ) );
        driverResponseDto.setId( entity.getId() );
        driverResponseDto.setFirstName( entity.getFirstName() );
        driverResponseDto.setLastName( entity.getLastName() );
        driverResponseDto.setFiscalCode( entity.getFiscalCode() );
        driverResponseDto.setPhone( entity.getPhone() );
        driverResponseDto.setEmail( entity.getEmail() );
        driverResponseDto.setLicenseNumber( entity.getLicenseNumber() );
        driverResponseDto.setStatus( entity.getStatus() );
        driverResponseDto.setAssignedVehicleId( entity.getAssignedVehicleId() );
        driverResponseDto.setNotes( entity.getNotes() );

        return driverResponseDto;
    }

    @Override
    public void updateEntityFromDto(UpdateDriverDto dto, Driver entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getLicenseExpiry() != null ) {
            entity.setLicenseExpiry( stringToLocalDateTime( dto.getLicenseExpiry() ) );
        }
        if ( dto.getCqcExpiry() != null ) {
            entity.setCqcExpiry( stringToLocalDateTime( dto.getCqcExpiry() ) );
        }
        if ( dto.getAdrExpiry() != null ) {
            entity.setAdrExpiry( stringToLocalDateTime( dto.getAdrExpiry() ) );
        }
        if ( dto.getHireDate() != null ) {
            entity.setHireDate( stringToLocalDateTime( dto.getHireDate() ) );
        }
        if ( dto.getFirstName() != null ) {
            entity.setFirstName( dto.getFirstName() );
        }
        if ( dto.getLastName() != null ) {
            entity.setLastName( dto.getLastName() );
        }
        if ( dto.getFiscalCode() != null ) {
            entity.setFiscalCode( dto.getFiscalCode() );
        }
        if ( dto.getPhone() != null ) {
            entity.setPhone( dto.getPhone() );
        }
        if ( dto.getEmail() != null ) {
            entity.setEmail( dto.getEmail() );
        }
        if ( dto.getLicenseNumber() != null ) {
            entity.setLicenseNumber( dto.getLicenseNumber() );
        }
        if ( dto.getStatus() != null ) {
            entity.setStatus( dto.getStatus() );
        }
        if ( dto.getAssignedVehicleId() != null ) {
            entity.setAssignedVehicleId( dto.getAssignedVehicleId() );
        }
        if ( dto.getNotes() != null ) {
            entity.setNotes( dto.getNotes() );
        }
    }
}
