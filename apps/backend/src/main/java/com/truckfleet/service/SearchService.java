package com.truckfleet.service;

import com.truckfleet.dto.search.SearchResponseDto;
import com.truckfleet.dto.search.SearchResultDto;
import com.truckfleet.entity.*;
import com.truckfleet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SearchService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final ClientRepository clientRepository;
    private final InvoiceRepository invoiceRepository;

    private static final int MAX_RESULTS_PER_CATEGORY = 5;

    public SearchResponseDto search(String query) {
        if (query == null || query.trim().length() < 2) {
            return SearchResponseDto.builder()
                    .trips(List.of())
                    .vehicles(List.of())
                    .drivers(List.of())
                    .clients(List.of())
                    .invoices(List.of())
                    .totalResults(0)
                    .build();
        }

        String searchQuery = query.trim();
        PageRequest pageRequest = PageRequest.of(0, MAX_RESULTS_PER_CATEGORY);

        List<SearchResultDto> trips = searchTrips(searchQuery, pageRequest);
        List<SearchResultDto> vehicles = searchVehicles(searchQuery, pageRequest);
        List<SearchResultDto> drivers = searchDrivers(searchQuery, pageRequest);
        List<SearchResultDto> clients = searchClients(searchQuery, pageRequest);
        List<SearchResultDto> invoices = searchInvoices(searchQuery, pageRequest);

        int total = trips.size() + vehicles.size() + drivers.size() + clients.size() + invoices.size();

        return SearchResponseDto.builder()
                .trips(trips)
                .vehicles(vehicles)
                .drivers(drivers)
                .clients(clients)
                .invoices(invoices)
                .totalResults(total)
                .build();
    }

    private List<SearchResultDto> searchTrips(String query, PageRequest pageRequest) {
        List<Trip> trips = tripRepository.search(query, pageRequest);
        return trips.stream()
                .map(trip -> SearchResultDto.builder()
                        .id(trip.getId())
                        .type("trip")
                        .title(trip.getTripNumber())
                        .subtitle(trip.getOriginCity() + " → " + trip.getDestCity())
                        .icon("local_shipping")
                        .link("/trips/" + trip.getId())
                        .build())
                .toList();
    }

    private List<SearchResultDto> searchVehicles(String query, PageRequest pageRequest) {
        List<Vehicle> vehicles = vehicleRepository.search(query, pageRequest);
        return vehicles.stream()
                .map(vehicle -> SearchResultDto.builder()
                        .id(vehicle.getId())
                        .type("vehicle")
                        .title(vehicle.getPlate())
                        .subtitle(vehicle.getBrand() + " " + vehicle.getModel())
                        .icon("directions_car")
                        .link("/vehicles/" + vehicle.getId())
                        .build())
                .toList();
    }

    private List<SearchResultDto> searchDrivers(String query, PageRequest pageRequest) {
        List<Driver> drivers = driverRepository.search(query, pageRequest);
        return drivers.stream()
                .map(driver -> SearchResultDto.builder()
                        .id(driver.getId())
                        .type("driver")
                        .title(driver.getFirstName() + " " + driver.getLastName())
                        .subtitle(driver.getPhone())
                        .icon("person")
                        .link("/drivers/" + driver.getId())
                        .build())
                .toList();
    }

    private List<SearchResultDto> searchClients(String query, PageRequest pageRequest) {
        List<Client> clients = clientRepository.search(query, pageRequest);
        return clients.stream()
                .map(client -> SearchResultDto.builder()
                        .id(client.getId())
                        .type("client")
                        .title(client.getCompanyName())
                        .subtitle(client.getVatNumber())
                        .icon("business")
                        .link("/clients/" + client.getId())
                        .build())
                .toList();
    }

    private List<SearchResultDto> searchInvoices(String query, PageRequest pageRequest) {
        List<Invoice> invoices = invoiceRepository.search(query, pageRequest);
        return invoices.stream()
                .map(invoice -> SearchResultDto.builder()
                        .id(invoice.getId())
                        .type("invoice")
                        .title(invoice.getInvoiceNumber())
                        .subtitle(invoice.getClient() != null ? invoice.getClient().getCompanyName() : "N/D")
                        .icon("receipt")
                        .link("/invoices/" + invoice.getId())
                        .build())
                .toList();
    }
}
