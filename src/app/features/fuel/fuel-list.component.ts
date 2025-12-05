import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-fuel-list',
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
      <span class="material-icons-outlined text-5xl text-gray-300 mb-3">local_gas_station</span>
      <h2 class="text-xl font-semibold text-gray-800 mb-2">Rifornimenti</h2>
      <p class="text-gray-500">Coming soon...</p>
    </div>
  `
})
export class FuelListComponent {}