import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { MAINTENANCE_TYPE_LABELS, MAINTENANCE_STATUS_LABELS } from '../../../../models/maintenance.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-maintenance-detail',
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './maintenance-detail.component.html'
})
export class MaintenanceDetailComponent implements OnInit {
  @Input() id!: string;

  maintenanceService = inject(MaintenanceService);
  vehiclesService = inject(VehiclesService);
  private router = inject(Router);

  typeLabels = MAINTENANCE_TYPE_LABELS;
  statusLabels = MAINTENANCE_STATUS_LABELS;

  ngOnInit(): void {
    this.vehiclesService.loadVehicles();

    if (this.id) {
      this.maintenanceService.getMaintenanceRecord(this.id).subscribe({
        error: () => this.router.navigate(['/maintenance'])
      });
    }
  }

  getVehiclePlate(vehicleId: string): string {
    const vehicle = this.vehiclesService.vehicles().find(v => v.id === vehicleId);
    return vehicle ? vehicle.plate : vehicleId;
  }

  getVehicleInfo(vehicleId: string): string {
    const vehicle = this.vehiclesService.vehicles().find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.brand} ${vehicle.model}` : '';
  }
}
