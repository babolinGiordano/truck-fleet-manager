import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FuelService } from '../../../../core/services/fuel.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { DriversService } from '../../../../core/services/drivers.service';
import { FUEL_TYPE_LABELS } from '../../../../models/fuel.model';

@Component({
  selector: 'app-fuel-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './fuel-detail.component.html'
})
export class FuelDetailComponent implements OnInit {
  @Input() id!: string;

  fuelService = inject(FuelService);
  vehiclesService = inject(VehiclesService);
  driversService = inject(DriversService);
  private router = inject(Router);

  fuelTypeLabels = FUEL_TYPE_LABELS;

  ngOnInit(): void {
    this.vehiclesService.loadVehicles();
    this.driversService.loadDrivers();

    if (this.id) {
      this.fuelService.getFuelRecord(this.id).subscribe({
        error: () => this.router.navigate(['/fuel'])
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

  getDriverName(driverId: string | undefined): string {
    if (!driverId) return '-';
    const driver = this.driversService.drivers().find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : driverId;
  }
}
