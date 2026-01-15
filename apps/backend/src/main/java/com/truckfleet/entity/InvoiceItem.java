package com.truckfleet.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "invoice_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "\"invoiceId\"", nullable = false)
    private String invoiceId;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private Integer quantity = 1;

    @Column(name = "\"unitPrice\"", nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "\"totalPrice\"", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @Column(name = "\"tripId\"")
    private String tripId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"invoiceId\"", insertable = false, updatable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"tripId\"", insertable = false, updatable = false)
    private Trip trip;
}
