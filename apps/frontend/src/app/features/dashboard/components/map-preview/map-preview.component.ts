import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VehicleMapComponent } from '../../../../shared/components/vehicle-map/vehicle-map.component';
import { LiveVehicle } from '../../../../models';

@Component({
    selector: 'app-map-preview',
    imports: [CommonModule, RouterModule, VehicleMapComponent],
    template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-icons-outlined text-gray-500">map</span>
          <h3 class="font-semibold text-gray-800">Mappa Live</h3>
          <span class="ml-2 flex items-center gap-1 text-green-500 text-sm">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {{ vehiclesInTransit }} attivi
          </span>
        </div>
        <a
          routerLink="/live-map"
          class="text-orange-500 hover:text-orange-600 text-sm font-medium flex items-center gap-1"
        >
          Apri mappa completa
          <span class="material-icons-outlined text-sm">arrow_forward</span>
        </a>
      </div>

      <div class="h-80 relative">
        <app-vehicle-map [vehicles]="vehicles" />
      </div>
    </div>
  `
})
export class MapPreviewComponent {
  @Input() vehiclesInTransit = 0;
  @Input() vehicles: LiveVehicle[] = [];
}
