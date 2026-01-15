package com.truckfleet.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "\"companyName\"", nullable = false)
    private String companyName;

    @Column(name = "\"vatNumber\"", unique = true, nullable = false)
    private String vatNumber;

    @Column(name = "\"fiscalCode\"")
    private String fiscalCode;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String province;

    @Column(name = "\"postalCode\"", nullable = false)
    private String postalCode;

    @Column(nullable = false)
    @Builder.Default
    private String country = "Italia";

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    private String pec;

    @Column(name = "\"sdiCode\"")
    private String sdiCode;

    @Column(name = "\"contactPerson\"")
    private String contactPerson;

    private String notes;

    @Column(name = "\"isActive\"", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "\"createdAt\"", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "\"updatedAt\"", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Trip> trips = new ArrayList<>();

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Invoice> invoices = new ArrayList<>();
}
