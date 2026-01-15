package com.truckfleet.mapper;

import com.truckfleet.dto.client.ClientResponseDto;
import com.truckfleet.dto.client.CreateClientDto;
import com.truckfleet.dto.client.UpdateClientDto;
import com.truckfleet.entity.Client;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-01-15T16:48:44+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class ClientMapperImpl implements ClientMapper {

    @Override
    public Client toEntity(CreateClientDto dto) {
        if ( dto == null ) {
            return null;
        }

        Client.ClientBuilder client = Client.builder();

        client.country( mapCountry( dto.getCountry() ) );
        client.isActive( mapIsActive( dto.getIsActive() ) );
        client.companyName( dto.getCompanyName() );
        client.vatNumber( dto.getVatNumber() );
        client.fiscalCode( dto.getFiscalCode() );
        client.address( dto.getAddress() );
        client.city( dto.getCity() );
        client.province( dto.getProvince() );
        client.postalCode( dto.getPostalCode() );
        client.phone( dto.getPhone() );
        client.email( dto.getEmail() );
        client.pec( dto.getPec() );
        client.sdiCode( dto.getSdiCode() );
        client.contactPerson( dto.getContactPerson() );
        client.notes( dto.getNotes() );

        return client.build();
    }

    @Override
    public ClientResponseDto toResponseDto(Client entity) {
        if ( entity == null ) {
            return null;
        }

        ClientResponseDto clientResponseDto = new ClientResponseDto();

        clientResponseDto.setCreatedAt( localDateTimeToString( entity.getCreatedAt() ) );
        clientResponseDto.setUpdatedAt( localDateTimeToString( entity.getUpdatedAt() ) );
        clientResponseDto.setId( entity.getId() );
        clientResponseDto.setCompanyName( entity.getCompanyName() );
        clientResponseDto.setVatNumber( entity.getVatNumber() );
        clientResponseDto.setFiscalCode( entity.getFiscalCode() );
        clientResponseDto.setAddress( entity.getAddress() );
        clientResponseDto.setCity( entity.getCity() );
        clientResponseDto.setProvince( entity.getProvince() );
        clientResponseDto.setPostalCode( entity.getPostalCode() );
        clientResponseDto.setCountry( entity.getCountry() );
        clientResponseDto.setPhone( entity.getPhone() );
        clientResponseDto.setEmail( entity.getEmail() );
        clientResponseDto.setPec( entity.getPec() );
        clientResponseDto.setSdiCode( entity.getSdiCode() );
        clientResponseDto.setContactPerson( entity.getContactPerson() );
        clientResponseDto.setNotes( entity.getNotes() );
        clientResponseDto.setIsActive( entity.getIsActive() );

        return clientResponseDto;
    }

    @Override
    public void updateEntityFromDto(UpdateClientDto dto, Client entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.getCompanyName() != null ) {
            entity.setCompanyName( dto.getCompanyName() );
        }
        if ( dto.getVatNumber() != null ) {
            entity.setVatNumber( dto.getVatNumber() );
        }
        if ( dto.getFiscalCode() != null ) {
            entity.setFiscalCode( dto.getFiscalCode() );
        }
        if ( dto.getAddress() != null ) {
            entity.setAddress( dto.getAddress() );
        }
        if ( dto.getCity() != null ) {
            entity.setCity( dto.getCity() );
        }
        if ( dto.getProvince() != null ) {
            entity.setProvince( dto.getProvince() );
        }
        if ( dto.getPostalCode() != null ) {
            entity.setPostalCode( dto.getPostalCode() );
        }
        if ( dto.getCountry() != null ) {
            entity.setCountry( dto.getCountry() );
        }
        if ( dto.getPhone() != null ) {
            entity.setPhone( dto.getPhone() );
        }
        if ( dto.getEmail() != null ) {
            entity.setEmail( dto.getEmail() );
        }
        if ( dto.getPec() != null ) {
            entity.setPec( dto.getPec() );
        }
        if ( dto.getSdiCode() != null ) {
            entity.setSdiCode( dto.getSdiCode() );
        }
        if ( dto.getContactPerson() != null ) {
            entity.setContactPerson( dto.getContactPerson() );
        }
        if ( dto.getNotes() != null ) {
            entity.setNotes( dto.getNotes() );
        }
        if ( dto.getIsActive() != null ) {
            entity.setIsActive( dto.getIsActive() );
        }
    }
}
