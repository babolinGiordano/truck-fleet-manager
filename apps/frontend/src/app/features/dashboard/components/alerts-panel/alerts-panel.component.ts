import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardAlert } from '../../../../models';

@Component({
    selector: 'app-alerts-panel',
    imports: [CommonModule],
    template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 h-full">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-icons-outlined text-gray-500">notifications_active</span>
          <h3 class="font-semibold text-gray-800">Avvisi</h3>
        </div>
        <span class="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
          {{ alerts.length }} nuovi
        </span>
      </div>

      <div class="p-4 space-y-3 max-h-80 overflow-y-auto">
        @for (alert of alerts; track alert.id) {
          <div
            class="flex items-start gap-3 p-3 rounded-lg border cursor-pointer
                   hover:shadow-sm transition-all"
            [ngClass]="getAlertClasses(alert.type)"
            (click)="navigateTo(alert.link)"
          >
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              [ngClass]="getIconBgClass(alert.type)"
            >
              <span
                class="material-icons-outlined text-sm"
                [ngClass]="getIconColorClass(alert.type)"
              >
                {{ alert.icon }}
              </span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <p class="text-sm font-medium text-gray-800">{{ alert.title }}</p>
                @if (alert.expired) {
                  <span class="text-[10px] font-bold uppercase tracking-wide text-red-700
                               bg-red-100 border border-red-200 px-1.5 py-0.5 rounded">
                    Scaduta
                  </span>
                }
              </div>
              <p class="text-xs mt-0.5" [ngClass]="alert.expired ? 'text-red-600 font-semibold' : 'text-gray-500'">
                {{ alert.description }}
              </p>
            </div>
            @if (alert.link) {
              <span class="material-icons-outlined text-gray-400 text-sm self-center">chevron_right</span>
            }
          </div>
        } @empty {
          <div class="text-center py-8 text-gray-500">
            <span class="material-icons-outlined text-4xl mb-2">check_circle</span>
            <p>Nessun avviso</p>
          </div>
        }
      </div>
    </div>
  `
})
export class AlertsPanelComponent {
  private router = inject(Router);

  @Input() alerts: DashboardAlert[] = [];

  navigateTo(link?: string): void {
    if (link) {
      this.router.navigate([link]);
    }
  }

  getAlertClasses(type: string): string {
    switch (type) {
      case 'danger': return 'bg-red-50 border-red-100';
      case 'warning': return 'bg-amber-50 border-amber-100';
      case 'info': return 'bg-blue-50 border-blue-100';
      default: return 'bg-gray-50 border-gray-100';
    }
  }

  getIconBgClass(type: string): string {
    switch (type) {
      case 'danger': return 'bg-red-100';
      case 'warning': return 'bg-amber-100';
      case 'info': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  }

  getIconColorClass(type: string): string {
    switch (type) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }
}