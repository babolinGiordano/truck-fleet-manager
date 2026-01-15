package com.truckfleet.entity;

import com.truckfleet.entity.enums.VehicleStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String plate;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private Integer year;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(name = "\"currentDriverId\"")
    private String currentDriverId;

    @Column(name = "\"lastLat\"")
    private Double lastLat;

    @Column(name = "\"lastLng\"")
    private Double lastLng;

    @Column(name = "\"lastPositionAt\"")
    private LocalDateTime lastPositionAt;

    @Column(name = "\"kmTotal\"", nullable = false)
    private Integer kmTotal = 0;

    @Column(name = "\"insuranceExpiry\"", nullable = false)
    private LocalDateTime insuranceExpiry;

    @Column(name = "\"revisionExpiry\"", nullable = false)
    private LocalDateTime revisionExpiry;

    private String notes;

    @CreationTimestamp
    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "\"updatedAt\"", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Trip> trips = new ArrayList<>();

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FuelRecord> fuelRecords = new ArrayList<>();

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MaintenanceRecord> maintenanceRecords = new ArrayList<>();
}
