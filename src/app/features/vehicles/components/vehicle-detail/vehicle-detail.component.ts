import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { VEHICLE_STATUS_LABELS } from '../../../../models/vehicle.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
  selector: 'app-vehicle-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  template: `
    <div class="space-y-6">
      <!-- Back Button & Actions -->
      <div class="flex items-center justify-between">
        <a 
          routerLink="/vehicles"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span class="material-icons-outlined">arrow_back</span>
          Torna alla lista
        </a>
        
        @if (vehiclesService.selectedVehicle(); as vehicle) {
          <div class="flex items-center gap-2">
            <a 
              [routerLink]="['edit']"
              class="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-dark 
                     text-white rounded-lg font-medium transition-all"
            >
              <span class="material-icons-outlined text-xl">edit</span>
              Modifica
            </a>
          </div>
        }
      </div>

      <!-- Loading -->
      @if (vehiclesService.loading()) {
        <div class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      }

      <!-- Vehicle Detail -->
      @if (vehiclesService.selectedVehicle(); as vehicle) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Info -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Header Card -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div class="flex items-start gap-4">
                <div class="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
                  <span class="material-icons-outlined text-accent text-3xl">local_shipping</span>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h1 class="text-2xl font-bold text-gray-800">
                      {{ vehicle.brand }} {{ vehicle.model }}
                    </h1>
                    <app-status-badge [status]="vehicle.status" [labels]="statusLabels" />
                  </div>
                  <p class="text-gray-500">
                    <span class="font-mono font-medium">{{ vehicle.plate }}</span> • {{ vehicle.year }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Details Grid -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Informazioni</h2>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <p class="text-sm text-gray-500 mb-1">Marca</p>
                  <p class="font-medium text-gray-800">{{ vehicle.brand }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Modello</p>
                  <p class="font-medium text-gray-800">{{ vehicle.model }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Anno</p>
                  <p class="font-medium text-gray-800">{{ vehicle.year }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500 mb-1">Km Totali</p>
                  <p class="font-medium text-gray-800">{{ vehicle.kmTotal | number:'1.0-0':'it-IT' }} km</p>
                </div>
              </div>
            </div>

            <!-- Notes -->
            @if (vehicle.notes) {
              <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Note</h2>
                <p class="text-gray-600">{{ vehicle.notes }}</p>
              </div>
            }
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Scadenze Card -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Scadenze</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="material-icons-outlined text-gray-500">security</span>
                    <span class="text-gray-600">Assicurazione</span>
                  </div>
                  <span 
                    class="font-medium"
                    [ngClass]="isExpiringSoon(vehicle.insuranceExpiry) ? 'text-red-600' : 'text-gray-800'"
                  >
                    {{ vehicle.insuranceExpiry | date:'dd/MM/yyyy' }}
                  </span>
                </div>
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center gap-3">
                    <span class="material-icons-outlined text-gray-500">verified</span>
                    <span class="text-gray-600">Revisione</span>
                  </div>
                  <span 
                    class="font-medium"
                    [ngClass]="isExpiringSoon(vehicle.revisionExpiry) ? 'text-red-600' : 'text-gray-800'"
                  >
                    {{ vehicle.revisionExpiry | date:'dd/MM/yyyy' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Azioni Rapide</h2>
              <div class="space-y-2">
                <button class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 
                               hover:bg-gray-50 rounded-lg transition-all">
                  <span class="material-icons-outlined">build</span>
                  Registra Manutenzione
                </button>
                <button class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 
                               hover:bg-gray-50 rounded-lg transition-all">
                  <span class="material-icons-outlined">local_gas_station</span>
                  Registra Rifornimento
                </button>
                <button class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-600 
                               hover:bg-gray-50 rounded-lg transition-all">
                  <span class="material-icons-outlined">route</span>
                  Assegna a Viaggio
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class VehicleDetailComponent implements OnInit {
  @Input() id!: string; // From route param
  
  vehiclesService = inject(VehiclesService);
  private router = inject(Router);

  statusLabels = VEHICLE_STATUS_LABELS;

  ngOnInit(): void {
    if (this.id) {
      this.vehiclesService.getVehicle(this.id).subscribe({
        error: () => this.router.navigate(['/vehicles'])
      });
    }
  }

  isExpiringSoon(dateStr: string): boolean {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }
}