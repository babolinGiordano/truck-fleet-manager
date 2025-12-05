import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Mappa Live</h1>
          <p class="text-gray-500 mt-1">Posizione in tempo reale dei veicoli</p>
        </div>
        <div class="flex items-center gap-2 text-green-600">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span class="font-medium">3 veicoli attivi</span>
        </div>
      </div>

      <!-- Map Container -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="h-[calc(100vh-250px)] bg-gradient-to-br from-blue-50 to-green-50 
                    flex items-center justify-center relative">
          <!-- Placeholder - sostituire con Leaflet -->
          <div class="text-center">
            <span class="material-icons-outlined text-6xl text-gray-300 mb-4">map</span>
            <p class="text-gray-500 font-medium">Mappa Leaflet</p>
            <p class="text-gray-400 text-sm mt-1">
              Implementa con &#64;asymmetrik/ngx-leaflet
            </p>
          </div>

          <!-- Vehicle List Sidebar -->
          <div class="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-72">
            <h3 class="font-semibold text-gray-800 mb-3">Veicoli in transito</h3>
            <div class="space-y-3">
              <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <span class="material-icons-outlined text-white text-sm">local_shipping</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-sm text-gray-800">FH 123 AB</p>
                  <p class="text-xs text-gray-500">Milano → Roma</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="material-icons-outlined text-white text-sm">local_shipping</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-sm text-gray-800">DE 456 FG</p>
                  <p class="text-xs text-gray-500">Torino → Napoli</p>
                </div>
              </div>
              <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span class="material-icons-outlined text-white text-sm">local_shipping</span>
                </div>
                <div class="flex-1">
                  <p class="font-medium text-sm text-gray-800">PQ 345 RS</p>
                  <p class="text-xs text-gray-500">Padova → Milano</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LiveMapComponent {}
