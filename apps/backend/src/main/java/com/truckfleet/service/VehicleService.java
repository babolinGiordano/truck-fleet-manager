package com.truckfleet.service;

import com.truckfleet.common.exception.ResourceNotFoundException;
import com.truckfleet.dto.vehicle.CreateVehicleDto;
import com.truckfleet.dto.vehicle.UpdateVehicleDto;
import com.truckfleet.dto.vehicle.VehicleResponseDto;
import com.truckfleet.entity.Vehicle;
import com.truckfleet.mapper.VehicleMapper;
import com.truckfleet.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    @Transactional(readOnly = true)
    public List<VehicleResponseDto> findAll() {
        return vehicleRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(vehicleMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public VehicleResponseDto findById(String id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veicolo", "ID", id));
        return vehicleMapper.toResponseDto(vehicle);
    }

    public VehicleResponseDto create(CreateVehicleDto dto) {
        Vehicle vehicle = vehicleMapper.toEntity(dto);

        if (dto.getLastLat() != null && dto.getLastLng() != null) {
            vehicle.setLastPositionAt(LocalDateTime.now());
        }

        Vehicle saved = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponseDto(saved);
    }

    public VehicleResponseDto update(String id, UpdateVehicleDto dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veicolo", "ID", id));

        vehicleMapper.updateEntityFromDto(dto, vehicle);

        if (dto.getLastLat() != null && dto.getLastLng() != null) {
            vehicle.setLastPositionAt(LocalDateTime.now());
        }

        Vehicle updated = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponseDto(updated);
    }

    public void delete(String id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Veicolo", "ID", id);
        }
        vehicleRepository.deleteById(id);
    }
}
