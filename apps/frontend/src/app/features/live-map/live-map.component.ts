import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleMapComponent } from '../../shared/components/vehicle-map/vehicle-map.component';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
    selector: 'app-live-map',
    imports: [CommonModule, RouterModule, VehicleMapComponent],
    template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Mappa Live</h1>
          <p class="text-gray-500 mt-1">Posizione in tempo reale dei veicoli</p>
        </div>
        <div class="flex items-center gap-2 text-green-600">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span class="font-medium">{{ vehicles().length }} veicoli attivi</span>
        </div>
      </div>

      <!-- Map Container -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="h-[calc(100vh-250px)] relative">
          <app-vehicle-map [vehicles]="vehicles()" />

          <!-- Vehicle List Sidebar -->
          @if (vehicles().length) {
            <div class="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-72 z-[1000]">
              <h3 class="font-semibold text-gray-800 mb-3">Veicoli in transito</h3>
              <div class="space-y-3 max-h-[60vh] overflow-y-auto">
                @for (v of vehicles(); track v.vehicleId) {
                  <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div class="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <span class="material-icons-outlined text-white text-sm">local_shipping</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-medium text-sm text-gray-800">{{ v.plate }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ v.route }}</p>
                      <p class="text-xs text-gray-400 truncate">{{ v.client }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class LiveMapComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  vehicles = this.dashboardService.liveVehicles;

  ngOnInit(): void {
    this.dashboardService.loadDashboard();
  }
}
