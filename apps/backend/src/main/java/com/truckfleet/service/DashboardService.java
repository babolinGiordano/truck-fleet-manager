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

    /** Documents are surfaced up to 90 days ahead; within 30 they are flagged as urgent. */
    private static final int EXPIRY_WINDOW_DAYS = 90;
    private static final int URGENT_WITHIN_DAYS = 30;

    public DashboardResponseDto getDashboardData(Integer requestedYear) {
        List<Integer> availableYears = getAvailableYears();
        int chartYear = resolveChartYear(requestedYear, availableYears);

        return DashboardResponseDto.builder()
                .stats(getStats())
                .alerts(getAlerts())
                .recentTrips(getRecentTrips())
                .chartData(getChartData(chartYear))
                .chartYear(chartYear)
                .availableYears(availableYears)
                .liveVehicles(getLiveVehicles())
                .build();
    }

    /** Vehicles on an in-progress trip, with their last known position. */
    private List<LiveVehicleDto> getLiveVehicles() {
        return tripRepository.findActiveTripsWithPosition(TripStatus.IN_PROGRESS).stream()
                .map(trip -> {
                    Vehicle vehicle = trip.getVehicle();
                    return LiveVehicleDto.builder()
                            .vehicleId(vehicle.getId())
                            .tripId(trip.getId())
                            .plate(vehicle.getPlate())
                            .lat(vehicle.getLastLat())
                            .lng(vehicle.getLastLng())
                            .route(trip.getOriginCity() + " → " + trip.getDestCity())
                            .client(trip.getClient() != null ? trip.getClient().getCompanyName() : "N/D")
                            .lastPositionAt(vehicle.getLastPositionAt())
                            .build();
                })
                .toList();
    }

    private List<Integer> getAvailableYears() {
        List<Integer> years = tripRepository.findYearsWithTrips();
        // Keep the selector usable when there are no trips at all
        return years.isEmpty() ? List.of(LocalDate.now().getYear()) : years;
    }

    /** Defaults to the current year, falling back to the most recent year that has trips. */
    private int resolveChartYear(Integer requestedYear, List<Integer> availableYears) {
        if (requestedYear != null && availableYears.contains(requestedYear)) {
            return requestedYear;
        }
        int currentYear = LocalDate.now().getYear();
        if (availableYears.contains(currentYear)) {
            return currentYear;
        }
        return availableYears.get(0);
    }

    private DashboardStatsDto getStats() {
        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOfTomorrow = today.plusDays(1).atStartOfDay();
        LocalDateTime startOfYesterday = today.minusDays(1).atStartOfDay();

        LocalDateTime startOfMonth = today.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfMonth = today.plusMonths(1).withDayOfMonth(1).atStartOfDay();

        // Same elapsed span of the previous month (1st .. same day of month), so a
        // month still in progress is not compared against a full one.
        LocalDate sameDayPrevMonth = today.minusMonths(1);
        LocalDateTime startOfPrevMonth = sameDayPrevMonth.withDayOfMonth(1).atStartOfDay();
        LocalDateTime endOfPrevMonthToDate = sameDayPrevMonth.plusDays(1).atStartOfDay();

        // Current period
        Long tripsToday = tripRepository.countTripsDeparting(startOfToday, startOfTomorrow);
        Long vehiclesInTransit = vehicleRepository.countByStatus(VehicleStatus.IN_TRANSIT);
        Long kmThisMonth = tripRepository.sumKmForMonth(startOfMonth, endOfMonth);
        BigDecimal revenueThisMonth = invoiceRepository.sumRevenueForMonth(startOfMonth, endOfMonth);
        if (revenueThisMonth == null) {
            revenueThisMonth = BigDecimal.ZERO;
        }

        // Comparable previous period
        Long tripsYesterday = tripRepository.countTripsDeparting(startOfYesterday, startOfToday);
        Long kmPrevMonth = tripRepository.sumKmForMonth(startOfPrevMonth, endOfPrevMonthToDate);
        BigDecimal revenuePrevMonth = invoiceRepository.sumRevenueForMonth(startOfPrevMonth, endOfPrevMonthToDate);
        if (revenuePrevMonth == null) {
            revenuePrevMonth = BigDecimal.ZERO;
        }

        return DashboardStatsDto.builder()
                .tripsToday(tripsToday)
                .vehiclesInTransit(vehiclesInTransit)
                .kmThisMonth(kmThisMonth)
                .revenueThisMonth(revenueThisMonth)
                .tripsTrend(calculateTrend(tripsToday, tripsYesterday))
                .kmTrend(calculateTrend(kmThisMonth, kmPrevMonth))
                .revenueTrend(calculateTrend(revenueThisMonth, revenuePrevMonth))
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
        LocalDateTime expiryWindow = LocalDateTime.now().plusDays(EXPIRY_WINDOW_DAYS);
        LocalDateTime deadline30Days = LocalDateTime.now().plusDays(30);
        LocalDateTime deadline7Days = LocalDateTime.now().plusDays(7);

        // Driver license expiring alerts
        List<Driver> driversWithExpiringDocs = driverRepository.findWithExpiringDocuments(expiryWindow);
        for (Driver driver : driversWithExpiringDocs) {
            ExpiringDoc doc = getExpiringDriverDoc(driver, expiryWindow);
            if (doc != null) {
                long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), doc.expiry().toLocalDate());
                boolean expired = daysUntil < 0;
                alerts.add(DashboardAlertDto.builder()
                        .id("driver-" + driver.getId())
                        .type(expired || daysUntil <= URGENT_WITHIN_DAYS ? "danger" : "warning")
                        .icon("badge")
                        .title(doc.label() + (expired ? " scaduta" : " in scadenza"))
                        .description(driver.getFirstName() + " " + driver.getLastName() + " - " + formatCountdown(daysUntil))
                        .daysUntil(daysUntil)
                        .expired(expired)
                        .link("/drivers/" + driver.getId())
                        .build());
            }
        }

        // Vehicle documents expiring alerts
        List<Vehicle> vehiclesWithExpiringDocs = vehicleRepository.findWithExpiringDocuments(expiryWindow);
        for (Vehicle vehicle : vehiclesWithExpiringDocs) {
            ExpiringDoc doc = getExpiringVehicleDoc(vehicle, expiryWindow);
            if (doc != null) {
                long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), doc.expiry().toLocalDate());
                boolean expired = daysUntil < 0;
                alerts.add(DashboardAlertDto.builder()
                        .id("vehicle-" + vehicle.getId())
                        .type(expired || daysUntil <= URGENT_WITHIN_DAYS ? "danger" : "warning")
                        .icon("directions_car")
                        .title(doc.label() + (expired ? " scaduta" : " in scadenza"))
                        .description(vehicle.getPlate() + " - " + formatCountdown(daysUntil))
                        .daysUntil(daysUntil)
                        .expired(expired)
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
                boolean expired = daysUntil < 0;
                String severity = expired || daysUntil <= 7 ? "warning" : "info";
                String vehiclePlate = maintenance.getVehicle() != null ? maintenance.getVehicle().getPlate() : "N/D";
                alerts.add(DashboardAlertDto.builder()
                        .id("maintenance-" + maintenance.getId())
                        .type(severity)
                        .icon("build")
                        .title(expired ? "Manutenzione scaduta" : "Manutenzione programmata")
                        .description(vehiclePlate + " - " + maintenance.getDescription())
                        .daysUntil(daysUntil)
                        .expired(expired)
                        .link("/maintenance")
                        .build());
            }
        }

        // Invoice due alerts
        List<Invoice> dueInvoices = invoiceRepository.findDueInvoices(
                List.of(InvoiceStatus.SENT, InvoiceStatus.OVERDUE), deadline7Days);
        for (Invoice invoice : dueInvoices) {
            long daysUntil = ChronoUnit.DAYS.between(LocalDate.now(), invoice.getDueDate().toLocalDate());
            boolean expired = daysUntil < 0;
            String clientName = invoice.getClient() != null ? invoice.getClient().getCompanyName() : "N/D";
            alerts.add(DashboardAlertDto.builder()
                    .id("invoice-" + invoice.getId())
                    .type(expired ? "danger" : "warning")
                    .icon("receipt_long")
                    .title(expired ? "Fattura scaduta" : "Fattura in scadenza")
                    .description(invoice.getInvoiceNumber() + " - " + clientName + " - " + formatCountdown(daysUntil))
                    .daysUntil(daysUntil)
                    .expired(expired)
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

    /** Label and expiry date of a single document, kept together so they cannot diverge. */
    private record ExpiringDoc(String label, LocalDateTime expiry) {}

    private ExpiringDoc getExpiringDriverDoc(Driver driver, LocalDateTime deadline) {
        ExpiringDoc earliest = null;
        earliest = earlierDoc(earliest, "Patente", driver.getLicenseExpiry(), deadline);
        earliest = earlierDoc(earliest, "CQC", driver.getCqcExpiry(), deadline);
        earliest = earlierDoc(earliest, "ADR", driver.getAdrExpiry(), deadline);
        return earliest;
    }

    private ExpiringDoc getExpiringVehicleDoc(Vehicle vehicle, LocalDateTime deadline) {
        ExpiringDoc earliest = null;
        earliest = earlierDoc(earliest, "Assicurazione", vehicle.getInsuranceExpiry(), deadline);
        earliest = earlierDoc(earliest, "Revisione", vehicle.getRevisionExpiry(), deadline);
        return earliest;
    }

    private ExpiringDoc earlierDoc(ExpiringDoc current, String label, LocalDateTime expiry, LocalDateTime deadline) {
        if (expiry == null || expiry.isAfter(deadline)) {
            return current;
        }
        return current == null || expiry.isBefore(current.expiry())
                ? new ExpiringDoc(label, expiry)
                : current;
    }

    private String formatCountdown(long daysUntil) {
        if (daysUntil == 0) {
            return "scade oggi";
        }
        long days = Math.abs(daysUntil);
        String unit = days == 1 ? " giorno" : " giorni";
        return daysUntil < 0
                ? "scaduta da " + days + unit
                : "scade tra " + days + unit;
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

    private List<MonthlyTripDataDto> getChartData(int year) {
        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();

        // Get trip counts by month
        List<Object[]> monthlyData = tripRepository.countTripsByMonth(year);
        Map<Integer, Long> tripsByMonth = new HashMap<>();
        for (Object[] row : monthlyData) {
            Integer month = (Integer) row[0];
            Long count = (Long) row[1];
            tripsByMonth.put(month, count);
        }

        List<MonthlyTripDataDto> chartData = new ArrayList<>();
        for (int month = 1; month <= 12; month++) {
            Long value = tripsByMonth.getOrDefault(month, 0L);
            // Only months still in the future are projections; past years have none
            boolean isProjection = year > currentYear || (year == currentYear && month > currentMonth);

            chartData.add(MonthlyTripDataDto.builder()
                    .month(MONTHS_IT[month - 1])
                    .value(value)
                    .isProjection(isProjection)
                    .build());
        }

        return chartData;
    }
}
