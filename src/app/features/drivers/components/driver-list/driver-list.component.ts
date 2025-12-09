import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversService } from '../../../../core/services/drivers.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Driver, DRIVER_STATUS_LABELS, DriverStatus, Vehicle } from '../../../../models';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgeComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './driver-list.component.html'
})
export class DriverListComponent {
  driversService = inject(DriversService);
  private vehiclesService = inject(VehiclesService);

  searchQuery = signal('');
  statusFilter = signal<DriverStatus | null>(null);
  driverToDelete = signal<Driver | null>(null);

  statusLabels = DRIVER_STATUS_LABELS;

  statusOptions: { value: DriverStatus; label: string }[] = [
    { value: 'active', label: 'Attivo' },
    { value: 'on_leave', label: 'In Ferie' },
    { value: 'inactive', label: 'Inattivi' }
  ];

  filteredDrivers = computed(() => {
    let drivers = this.driversService.drivers();

    // Filter by status
    const status = this.statusFilter();
    if (status) {
      drivers = drivers.filter(v => v.status === status);
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      const vehicles = this.vehiclesService.vehicles();

      drivers = drivers.filter(d => {
        // Search in driver fields
        if (d.firstName.toLowerCase().includes(query)) return true;
        if (d.lastName.toLowerCase().includes(query)) return true;
        if (d.fiscalCode.toLowerCase().includes(query)) return true;
        if (d.phone.includes(query)) return true;

        // Search in vehicle plate
        if (d.assignedVehicleId) {
          const vehicle = vehicles.find(v => v.id === d.assignedVehicleId);
          if (vehicle?.plate.toLowerCase().includes(query)) return true;
          if (vehicle?.brand.toLowerCase().includes(query)) return true;
          if (vehicle?.model.toLowerCase().includes(query)) return true;
        }

        return false;
      });
    }

    return drivers;
  });

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  ngOnInit(): void {
    this.driversService.loadDrivers();
    this.vehiclesService.loadVehicles();
  }

  getVehicle(vehicleId: string | undefined): Vehicle | null {
    if (!vehicleId) return null;
    return this.vehiclesService.vehicles().find(v => v.id === vehicleId) || null;
  }

  isExpiringSoon(dateStr: string): boolean {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }

  confirmDelete(driver: Driver): void {
    this.driverToDelete.set(driver);
  }

  deleteDriver(): void {
    const driver = this.driverToDelete();
    if (driver) {
      this.driversService.deleteDriver(driver.id).subscribe({
        next: () => {
          this.driverToDelete.set(null);
        },
        error: (err) => {
          console.error('Error deleting driver:', err);
        }
      });
    }
  }
}