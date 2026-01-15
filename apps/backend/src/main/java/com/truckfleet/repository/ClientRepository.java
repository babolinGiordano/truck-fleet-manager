package com.truckfleet.repository;

import com.truckfleet.entity.Client;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, String> {
    Optional<Client> findByVatNumber(String vatNumber);
    List<Client> findAllByOrderByCreatedAtDesc();
    boolean existsByVatNumber(String vatNumber);

    // Search query
    @Query("SELECT c FROM Client c WHERE " +
           "LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.vatNumber) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Client> search(@Param("query") String query, Pageable pageable);
}
