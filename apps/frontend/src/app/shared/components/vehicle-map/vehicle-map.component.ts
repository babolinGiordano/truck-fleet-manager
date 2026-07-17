import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import * as L from 'leaflet';
import { LiveVehicle } from '../../../models';

/**
 * Mappa Leaflet + OpenStreetMap con un marker per ogni veicolo in viaggio.
 * Riempie il contenitore ospitante (h-full/w-full): il chrome attorno
 * (card, header, sidebar) lo mette chi la usa.
 */
@Component({
    selector: 'app-vehicle-map',
    imports: [CommonModule, LeafletModule],
    template: `
    @if (vehicles.length) {
      <div
        class="h-full w-full"
        leaflet
        [leafletOptions]="mapOptions"
        [leafletLayers]="markers"
        (leafletMapReady)="onMapReady($event)"
      ></div>
    } @else {
      <div class="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <span class="material-icons-outlined text-5xl mb-2">location_off</span>
        <p class="text-sm font-medium text-gray-500">Nessun veicolo in viaggio</p>
        <p class="text-xs mt-1">Le posizioni compaiono quando un viaggio è in corso</p>
      </div>
    }
  `
})
export class VehicleMapComponent implements OnChanges {
  @Input() vehicles: LiveVehicle[] = [];

  private map?: L.Map;

  markers: L.Layer[] = [];

  readonly mapOptions: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
      })
    ],
    zoom: 5,
    center: L.latLng(42.5, 12.5),
    attributionControl: true
  };

  ngOnChanges(): void {
    this.markers = this.vehicles.map(v => this.buildMarker(v));
    this.fitToVehicles();
  }

  onMapReady(map: L.Map): void {
    this.map = map;
    // Leaflet misura il contenitore alla creazione: dentro una griglia il
    // riquadro non ha ancora le dimensioni finali e la mappa resterebbe grigia.
    setTimeout(() => map.invalidateSize(), 0);
    this.fitToVehicles();
  }

  private buildMarker(vehicle: LiveVehicle): L.Marker {
    return L.marker([vehicle.lat, vehicle.lng], { icon: this.truckIcon(), title: vehicle.plate })
      .bindPopup(`
        <div class="text-sm">
          <p class="font-semibold text-gray-800">${vehicle.plate}</p>
          <p class="text-gray-600">${vehicle.route}</p>
          <p class="text-gray-400 text-xs mt-1">${vehicle.client}</p>
        </div>
      `);
  }

  private truckIcon(): L.DivIcon {
    return L.divIcon({
      className: '',
      html: `<div class="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
               <span class="material-icons-outlined text-white text-base">local_shipping</span>
             </div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });
  }

  private fitToVehicles(): void {
    if (!this.map || !this.vehicles.length) {
      return;
    }
    const bounds = L.latLngBounds(this.vehicles.map(v => L.latLng(v.lat, v.lng)));
    this.map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
  }
}
