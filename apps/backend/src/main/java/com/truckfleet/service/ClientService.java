package com.truckfleet.service;

import com.truckfleet.common.exception.ResourceNotFoundException;
import com.truckfleet.dto.client.ClientResponseDto;
import com.truckfleet.dto.client.CreateClientDto;
import com.truckfleet.dto.client.UpdateClientDto;
import com.truckfleet.entity.Client;
import com.truckfleet.mapper.ClientMapper;
import com.truckfleet.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final ClientMapper clientMapper;

    @Transactional(readOnly = true)
    public List<ClientResponseDto> findAll() {
        return clientRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(clientMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public ClientResponseDto findById(String id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "ID", id));
        return clientMapper.toResponseDto(client);
    }

    public ClientResponseDto create(CreateClientDto dto) {
        Client client = clientMapper.toEntity(dto);
        Client saved = clientRepository.save(client);
        return clientMapper.toResponseDto(saved);
    }

    public ClientResponseDto update(String id, UpdateClientDto dto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", "ID", id));

        clientMapper.updateEntityFromDto(dto, client);
        Client updated = clientRepository.save(client);
        return clientMapper.toResponseDto(updated);
    }

    public void delete(String id) {
        if (!clientRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cliente", "ID", id);
        }
        clientRepository.deleteById(id);
    }
}
