package com.truckfleet.entity;

import com.truckfleet.entity.enums.TripStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "\"tripNumber\"", unique = true, nullable = false)
    private String tripNumber;

    @Column(name = "\"vehicleId\"", nullable = false)
    private String vehicleId;

    @Column(name = "\"driverId\"", nullable = false)
    private String driverId;

    @Column(name = "\"clientId\"", nullable = false)
    private String clientId;

    // Origin fields
    @Column(name = "\"originCompany\"")
    private String originCompany;

    @Column(name = "\"originAddress\"", nullable = false)
    private String originAddress;

    @Column(name = "\"originCity\"", nullable = false)
    private String originCity;

    @Column(name = "\"originProvince\"", nullable = false)
    private String originProvince;

    @Column(name = "\"originPostalCode\"", nullable = false)
    private String originPostalCode;

    @Column(name = "\"originCountry\"", nullable = false)
    @Builder.Default
    private String originCountry = "Italia";

    @Column(name = "\"originLat\"")
    private Double originLat;

    @Column(name = "\"originLng\"")
    private Double originLng;

    // Destination fields
    @Column(name = "\"destCompany\"")
    private String destCompany;

    @Column(name = "\"destAddress\"", nullable = false)
    private String destAddress;

    @Column(name = "\"destCity\"", nullable = false)
    private String destCity;

    @Column(name = "\"destProvince\"", nullable = false)
    private String destProvince;

    @Column(name = "\"destPostalCode\"", nullable = false)
    private String destPostalCode;

    @Column(name = "\"destCountry\"", nullable = false)
    @Builder.Default
    private String destCountry = "Italia";

    @Column(name = "\"destLat\"")
    private Double destLat;

    @Column(name = "\"destLng\"")
    private Double destLng;

    // Cargo fields
    @Column(name = "\"cargoDescription\"", nullable = false)
    private String cargoDescription;

    @Column(name = "\"cargoWeight\"", nullable = false)
    private Double cargoWeight;

    @Column(name = "\"cargoVolume\"")
    private Double cargoVolume;

    @Column(name = "\"cargoPackages\"")
    private Integer cargoPackages;

    @Column(name = "\"cargoIsADR\"", nullable = false)
    @Builder.Default
    private Boolean cargoIsADR = false;

    @Column(name = "\"cargoTemperature\"")
    private Double cargoTemperature;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TripStatus status = TripStatus.PLANNED;

    @Column(name = "\"plannedDeparture\"", nullable = false)
    private LocalDateTime plannedDeparture;

    @Column(name = "\"actualDeparture\"")
    private LocalDateTime actualDeparture;

    @Column(name = "\"plannedArrival\"", nullable = false)
    private LocalDateTime plannedArrival;

    @Column(name = "\"actualArrival\"")
    private LocalDateTime actualArrival;

    @Column(name = "\"kmPlanned\"", nullable = false)
    private Integer kmPlanned;

    @Column(name = "\"kmActual\"")
    private Integer kmActual;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "\"clientId\"", insertable = false, updatable = false)
    private Client client;

    @OneToMany(mappedBy = "trip")
    @Builder.Default
    private List<InvoiceItem> invoiceItems = new ArrayList<>();
}
