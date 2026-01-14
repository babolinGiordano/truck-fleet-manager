import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit, signal, computed } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { StatusBadgeComponent } from "../../../../shared/components/status-badge/status-badge.component";
import { DriversService } from "../../../../core/services/drivers.service";
import { VehiclesService } from "../../../../core/services/vehicles.service";
import { DRIVER_STATUS_LABELS, Vehicle } from "../../../../models";

@Component({
    selector: 'app-driver-detail',
    imports: [CommonModule, RouterModule, StatusBadgeComponent],
    templateUrl:'./driver-detail.component.html'
})
export class DriverDetailComponent implements OnInit {
  @Input() id!: string; // From route param

  driversService = inject(DriversService);
  vehiclesService = inject(VehiclesService);
  private router = inject(Router);

  statusLabels = DRIVER_STATUS_LABELS;

  // Modale assegnazione veicolo
  showVehicleModal = signal(false);
  selectedVehicleId = signal<string>('');
  savingVehicle = signal(false);

  // Veicolo assegnato all'autista
  assignedVehicle = computed(() => {
    const driver = this.driversService.selectedDriver();
    if (!driver?.assignedVehicleId) return null;
    return this.vehiclesService.vehicles().find(v => v.id === driver.assignedVehicleId) || null;
  });

  // Veicoli disponibili per assegnazione (disponibili + quello attualmente assegnato)
  availableVehicles = computed(() => {
    const vehicles = this.vehiclesService.vehicles();
    const currentAssigned = this.driversService.selectedDriver()?.assignedVehicleId;
    return vehicles.filter(v =>
      v.status === 'available' || v.id === currentAssigned
    );
  });

  ngOnInit(): void {
    if (this.id) {
      this.driversService.getDriver(this.id).subscribe({
        error: () => this.router.navigate(['/drivers'])
      });
      this.vehiclesService.loadVehicles();
    }
  }

  isExpiringSoon(dateStr: string): boolean {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }

  openVehicleModal(): void {
    const currentVehicleId = this.driversService.selectedDriver()?.assignedVehicleId || '';
    this.selectedVehicleId.set(currentVehicleId);
    this.showVehicleModal.set(true);
  }

  closeVehicleModal(): void {
    this.showVehicleModal.set(false);
  }

  assignVehicle(): void {
    const driver = this.driversService.selectedDriver();
    if (!driver) return;

    this.savingVehicle.set(true);
    const newVehicleId = this.selectedVehicleId();

    this.driversService.updateDriver(driver.id, {
      assignedVehicleId: newVehicleId || undefined
    }).subscribe({
      next: () => {
        this.savingVehicle.set(false);
        this.showVehicleModal.set(false);
      },
      error: (err) => {
        console.error('Error assigning vehicle:', err);
        this.savingVehicle.set(false);
      }
    });
  }
}