package com.truckfleet.repository;

import com.truckfleet.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TripRepository extends JpaRepository<Trip, String> {
    Optional<Trip> findByTripNumber(String tripNumber);
    List<Trip> findAllByOrderByCreatedAtDesc();
    boolean existsByTripNumber(String tripNumber);
    List<Trip> findByVehicleId(String vehicleId);
    List<Trip> findByDriverId(String driverId);
    List<Trip> findByClientId(String clientId);
}
