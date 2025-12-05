import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-map-preview',
    imports: [CommonModule, RouterModule],
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
      
      <!-- Map Placeholder -->
      <div class="h-80 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
        <!-- Grid pattern -->
        <div class="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"/>
          </svg>
        </div>
        
        <!-- Italy shape placeholder -->
        <div class="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 100 150" class="w-48 h-auto fill-blue-900">
            <path d="M50,10 C60,15 70,20 72,35 C74,50 68,60 70,75 C72,90 60,100 55,115 C53,125 45,135 40,140 C35,135 32,120 35,110 C38,100 42,90 40,80 C38,70 30,60 32,45 C34,30 42,15 50,10Z"/>
          </svg>
        </div>
        
        <!-- Animated truck markers -->
        <div class="absolute top-20 left-32 animate-bounce" style="animation-duration: 3s;">
          <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-icons-outlined text-white text-sm">local_shipping</span>
          </div>
        </div>
        
        <div class="absolute top-32 right-48 animate-bounce" style="animation-duration: 4s;">
          <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-icons-outlined text-white text-sm">local_shipping</span>
          </div>
        </div>
        
        <div class="absolute bottom-24 left-1/2 animate-bounce" style="animation-duration: 3.5s;">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <span class="material-icons-outlined text-white text-sm">local_shipping</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class MapPreviewComponent {
  @Input() vehiclesInTransit = 0;
}