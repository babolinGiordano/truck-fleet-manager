package com.truckfleet.service;

import com.truckfleet.common.exception.ResourceNotFoundException;
import com.truckfleet.dto.maintenance.CreateMaintenanceRecordDto;
import com.truckfleet.dto.maintenance.MaintenanceRecordResponseDto;
import com.truckfleet.dto.maintenance.UpdateMaintenanceRecordDto;
import com.truckfleet.entity.MaintenanceRecord;
import com.truckfleet.mapper.MaintenanceRecordMapper;
import com.truckfleet.repository.MaintenanceRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MaintenanceRecordService {

    private final MaintenanceRecordRepository maintenanceRecordRepository;
    private final MaintenanceRecordMapper maintenanceRecordMapper;

    @Transactional(readOnly = true)
    public List<MaintenanceRecordResponseDto> findAll() {
        return maintenanceRecordRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(maintenanceRecordMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public MaintenanceRecordResponseDto findById(String id) {
        MaintenanceRecord record = maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manutenzione", "ID", id));
        return maintenanceRecordMapper.toResponseDto(record);
    }

    public MaintenanceRecordResponseDto create(CreateMaintenanceRecordDto dto) {
        MaintenanceRecord record = maintenanceRecordMapper.toEntity(dto);
        MaintenanceRecord saved = maintenanceRecordRepository.save(record);
        return maintenanceRecordMapper.toResponseDto(saved);
    }

    public MaintenanceRecordResponseDto update(String id, UpdateMaintenanceRecordDto dto) {
        MaintenanceRecord record = maintenanceRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Manutenzione", "ID", id));

        maintenanceRecordMapper.updateEntityFromDto(dto, record);
        MaintenanceRecord updated = maintenanceRecordRepository.save(record);
        return maintenanceRecordMapper.toResponseDto(updated);
    }

    public void delete(String id) {
        if (!maintenanceRecordRepository.existsById(id)) {
            throw new ResourceNotFoundException("Manutenzione", "ID", id);
        }
        maintenanceRecordRepository.deleteById(id);
    }
}
