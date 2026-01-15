package com.truckfleet.service;

import com.truckfleet.common.exception.ResourceNotFoundException;
import com.truckfleet.dto.trip.CreateTripDto;
import com.truckfleet.dto.trip.TripResponseDto;
import com.truckfleet.dto.trip.UpdateTripDto;
import com.truckfleet.entity.Trip;
import com.truckfleet.mapper.TripMapper;
import com.truckfleet.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TripService {

    private final TripRepository tripRepository;
    private final TripMapper tripMapper;

    @Transactional(readOnly = true)
    public List<TripResponseDto> findAll() {
        return tripRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(tripMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public TripResponseDto findById(String id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viaggio", "ID", id));
        return tripMapper.toResponseDto(trip);
    }

    public TripResponseDto create(CreateTripDto dto) {
        Trip trip = tripMapper.toEntity(dto);
        Trip saved = tripRepository.save(trip);
        return tripMapper.toResponseDto(saved);
    }

    public TripResponseDto update(String id, UpdateTripDto dto) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viaggio", "ID", id));

        // Update basic fields
        if (dto.getTripNumber() != null) trip.setTripNumber(dto.getTripNumber());
        if (dto.getVehicleId() != null) trip.setVehicleId(dto.getVehicleId());
        if (dto.getDriverId() != null) trip.setDriverId(dto.getDriverId());
        if (dto.getClientId() != null) trip.setClientId(dto.getClientId());
        if (dto.getStatus() != null) trip.setStatus(dto.getStatus());
        if (dto.getKmPlanned() != null) trip.setKmPlanned(dto.getKmPlanned());
        if (dto.getKmActual() != null) trip.setKmActual(dto.getKmActual());
        if (dto.getPrice() != null) trip.setPrice(dto.getPrice());
        if (dto.getNotes() != null) trip.setNotes(dto.getNotes());

        // Update dates
        if (dto.getPlannedDeparture() != null) {
            trip.setPlannedDeparture(LocalDateTime.parse(dto.getPlannedDeparture()));
        }
        if (dto.getActualDeparture() != null) {
            trip.setActualDeparture(LocalDateTime.parse(dto.getActualDeparture()));
        }
        if (dto.getPlannedArrival() != null) {
            trip.setPlannedArrival(LocalDateTime.parse(dto.getPlannedArrival()));
        }
        if (dto.getActualArrival() != null) {
            trip.setActualArrival(LocalDateTime.parse(dto.getActualArrival()));
        }

        // Update origin
        if (dto.getOrigin() != null) {
            if (dto.getOrigin().getCompanyName() != null) trip.setOriginCompany(dto.getOrigin().getCompanyName());
            if (dto.getOrigin().getAddress() != null) trip.setOriginAddress(dto.getOrigin().getAddress());
            if (dto.getOrigin().getCity() != null) trip.setOriginCity(dto.getOrigin().getCity());
            if (dto.getOrigin().getProvince() != null) trip.setOriginProvince(dto.getOrigin().getProvince());
            if (dto.getOrigin().getPostalCode() != null) trip.setOriginPostalCode(dto.getOrigin().getPostalCode());
            if (dto.getOrigin().getCountry() != null) trip.setOriginCountry(dto.getOrigin().getCountry());
            if (dto.getOrigin().getLat() != null) trip.setOriginLat(dto.getOrigin().getLat());
            if (dto.getOrigin().getLng() != null) trip.setOriginLng(dto.getOrigin().getLng());
        }

        // Update destination
        if (dto.getDestination() != null) {
            if (dto.getDestination().getCompanyName() != null) trip.setDestCompany(dto.getDestination().getCompanyName());
            if (dto.getDestination().getAddress() != null) trip.setDestAddress(dto.getDestination().getAddress());
            if (dto.getDestination().getCity() != null) trip.setDestCity(dto.getDestination().getCity());
            if (dto.getDestination().getProvince() != null) trip.setDestProvince(dto.getDestination().getProvince());
            if (dto.getDestination().getPostalCode() != null) trip.setDestPostalCode(dto.getDestination().getPostalCode());
            if (dto.getDestination().getCountry() != null) trip.setDestCountry(dto.getDestination().getCountry());
            if (dto.getDestination().getLat() != null) trip.setDestLat(dto.getDestination().getLat());
            if (dto.getDestination().getLng() != null) trip.setDestLng(dto.getDestination().getLng());
        }

        // Update cargo
        if (dto.getCargo() != null) {
            if (dto.getCargo().getDescription() != null) trip.setCargoDescription(dto.getCargo().getDescription());
            if (dto.getCargo().getWeight() != null) trip.setCargoWeight(dto.getCargo().getWeight());
            if (dto.getCargo().getVolume() != null) trip.setCargoVolume(dto.getCargo().getVolume());
            if (dto.getCargo().getPackages() != null) trip.setCargoPackages(dto.getCargo().getPackages());
            if (dto.getCargo().getIsADR() != null) trip.setCargoIsADR(dto.getCargo().getIsADR());
            if (dto.getCargo().getTemperature() != null) trip.setCargoTemperature(dto.getCargo().getTemperature());
        }

        Trip updated = tripRepository.save(trip);
        return tripMapper.toResponseDto(updated);
    }

    public void delete(String id) {
        if (!tripRepository.existsById(id)) {
            throw new ResourceNotFoundException("Viaggio", "ID", id);
        }
        tripRepository.deleteById(id);
    }
}
