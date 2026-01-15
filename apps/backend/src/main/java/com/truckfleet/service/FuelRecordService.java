package com.truckfleet.service;

import com.truckfleet.common.exception.ResourceNotFoundException;
import com.truckfleet.dto.fuel.CreateFuelRecordDto;
import com.truckfleet.dto.fuel.FuelRecordResponseDto;
import com.truckfleet.dto.fuel.UpdateFuelRecordDto;
import com.truckfleet.entity.FuelRecord;
import com.truckfleet.mapper.FuelRecordMapper;
import com.truckfleet.repository.FuelRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FuelRecordService {

    private final FuelRecordRepository fuelRecordRepository;
    private final FuelRecordMapper fuelRecordMapper;

    @Transactional(readOnly = true)
    public List<FuelRecordResponseDto> findAll() {
        return fuelRecordRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(fuelRecordMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public FuelRecordResponseDto findById(String id) {
        FuelRecord fuelRecord = fuelRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rifornimento", "ID", id));
        return fuelRecordMapper.toResponseDto(fuelRecord);
    }

    public FuelRecordResponseDto create(CreateFuelRecordDto dto) {
        FuelRecord fuelRecord = fuelRecordMapper.toEntity(dto);
        FuelRecord saved = fuelRecordRepository.save(fuelRecord);
        return fuelRecordMapper.toResponseDto(saved);
    }

    public FuelRecordResponseDto update(String id, UpdateFuelRecordDto dto) {
        FuelRecord fuelRecord = fuelRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rifornimento", "ID", id));

        fuelRecordMapper.updateEntityFromDto(dto, fuelRecord);
        FuelRecord updated = fuelRecordRepository.save(fuelRecord);
        return fuelRecordMapper.toResponseDto(updated);
    }

    public void delete(String id) {
        if (!fuelRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Rifornimento", "ID", id);
        }
        fuelRecordRepository.deleteById(id);
    }
}
