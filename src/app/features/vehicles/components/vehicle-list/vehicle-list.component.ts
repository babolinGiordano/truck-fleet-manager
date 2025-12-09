import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { Vehicle, VehicleStatus, VEHICLE_STATUS_LABELS } from '../../../../models/vehicle.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-vehicle-list',
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        StatusBadgeComponent,
        ConfirmDialogComponent
    ],
    templateUrl:'./vehicle-list.component.html'
})
export class VehicleListComponent implements OnInit {
  vehiclesService = inject(VehiclesService);

  searchQuery = '';
  statusFilter = signal<VehicleStatus | null>(null);
  vehicleToDelete = signal<Vehicle | null>(null);

  statusLabels = VEHICLE_STATUS_LABELS;

  statusOptions: { value: VehicleStatus; label: string }[] = [
    { value: 'available', label: 'Disponibili' },
    { value: 'in_transit', label: 'In Transito' },
    { value: 'maintenance', label: 'Manutenzione' },
    { value: 'inactive', label: 'Inattivi' }
  ];

  filteredVehicles = computed(() => {
    let vehicles = this.vehiclesService.vehicles();

    // Filter by status
    const status = this.statusFilter();
    if (status) {
      vehicles = vehicles.filter(v => v.status === status);
    }

    // Filter by search query
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      vehicles = vehicles.filter(v =>
        v.plate.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query)
      );
    }

    return vehicles;
  });

  ngOnInit(): void {
    this.vehiclesService.loadVehicles();
  }

  isExpiringSoon(dateStr: string): boolean {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }

  confirmDelete(vehicle: Vehicle): void {
    this.vehicleToDelete.set(vehicle);
  }

  deleteVehicle(): void {
    const vehicle = this.vehicleToDelete();
    if (vehicle) {
      this.vehiclesService.deleteVehicle(vehicle.id).subscribe({
        next: () => {
          this.vehicleToDelete.set(null);
        },
        error: (err) => {
          console.error('Error deleting vehicle:', err);
        }
      });
    }
  }
}