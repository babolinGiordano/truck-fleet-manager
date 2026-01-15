package com.truckfleet.service;

import com.truckfleet.dto.dashboard.*;
import com.truckfleet.entity.*;
import com.truckfleet.entity.enums.InvoiceStatus;
import com.truckfleet.entity.enums.MaintenanceStatus;
import com.truckfleet.entity.enums.TripStatus;
import com.truckfleet.entity.enums.VehicleStatus;
import com.truckfleet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final InvoiceRepository invoiceRepository;
    private final DriverRepository driverRepository;
    private final MaintenanceRecordRepository maintenanceRecordRepository;

    private static final String[] MONTHS_IT = {"Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"};

    public DashboardResponseDto getDashboardData() {
        return DashboardResponseDto.builder()
                .stats(getStats())
                .alerts(getAlerts())
                .recentTrips(getRecentTrips())
                .chartData(getChartData())
                .build();
    }

    private DashboardStatsDto getStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = today.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        LocalDateTime startOfPrevMonth = today.minusMonths(1).withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfPrevMonth = startOfMonth;

        // Current month stats
        Long tripsToday = tripRepository.countTripsToday(startOfDay, endOfDay);
        Long vehiclesInTransit = vehicleRepository.countByStatus(VehicleStatus.IN_TRANSIT);
        Long kmThisMonth = tripRepository.sumKmForMonth(startOfMonth, endOfMonth);
        BigDecimal revenueThisMonth = invoiceRepository.sumRevenueForMonth(startOfMonth, endOfMonth);
        if (revenueThisMonth == null) {
            revenueThisMonth = BigDecimal.ZERO;
        }

        // Previous month stats for trend calculation
        Long kmPrevMonth = tripRepository.sumKmForMonth(startOfPrevMonth, endOfPrevMonth);
        BigDecimal revenuePrevMonth = invoiceRepository.sumRevenueForMonth(startOfPrevMonth, endOfPrevMonth);
        if (revenuePrevMonth == null) {
            revenuePrevMonth = BigDecimal.ZERO;
        }

        // Calculate trends
        Double kmTrend = calculateTrend(kmThisMonth, kmPrevMonth);
        Double revenueTrend = calculateTrend(revenueThisMonth, revenuePrevMonth);

        // Trip trend (compare trips this month vs previous month)
        Long tripsThisMonth = tripRepository.countByStatus(TripStatus.COMPLETED);
        Double tripsTrend = 0.0; // Simplified: would need monthly comparison

        return DashboardStatsDto.builder()
                .tripsToday(tripsToday)
                .vehiclesInTransit(vehiclesInTransit)
                .kmThisMonth(kmThisMonth)
                .revenueThisMonth(revenueThisMonth)
                .tripsTrend(tripsTrend)
                .kmTrend(kmTrend)
                .revenueTrend(revenueTrend)
                .build();
    }

    private Double calculateTrend(Long current, Long previous) {
        if (previous == null || previous == 0) {
            return current != null && current > 0 ? 100.0 : 0.0;
        }
        return ((current.doubleValue() - previous.doubleValue()) / previous.doubleValue()) * 100;
    }

    private Double calculateTrend(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return current != null && current.compareTo(BigDecimal.ZERO) > 0 ? 100.0 : 0.0;
        }
        return current.subtract(previous)
                .divide(previous, 4, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"))
                .doubleValue();
    }

    private List<DashboardAlertDto> getAlerts() {
        List<DashboardAlertDto> alerts = new ArrayList<>();
        LocalDateTime deadline30Days = LocalDateTime.now().plusDays(30);
        LocalDateTime deadline7Days = LocalDateTime.now().plusDays(7);

        // Driver license expiring alerts
        List<Driver> driversWithExpiringDocs = driverRepository.findWithExpiringDocuments(deadline30Days);
        for (Driver driver : driversWithExpiringDocs) {
            String expiringDoc = getExpiringDriverDoc(driver, deadline30Days);
            if (expiringDoc != null) {
                long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), getEarliestDriverExpiry(driver).toLocalDate());
                String severity = daysUntil <= 7 ? "danger" : "warning";
                alerts.add(DashboardAlertDto.builder()
                        .id("driver-" + driver.getId())
                        .type(severity)
                        .icon("badge")
                        .title(expiringDoc + " in scadenza")
                        .description(driver.getFirstName() + " " + driver.getLastName() + " - scade tra " + daysUntil + " giorni")
                        .link("/drivers/" + driver.getId())
                        .build());
            }
        }

        // Vehicle documents expiring alerts
        List<Vehicle> vehiclesWithExpiringDocs = vehicleRepository.findWithExpiringDocuments(deadline30Days);
        for (Vehicle vehicle : vehiclesWithExpiringDocs) {
            String expiringDoc = getExpiringVehicleDoc(vehicle, deadline30Days);
            if (expiringDoc != null) {
                LocalDateTime earliest = getEarliestVehicleExpiry(vehicle);
                long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), earliest.toLocalDate());
                String severity = daysUntil <= 7 ? "danger" : "warning";
                alerts.add(DashboardAlertDto.builder()
                        .id("vehicle-" + vehicle.getId())
                        .type(severity)
                        .icon("directions_car")
                        .title(expiringDoc + " in scadenza")
                        .description(vehicle.getPlate() + " - scade tra " + daysUntil + " giorni")
                        .link("/vehicles/" + vehicle.getId())
                        .build());
            }
        }

        // Scheduled maintenance alerts
        List<MaintenanceRecord> scheduledMaintenance = maintenanceRecordRepository.findScheduledMaintenance(
                MaintenanceStatus.SCHEDULED, deadline30Days);
        for (MaintenanceRecord maintenance : scheduledMaintenance) {
            if (maintenance.getNextMaintenanceDate() != null) {
                long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), maintenance.getNextMaintenanceDate().toLocalDate());
                String severity = daysUntil <= 7 ? "warning" : "info";
                String vehiclePlate = maintenance.getVehicle() != null ? maintenance.getVehicle().getPlate() : "N/D";
                alerts.add(DashboardAlertDto.builder()
                        .id("maintenance-" + maintenance.getId())
                        .type(severity)
                        .icon("build")
                        .title("Manutenzione programmata")
                        .description(vehiclePlate + " - " + maintenance.getDescription())
                        .link("/maintenance")
                        .build());
            }
        }

        // Invoice due alerts
        List<Invoice> dueInvoices = invoiceRepository.findDueInvoices(
                List.of(InvoiceStatus.SENT, InvoiceStatus.OVERDUE), deadline7Days);
        for (Invoice invoice : dueInvoices) {
            long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), invoice.getDueDate().toLocalDate());
            String severity = daysUntil < 0 ? "danger" : "warning";
            String clientName = invoice.getClient() != null ? invoice.getClient().getCompanyName() : "N/D";
            String description = daysUntil < 0
                    ? invoice.getInvoiceNumber() + " - " + clientName + " (scaduta)"
                    : invoice.getInvoiceNumber() + " - " + clientName;
            alerts.add(DashboardAlertDto.builder()
                    .id("invoice-" + invoice.getId())
                    .type(severity)
                    .icon("receipt_long")
                    .title("Fattura in scadenza")
                    .description(description)
                    .link("/invoices/" + invoice.getId())
                    .build());
        }

        // Sort by severity (danger first, then warning, then info) and limit to 10
        alerts.sort((a, b) -> {
            int severityA = getSeverityOrder(a.getType());
            int severityB = getSeverityOrder(b.getType());
            return Integer.compare(severityA, severityB);
        });

        return alerts.size() > 10 ? alerts.subList(0, 10) : alerts;
    }

    private int getSeverityOrder(String type) {
        return switch (type) {
            case "danger" -> 0;
            case "warning" -> 1;
            default -> 2;
        };
    }

    private String getExpiringDriverDoc(Driver driver, LocalDateTime deadline) {
        if (driver.getLicenseExpiry() != null && driver.getLicenseExpiry().isBefore(deadline)) {
            return "Patente";
        }
        if (driver.getCqcExpiry() != null && driver.getCqcExpiry().isBefore(deadline)) {
            return "CQC";
        }
        if (driver.getAdrExpiry() != null && driver.getAdrExpiry().isBefore(deadline)) {
            return "ADR";
        }
        return null;
    }

    private LocalDateTime getEarliestDriverExpiry(Driver driver) {
        LocalDateTime earliest = driver.getLicenseExpiry();
        if (driver.getCqcExpiry() != null && (earliest == null || driver.getCqcExpiry().isBefore(earliest))) {
            earliest = driver.getCqcExpiry();
        }
        if (driver.getAdrExpiry() != null && (earliest == null || driver.getAdrExpiry().isBefore(earliest))) {
            earliest = driver.getAdrExpiry();
        }
        return earliest;
    }

    private String getExpiringVehicleDoc(Vehicle vehicle, LocalDateTime deadline) {
        if (vehicle.getInsuranceExpiry() != null && vehicle.getInsuranceExpiry().isBefore(deadline)) {
            return "Assicurazione";
        }
        if (vehicle.getRevisionExpiry() != null && vehicle.getRevisionExpiry().isBefore(deadline)) {
            return "Revisione";
        }
        return null;
    }

    private LocalDateTime getEarliestVehicleExpiry(Vehicle vehicle) {
        LocalDateTime earliest = vehicle.getInsuranceExpiry();
        if (vehicle.getRevisionExpiry() != null && (earliest == null || vehicle.getRevisionExpiry().isBefore(earliest))) {
            earliest = vehicle.getRevisionExpiry();
        }
        return earliest;
    }

    private List<RecentTripDto> getRecentTrips() {
        List<Trip> trips = tripRepository.findRecentTripsWithDetails(PageRequest.of(0, 5));
        return trips.stream()
                .map(trip -> RecentTripDto.builder()
                        .id(trip.getId())
                        .route(trip.getOriginCity() + " → " + trip.getDestCity())
                        .client(trip.getClient() != null ? trip.getClient().getCompanyName() : "N/D")
                        .vehicle(trip.getVehicle() != null ? trip.getVehicle().getPlate() : "N/D")
                        .status(trip.getStatus().getValue())
                        .price(trip.getPrice())
                        .km(trip.getKmActual() != null ? trip.getKmActual() : trip.getKmPlanned())
                        .build())
                .toList();
    }

    private List<MonthlyTripDataDto> getChartData() {
        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();

        // Get trip counts by month
        List<Object[]> monthlyData = tripRepository.countTripsByMonth(currentYear);
        Map<Integer, Long> tripsByMonth = new HashMap<>();
        for (Object[] row : monthlyData) {
            Integer month = (Integer) row[0];
            Long count = (Long) row[1];
            tripsByMonth.put(month, count);
        }

        List<MonthlyTripDataDto> chartData = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            Long value = tripsByMonth.getOrDefault(month, 0L);
            boolean isProjection = month > currentMonth;

            chartData.add(MonthlyTripDataDto.builder()
                    .month(MONTHS_IT[month - 1])
                    .value(value)
                    .isProjection(isProjection)
                    .build());
        }

        return chartData;
    }
}
