import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Maintenance, MaintenanceStatus, MaintenanceType, MAINTENANCE_STATUS_LABELS, MAINTENANCE_TYPE_LABELS } from '../../../../models/maintenance.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';

@Component({
  selector: 'app-maintenance-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmDialogComponent,
    StatusBadgeComponent
  ],
  templateUrl: './maintenance-list.component.html'
})
export class MaintenanceListComponent implements OnInit {
  maintenanceService = inject(MaintenanceService);
  vehiclesService = inject(VehiclesService);

  searchQuery = signal('');
  statusFilter = signal<MaintenanceStatus | null>(null);
  maintenanceToDelete = signal<Maintenance | null>(null);

  statusLabels = MAINTENANCE_STATUS_LABELS;
  typeLabels = MAINTENANCE_TYPE_LABELS;

  statusOptions: { value: MaintenanceStatus; label: string }[] = [
    { value: 'scheduled', label: 'Programmate' },
    { value: 'in_progress', label: 'In Corso' },
    { value: 'completed', label: 'Completate' },
    { value: 'cancelled', label: 'Annullate' }
  ];

  filteredRecords = computed(() => {
    let records = this.maintenanceService.maintenanceRecords();

    // Filter by status
    const status = this.statusFilter();
    if (status) {
      records = records.filter(r => r.status === status);
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      records = records.filter(r =>
        r.description.toLowerCase().includes(query) ||
        r.workshop?.toLowerCase().includes(query) ||
        this.getVehiclePlate(r.vehicleId).toLowerCase().includes(query)
      );
    }

    return records;
  });

  ngOnInit(): void {
    this.maintenanceService.loadMaintenanceRecords();
    this.vehiclesService.loadVehicles();
  }

  getVehiclePlate(vehicleId: string): string {
    const vehicle = this.vehiclesService.vehicles().find(v => v.id === vehicleId);
    return vehicle ? vehicle.plate : vehicleId;
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  confirmDelete(maintenance: Maintenance): void {
    this.maintenanceToDelete.set(maintenance);
  }

  deleteRecord(): void {
    const maintenance = this.maintenanceToDelete();
    if (maintenance) {
      this.maintenanceService.deleteMaintenanceRecord(maintenance.id).subscribe({
        next: () => {
          this.maintenanceToDelete.set(null);
        },
        error: (err) => {
          console.error('Error deleting maintenance record:', err);
        }
      });
    }
  }
}
