package com.truckfleet.entity;

import com.truckfleet.entity.enums.InvoiceStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "\"invoiceNumber\"", unique = true, nullable = false)
    private String invoiceNumber;

    @Column(name = "\"clientId\"", nullable = false)
    private String clientId;

    @Column(name = "\"issueDate\"", nullable = false)
    private LocalDateTime issueDate;

    @Column(name = "\"dueDate\"", nullable = false)
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "\"vatRate\"", nullable = false, precision = 5, scale = 2)
    @Builder.Default
    private BigDecimal vatRate = new BigDecimal("22");

    @Column(name = "\"vatAmount\"", nullable = false, precision = 10, scale = 2)
    private BigDecimal vatAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal total;

    private String notes;

    @Column(name = "\"paidDate\"")
    private LocalDateTime paidDate;

    @CreationTimestamp
    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "\"updatedAt\"", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"clientId\"", insertable = false, updatable = false)
    private Client client;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<InvoiceItem> items = new ArrayList<>();
}
