package com.truckfleet.entity;

import com.truckfleet.entity.enums.MaintenanceStatus;
import com.truckfleet.entity.enums.MaintenanceType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "maintenance_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "\"vehicleId\"", nullable = false)
    private String vehicleId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenanceType type;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private Integer odometer;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal cost;

    private String workshop;

    @Column(name = "\"invoiceNumber\"")
    private String invoiceNumber;

    @Column(name = "\"nextMaintenanceDate\"")
    private LocalDateTime nextMaintenanceDate;

    @Column(name = "\"nextMaintenanceKm\"")
    private Integer nextMaintenanceKm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private MaintenanceStatus status = MaintenanceStatus.SCHEDULED;

    private String notes;

    @CreationTimestamp
    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "\"updatedAt\"", nullable = false)
    private LocalDateTime updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"vehicleId\"", insertable = false, updatable = false)
    private Vehicle vehicle;
}
