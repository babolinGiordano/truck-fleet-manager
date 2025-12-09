import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { TripsService } from '../../../../core/services/trips.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { DriversService } from '../../../../core/services/drivers.service';
import { Trip, TripStatus, TRIP_STATUS_LABELS, Vehicle, Driver } from '../../../../models';

@Component({
  selector: 'app-trip-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgeComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './trip-list.component.html'
})
export class TripListComponent implements OnInit {
  tripsService = inject(TripsService);
  private vehiclesService = inject(VehiclesService);
  private driversService = inject(DriversService);

  searchQuery = signal('');
  statusFilter = signal<TripStatus | null>(null);
  tripToDelete = signal<Trip | null>(null);

  statusLabels = TRIP_STATUS_LABELS;

  statusOptions: { value: TripStatus; label: string }[] = [
    { value: 'planned', label: 'Pianificati' },
    { value: 'in_progress', label: 'In Corso' },
    { value: 'completed', label: 'Completati' },
    { value: 'cancelled', label: 'Annullati' }
  ];

  filteredTrips = computed(() => {
    let trips = this.tripsService.trips();

    // Filter by status
    const status = this.statusFilter();
    if (status) {
      trips = trips.filter(t => t.status === status);
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      const vehicles = this.vehiclesService.vehicles();
      const drivers = this.driversService.drivers();

      trips = trips.filter(t => {
        // Search in trip fields
        if (t.tripNumber.toLowerCase().includes(query)) return true;
        if (t.origin.city.toLowerCase().includes(query)) return true;
        if (t.destination.city.toLowerCase().includes(query)) return true;
        if (t.cargo.description.toLowerCase().includes(query)) return true;
        if (t.origin.companyName?.toLowerCase().includes(query)) return true;
        if (t.destination.companyName?.toLowerCase().includes(query)) return true;

        // Search in vehicle plate
        if (t.vehicleId) {
          const vehicle = vehicles.find(v => v.id === t.vehicleId);
          if (vehicle?.plate.toLowerCase().includes(query)) return true;
        }

        // Search in driver name
        if (t.driverId) {
          const driver = drivers.find(d => d.id === t.driverId);
          if (driver) {
            const fullName = `${driver.firstName} ${driver.lastName}`.toLowerCase();
            if (fullName.includes(query)) return true;
          }
        }

        return false;
      });
    }

    return trips;
  });

  ngOnInit(): void {
    this.tripsService.loadTrips();
    this.vehiclesService.loadVehicles();
    this.driversService.loadDrivers();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  getVehicle(vehicleId: string): Vehicle | null {
    if (!vehicleId) return null;
    return this.vehiclesService.vehicles().find(v => v.id === vehicleId) || null;
  }

  getDriver(driverId: string): Driver | null {
    if (!driverId) return null;
    return this.driversService.drivers().find(d => d.id === driverId) || null;
  }

  confirmDelete(trip: Trip): void {
    this.tripToDelete.set(trip);
  }

  deleteTrip(): void {
    const trip = this.tripToDelete();
    if (trip) {
      this.tripsService.deleteTrip(trip.id).subscribe({
        next: () => {
          this.tripToDelete.set(null);
        },
        error: (err) => {
          console.error('Error deleting trip:', err);
        }
      });
    }
  }
}
