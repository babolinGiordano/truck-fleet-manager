import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface RecentTrip {
  id: string;
  route: string;
  client: string;
  vehicle: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  km: number;
}

@Component({
  selector: 'app-recent-trips',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-icons-outlined text-gray-500">history</span>
          <h3 class="font-semibold text-gray-800">Ultimi Viaggi</h3>
        </div>
        <a 
          routerLink="/trips" 
          class="text-orange-500 hover:text-orange-600 text-sm font-medium"
        >
          Vedi tutti
        </a>
      </div>
      
      <div class="divide-y divide-gray-100">
        @for (trip of trips; track trip.id) {
          <div class="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              [ngClass]="getStatusBgClass(trip.status)"
            >
              <span 
                class="material-icons-outlined"
                [ngClass]="getStatusIconClass(trip.status)"
              >
                {{ getStatusIcon(trip.status) }}
              </span>
            </div>
            
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <p class="font-medium text-gray-800">{{ trip.route }}</p>
                <span 
                  class="px-2 py-0.5 text-xs rounded-full"
                  [ngClass]="getStatusBadgeClass(trip.status)"
                >
                  {{ getStatusLabel(trip.status) }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-0.5">
                {{ trip.client }} • {{ trip.vehicle }}
              </p>
            </div>
            
            <div class="text-right">
              <p class="font-medium text-gray-800">€ {{ trip.price | number:'1.0-0' }}</p>
              <p class="text-xs text-gray-500">{{ trip.km }} km</p>
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class RecentTripsComponent {
  @Input() trips: RecentTrip[] = [];

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed': return 'check_circle';
      case 'in_progress': return 'local_shipping';
      case 'planned': return 'schedule';
      case 'cancelled': return 'cancel';
      default: return 'help';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return 'Completato';
      case 'in_progress': return 'In corso';
      case 'planned': return 'Pianificato';
      case 'cancelled': return 'Annullato';
      default: return status;
    }
  }

  getStatusBgClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100';
      case 'in_progress': return 'bg-blue-100';
      case 'planned': return 'bg-orange-100';
      case 'cancelled': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  }

  getStatusIconClass(status: string): string {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in_progress': return 'text-blue-600';
      case 'planned': return 'text-orange-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'planned': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }
}