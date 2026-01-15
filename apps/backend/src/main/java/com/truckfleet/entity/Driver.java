package com.truckfleet.entity;

import com.truckfleet.entity.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "\"firstName\"", nullable = false)
    private String firstName;

    @Column(name = "\"lastName\"", nullable = false)
    private String lastName;

    @Column(name = "\"fiscalCode\"", unique = true, nullable = false)
    private String fiscalCode;

    @Column(nullable = false)
    private String phone;

    private String email;

    @Column(name = "\"licenseNumber\"", nullable = false)
    private String licenseNumber;

    @Column(name = "\"licenseExpiry\"", nullable = false)
    private LocalDateTime licenseExpiry;

    @Column(name = "\"cqcExpiry\"", nullable = false)
    private LocalDateTime cqcExpiry;

    @Column(name = "\"adrExpiry\"")
    private LocalDateTime adrExpiry;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status = DriverStatus.ACTIVE;

    @Column(name = "\"assignedVehicleId\"")
    private String assignedVehicleId;

    @Column(name = "\"hireDate\"", nullable = false)
    private LocalDateTime hireDate;

    private String notes;

    @CreationTimestamp
    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "\"updatedAt\"", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Trip> trips = new ArrayList<>();

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<FuelRecord> fuelRecords = new ArrayList<>();
}
