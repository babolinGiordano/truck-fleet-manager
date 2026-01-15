package com.truckfleet.repository;

import com.truckfleet.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, String> {
    Optional<Vehicle> findByPlate(String plate);
    List<Vehicle> findAllByOrderByCreatedAtDesc();
    boolean existsByPlate(String plate);
}
