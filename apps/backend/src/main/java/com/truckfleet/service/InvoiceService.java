package com.truckfleet.service;

import com.truckfleet.common.exception.ResourceNotFoundException;
import com.truckfleet.dto.invoice.CreateInvoiceDto;
import com.truckfleet.dto.invoice.InvoiceItemDto;
import com.truckfleet.dto.invoice.InvoiceResponseDto;
import com.truckfleet.dto.invoice.UpdateInvoiceDto;
import com.truckfleet.entity.Invoice;
import com.truckfleet.entity.InvoiceItem;
import com.truckfleet.mapper.InvoiceMapper;
import com.truckfleet.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    @Transactional(readOnly = true)
    public List<InvoiceResponseDto> findAll() {
        return invoiceRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(invoiceMapper::toResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public InvoiceResponseDto findById(String id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fattura", "ID", id));
        return invoiceMapper.toResponseDto(invoice);
    }

    public InvoiceResponseDto create(CreateInvoiceDto dto) {
        Invoice invoice = invoiceMapper.toEntity(dto);

        // Create and associate items
        if (dto.getItems() != null) {
            List<InvoiceItem> items = dto.getItems().stream()
                    .map(itemDto -> {
                        InvoiceItem item = invoiceMapper.toItemEntity(itemDto);
                        item.setInvoiceId(invoice.getId());
                        return item;
                    })
                    .toList();
            invoice.setItems(items);
        }

        Invoice saved = invoiceRepository.save(invoice);
        return invoiceMapper.toResponseDto(saved);
    }

    public InvoiceResponseDto update(String id, UpdateInvoiceDto dto) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fattura", "ID", id));

        // Update basic fields
        if (dto.getInvoiceNumber() != null) invoice.setInvoiceNumber(dto.getInvoiceNumber());
        if (dto.getClientId() != null) invoice.setClientId(dto.getClientId());
        if (dto.getStatus() != null) invoice.setStatus(dto.getStatus());
        if (dto.getSubtotal() != null) invoice.setSubtotal(dto.getSubtotal());
        if (dto.getVatRate() != null) invoice.setVatRate(dto.getVatRate());
        if (dto.getVatAmount() != null) invoice.setVatAmount(dto.getVatAmount());
        if (dto.getTotal() != null) invoice.setTotal(dto.getTotal());
        if (dto.getNotes() != null) invoice.setNotes(dto.getNotes());

        // Update dates
        if (dto.getIssueDate() != null) {
            invoice.setIssueDate(LocalDateTime.parse(dto.getIssueDate()));
        }
        if (dto.getDueDate() != null) {
            invoice.setDueDate(LocalDateTime.parse(dto.getDueDate()));
        }
        if (dto.getPaidDate() != null) {
            invoice.setPaidDate(LocalDateTime.parse(dto.getPaidDate()));
        }

        // Update items if provided
        if (dto.getItems() != null) {
            invoice.getItems().clear();
            for (InvoiceItemDto itemDto : dto.getItems()) {
                InvoiceItem item = invoiceMapper.toItemEntity(itemDto);
                item.setInvoiceId(invoice.getId());
                invoice.getItems().add(item);
            }
        }

        Invoice updated = invoiceRepository.save(invoice);
        return invoiceMapper.toResponseDto(updated);
    }

    public void delete(String id) {
        if (!invoiceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fattura", "ID", id);
        }
        invoiceRepository.deleteById(id);
    }
}
