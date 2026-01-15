import { Component, Output, EventEmitter, signal, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';
import { DashboardService } from '../../core/services/dashboard.service';
import { SearchResult } from '../../models';

@Component({
    selector: 'app-header',
    imports: [CommonModule, RouterModule, FormsModule],
    template: `
    <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div class="flex items-center gap-4">
        <!-- Mobile menu button -->
        <button
          (click)="menuClick.emit()"
          class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg
                 transition-all lg:hidden"
        >
          <span class="material-icons-outlined">menu</span>
        </button>

        <!-- Page Title -->
        <h2 class="text-xl font-semibold text-gray-800">Dashboard</h2>
        <span class="text-gray-400 hidden sm:inline">|</span>
        <p class="text-gray-500 text-sm hidden sm:inline">{{ currentDate }}</p>
      </div>

      <div class="flex items-center gap-4">
        <!-- Search -->
        <div class="relative hidden md:block" #searchContainer>
          <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Cerca..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            (focus)="showSearchResults = true"
            class="w-64 pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          >

          <!-- Search Results Dropdown -->
          @if (showSearchResults && (searchService.hasResults() || searchService.loading())) {
            <div class="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
              @if (searchService.loading()) {
                <div class="p-4 text-center text-gray-500">
                  <span class="material-icons-outlined animate-spin">refresh</span>
                  <p class="text-sm mt-1">Ricerca in corso...</p>
                </div>
              } @else {
                @if (searchService.results()?.totalResults === 0) {
                  <div class="p-4 text-center text-gray-500">
                    <span class="material-icons-outlined text-2xl">search_off</span>
                    <p class="text-sm mt-1">Nessun risultato</p>
                  </div>
                } @else {
                  <!-- Trips -->
                  @if (searchService.results()?.trips?.length) {
                    <div class="p-2">
                      <p class="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Viaggi</p>
                      @for (item of searchService.results()!.trips; track item.id) {
                        <div
                          class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          (click)="navigateTo(item.link)"
                        >
                          <span class="material-icons-outlined text-blue-500">{{ item.icon }}</span>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-800 truncate">{{ item.title }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ item.subtitle }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  }

                  <!-- Vehicles -->
                  @if (searchService.results()?.vehicles?.length) {
                    <div class="p-2 border-t border-gray-100">
                      <p class="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Veicoli</p>
                      @for (item of searchService.results()!.vehicles; track item.id) {
                        <div
                          class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          (click)="navigateTo(item.link)"
                        >
                          <span class="material-icons-outlined text-green-500">{{ item.icon }}</span>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-800 truncate">{{ item.title }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ item.subtitle }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  }

                  <!-- Drivers -->
                  @if (searchService.results()?.drivers?.length) {
                    <div class="p-2 border-t border-gray-100">
                      <p class="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Autisti</p>
                      @for (item of searchService.results()!.drivers; track item.id) {
                        <div
                          class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          (click)="navigateTo(item.link)"
                        >
                          <span class="material-icons-outlined text-purple-500">{{ item.icon }}</span>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-800 truncate">{{ item.title }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ item.subtitle }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  }

                  <!-- Clients -->
                  @if (searchService.results()?.clients?.length) {
                    <div class="p-2 border-t border-gray-100">
                      <p class="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Clienti</p>
                      @for (item of searchService.results()!.clients; track item.id) {
                        <div
                          class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          (click)="navigateTo(item.link)"
                        >
                          <span class="material-icons-outlined text-orange-500">{{ item.icon }}</span>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-800 truncate">{{ item.title }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ item.subtitle }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  }

                  <!-- Invoices -->
                  @if (searchService.results()?.invoices?.length) {
                    <div class="p-2 border-t border-gray-100">
                      <p class="text-xs font-semibold text-gray-400 uppercase px-2 mb-1">Fatture</p>
                      @for (item of searchService.results()!.invoices; track item.id) {
                        <div
                          class="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                          (click)="navigateTo(item.link)"
                        >
                          <span class="material-icons-outlined text-amber-500">{{ item.icon }}</span>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-800 truncate">{{ item.title }}</p>
                            <p class="text-xs text-gray-500 truncate">{{ item.subtitle }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  }
                }
              }
            </div>
          }
        </div>

        <!-- Notifications -->
        <div class="relative" #notificationsContainer>
          <button
            (click)="toggleNotifications()"
            class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100
                   rounded-lg transition-all"
          >
            <span class="material-icons-outlined">notifications</span>
            @if (dashboardService.alerts().length > 0) {
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            }
          </button>

          <!-- Notifications Dropdown -->
          @if (showNotifications) {
            <div class="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
              <div class="p-3 border-b border-gray-100 flex items-center justify-between">
                <h4 class="font-semibold text-gray-800">Notifiche</h4>
                <span class="text-xs text-gray-500">{{ dashboardService.alerts().length }} avvisi</span>
              </div>

              @if (dashboardService.alerts().length === 0) {
                <div class="p-4 text-center text-gray-500">
                  <span class="material-icons-outlined text-3xl">notifications_none</span>
                  <p class="text-sm mt-1">Nessuna notifica</p>
                </div>
              } @else {
                <div class="divide-y divide-gray-100">
                  @for (alert of dashboardService.alerts(); track alert.id) {
                    <div
                      class="p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3"
                      (click)="navigateTo(alert.link); showNotifications = false"
                    >
                      <div
                        class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        [ngClass]="getAlertBgClass(alert.type)"
                      >
                        <span
                          class="material-icons-outlined text-sm"
                          [ngClass]="getAlertIconClass(alert.type)"
                        >
                          {{ alert.icon }}
                        </span>
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-800">{{ alert.title }}</p>
                        <p class="text-xs text-gray-500 mt-0.5">{{ alert.description }}</p>
                      </div>
                    </div>
                  }
                </div>
              }

              <div class="p-2 border-t border-gray-100">
                <button
                  (click)="navigateTo('/'); showNotifications = false"
                  class="w-full text-center text-sm text-orange-500 hover:text-orange-600 py-2"
                >
                  Vai alla Dashboard
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Quick Add Button -->
        <button
          routerLink="/trips/new"
          class="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600
                 text-white rounded-lg font-medium text-sm transition-all"
        >
          <span class="material-icons-outlined text-xl">add</span>
          <span class="hidden sm:inline">Nuovo Viaggio</span>
        </button>
      </div>
    </header>
  `
})
export class HeaderComponent {
  @Output() menuClick = new EventEmitter<void>();

  private router = inject(Router);
  private elementRef = inject(ElementRef);
  searchService = inject(SearchService);
  dashboardService = inject(DashboardService);

  searchQuery = '';
  showSearchResults = false;
  showNotifications = false;

  currentDate = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSearchResults = false;
      this.showNotifications = false;
    }
  }

  onSearchChange(query: string): void {
    this.searchService.search(query);
    this.showSearchResults = query.length >= 2;
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.showSearchResults = false;
    if (this.showNotifications && this.dashboardService.alerts().length === 0) {
      this.dashboardService.loadDashboard();
    }
  }

  navigateTo(link?: string): void {
    if (link) {
      this.router.navigate([link]);
      this.showSearchResults = false;
      this.showNotifications = false;
      this.searchQuery = '';
      this.searchService.clearResults();
    }
  }

  getAlertBgClass(type: string): string {
    switch (type) {
      case 'danger': return 'bg-red-100';
      case 'warning': return 'bg-amber-100';
      case 'info': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  }

  getAlertIconClass(type: string): string {
    switch (type) {
      case 'danger': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  }
}