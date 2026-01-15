package com.truckfleet.entity;

import com.truckfleet.entity.enums.FuelType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "fuel_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "\"vehicleId\"", nullable = false)
    private String vehicleId;

    @Column(name = "\"driverId\"")
    private String driverId;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal liters;

    @Column(name = "\"pricePerLiter\"", nullable = false, precision = 10, scale = 4)
    private BigDecimal pricePerLiter;

    @Column(name = "\"totalCost\"", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalCost;

    @Enumerated(EnumType.STRING)
    @Column(name = "\"fuelType\"", nullable = false)
    @Builder.Default
    private FuelType fuelType = FuelType.DIESEL;

    @Column(name = "\"stationName\"")
    private String stationName;

    @Column(nullable = false)
    private Integer odometer;

    @Column(name = "\"fullTank\"", nullable = false)
    @Builder.Default
    private Boolean fullTank = true;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"driverId\"", insertable = false, updatable = false)
    private Driver driver;
}
