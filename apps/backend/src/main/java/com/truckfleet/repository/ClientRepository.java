package com.truckfleet.repository;

import com.truckfleet.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, String> {
    Optional<Client> findByVatNumber(String vatNumber);
    List<Client> findAllByOrderByCreatedAtDesc();
    boolean existsByVatNumber(String vatNumber);
}
