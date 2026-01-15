package com.truckfleet.repository;

import com.truckfleet.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findAllByOrderByCreatedAtDesc();
    boolean existsByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByClientId(String clientId);
}
