package com.truckfleet.service;

import com.truckfleet.common.exception.ResourceNotFoundException;
import com.truckfleet.dto.driver.CreateDriverDto;
import com.truckfleet.dto.driver.DriverResponseDto;
import com.truckfleet.dto.driver.UpdateDriverDto;
import com.truckfleet.entity.Driver;
import com.truckfleet.mapper.DriverMapper;
import com.truckfleet.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;

    @Transactional(readOnly = true)
    public List<DriverResponseDto> findAll() {
        return driverRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(driverMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public DriverResponseDto findById(String id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Autista", "ID", id));
        return driverMapper.toResponseDto(driver);
    }

    public DriverResponseDto create(CreateDriverDto dto) {
        Driver driver = driverMapper.toEntity(dto);
        Driver saved = driverRepository.save(driver);
        return driverMapper.toResponseDto(saved);
    }

    public DriverResponseDto update(String id, UpdateDriverDto dto) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Autista", "ID", id));

        driverMapper.updateEntityFromDto(dto, driver);
        Driver updated = driverRepository.save(driver);
        return driverMapper.toResponseDto(updated);
    }

    public void delete(String id) {
        if (!driverRepository.existsById(id)) {
            throw new ResourceNotFoundException("Autista", "ID", id);
        }
        driverRepository.deleteById(id);
    }
}
