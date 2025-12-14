import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Fuel, FuelType, FUEL_TYPE_LABELS } from '../../../../models/fuel.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { FuelService } from '../../../../core/services/fuel.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';

@Component({
  selector: 'app-fuel-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmDialogComponent
  ],
  templateUrl: './fuel-list.component.html'
})
export class FuelListComponent implements OnInit {
  fuelService = inject(FuelService);
  vehiclesService = inject(VehiclesService);

  searchQuery = signal('');
  fuelTypeFilter = signal<FuelType | null>(null);
  fuelToDelete = signal<Fuel | null>(null);

  fuelTypeLabels = FUEL_TYPE_LABELS;

  fuelTypeOptions: { value: FuelType; label: string }[] = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'gasoline', label: 'Benzina' },
    { value: 'lpg', label: 'GPL' },
    { value: 'methane', label: 'Metano' },
    { value: 'electric', label: 'Elettrico' }
  ];

  filteredFuelRecords = computed(() => {
    let records = this.fuelService.fuelRecords();

    // Filter by fuel type
    const fuelType = this.fuelTypeFilter();
    if (fuelType) {
      records = records.filter(r => r.fuelType === fuelType);
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      records = records.filter(r =>
        r.stationName?.toLowerCase().includes(query) ||
        r.fuelType.toLowerCase().includes(query) ||
        r.vehicleId.toLowerCase().includes(query)
      );
    }

    return records;
  });

  ngOnInit(): void {
    this.fuelService.loadFuelRecords();
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

  confirmDelete(fuel: Fuel): void {
    this.fuelToDelete.set(fuel);
  }

  deleteFuelRecord(): void {
    const fuel = this.fuelToDelete();
    if (fuel) {
      this.fuelService.deleteFuelRecord(fuel.id).subscribe({
        next: () => {
          this.fuelToDelete.set(null);
        },
        error: (err) => {
          console.error('Error deleting fuel record:', err);
        }
      });
    }
  }
}
