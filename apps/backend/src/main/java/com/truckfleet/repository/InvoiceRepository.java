package com.truckfleet.repository;

import com.truckfleet.entity.Invoice;
import com.truckfleet.entity.enums.InvoiceStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, String> {
    Optional<Invoice> findByInvoiceNumber(String invoiceNumber);
    List<Invoice> findAllByOrderByCreatedAtDesc();
    boolean existsByInvoiceNumber(String invoiceNumber);
    List<Invoice> findByClientId(String clientId);

    // Dashboard queries
    @Query("SELECT COALESCE(SUM(i.total), 0) FROM Invoice i WHERE i.status = 'PAID' AND i.paidDate >= :startOfMonth AND i.paidDate < :endOfMonth")
    BigDecimal sumRevenueForMonth(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);

    @Query("SELECT i FROM Invoice i LEFT JOIN FETCH i.client WHERE i.status IN :statuses AND i.dueDate <= :deadline ORDER BY i.dueDate ASC")
    List<Invoice> findDueInvoices(@Param("statuses") List<InvoiceStatus> statuses, @Param("deadline") LocalDateTime deadline);

    // Search query
    @Query("SELECT i FROM Invoice i LEFT JOIN FETCH i.client WHERE " +
           "LOWER(i.invoiceNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Invoice> search(@Param("query") String query, Pageable pageable);
}
