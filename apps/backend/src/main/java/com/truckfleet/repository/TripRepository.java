package com.truckfleet.repository;

import com.truckfleet.entity.Trip;
import com.truckfleet.entity.enums.TripStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    // Dashboard queries
    @Query("SELECT COUNT(t) FROM Trip t WHERE t.plannedDeparture >= :startOfDay AND t.plannedDeparture < :endOfDay")
    Long countTripsToday(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT COUNT(t) FROM Trip t WHERE t.status = :status")
    Long countByStatus(@Param("status") TripStatus status);

    @Query("SELECT COALESCE(SUM(t.kmActual), 0) FROM Trip t WHERE t.status = 'COMPLETED' AND t.actualArrival >= :startOfMonth AND t.actualArrival < :endOfMonth")
    Long sumKmForMonth(@Param("startOfMonth") LocalDateTime startOfMonth, @Param("endOfMonth") LocalDateTime endOfMonth);

    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.client LEFT JOIN FETCH t.vehicle ORDER BY t.createdAt DESC")
    List<Trip> findRecentTripsWithDetails(Pageable pageable);

    @Query("SELECT MONTH(t.plannedDeparture) as month, COUNT(t) as count FROM Trip t WHERE YEAR(t.plannedDeparture) = :year GROUP BY MONTH(t.plannedDeparture) ORDER BY month")
    List<Object[]> countTripsByMonth(@Param("year") int year);

    // Search query
    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.client WHERE " +
           "LOWER(t.tripNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.originCity) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(t.destCity) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Trip> search(@Param("query") String query, Pageable pageable);
}
