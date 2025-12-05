import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  badgeColor?: 'accent' | 'green' | 'red';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  template: `
    <aside 
      class="flex flex-col flex-shrink-0 transition-all duration-300 h-full"
      [class]="isCollapsed ? 'w-20' : 'w-64'"
      style="background-color: #1a1f2e;"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-4 border-b border-gray-700/50">
        <div class="flex items-center gap-3 overflow-hidden">
          <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span class="material-icons-outlined text-white">local_shipping</span>
          </div>
          @if (!isCollapsed) {
            <div class="whitespace-nowrap">
              <h1 class="text-white font-bold text-lg leading-tight">TruckFleet</h1>
              <p class="text-gray-400 text-xs">Manager</p>
            </div>
          }
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="flex-1 py-4 overflow-y-auto dark-scrollbar">
        @for (section of navSections; track section.title) {
          <div class="px-4 mb-6">
            @if (!isCollapsed) {
              <p class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3 px-2">
                {{ section.title }}
              </p>
            }
            <ul class="space-y-1">
              @for (item of section.items; track item.route) {
                <li>
                  <a 
                    [routerLink]="item.route"
                    routerLinkActive="bg-orange-500 text-white"
                    [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                    class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 
                           hover:bg-gray-700/50 hover:text-white transition-all"
                    [class.justify-center]="isCollapsed"
                    [title]="isCollapsed ? item.label : ''"
                  >
                    <span class="material-icons-outlined text-xl">{{ item.icon }}</span>
                    @if (!isCollapsed) {
                      <span class="font-medium">{{ item.label }}</span>
                      @if (item.badge) {
                        <span 
                          class="ml-auto text-xs px-2 py-0.5 rounded-full"
                          [ngClass]="getBadgeClasses(item.badgeColor)"
                        >
                          {{ item.badge }}
                        </span>
                      }
                    }
                  </a>
                </li>
              }
            </ul>
          </div>
        }
      </nav>
      
      <!-- Collapse Button -->
      <div class="p-4 border-t border-gray-700/50">
        <button 
          (click)="toggleCollapse.emit()"
          class="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg 
                 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all"
        >
          <span class="material-icons-outlined">
            {{ isCollapsed ? 'chevron_right' : 'chevron_left' }}
          </span>
          @if (!isCollapsed) {
            <span class="text-sm">Comprimi</span>
          }
        </button>
      </div>
      
      <!-- User Profile -->
      <div class="p-4 border-t border-gray-700/50">
        <div 
          class="flex items-center gap-3 px-2"
          [class.justify-center]="isCollapsed"
        >
          <div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full 
                      flex items-center justify-center text-white font-semibold flex-shrink-0">
            MR
          </div>
          @if (!isCollapsed) {
            <div class="flex-1 min-w-0">
              <p class="text-white font-medium text-sm truncate">Mario Rossi</p>
              <p class="text-gray-400 text-xs truncate">Amministratore</p>
            </div>
            <button class="text-gray-400 hover:text-white transition-colors">
              <span class="material-icons-outlined text-xl">settings</span>
            </button>
          }
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .dark-scrollbar::-webkit-scrollbar { width: 6px; }
    .dark-scrollbar::-webkit-scrollbar-track { background: #1a1f2e; }
    .dark-scrollbar::-webkit-scrollbar-thumb { background: #3b4255; border-radius: 3px; }
  `]
})
export class SidebarComponent {
  @Input() isCollapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  navSections: NavSection[] = [
    {
      title: 'Principale',
      items: [
        { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
        { label: 'Mappa Live', icon: 'map', route: '/live-map', badge: 3, badgeColor: 'green' }
      ]
    },
    {
      title: 'Operazioni',
      items: [
        { label: 'Viaggi', icon: 'route', route: '/trips', badge: 12, badgeColor: 'accent' },
        { label: 'Veicoli', icon: 'local_shipping', route: '/vehicles' },
        { label: 'Autisti', icon: 'badge', route: '/drivers' },
        { label: 'Clienti', icon: 'business', route: '/clients' }
      ]
    },
    {
      title: 'Gestione',
      items: [
        { label: 'Fatture', icon: 'receipt_long', route: '/invoices', badge: 3, badgeColor: 'red' },
        { label: 'Manutenzioni', icon: 'build', route: '/maintenance' },
        { label: 'Rifornimenti', icon: 'local_gas_station', route: '/fuel' }
      ]
    }
  ];

  getBadgeClasses(color?: 'accent' | 'green' | 'red'): string {
    switch (color) {
      case 'green':
        return 'bg-green-500/20 text-green-400';
      case 'red':
        return 'bg-red-500/20 text-red-400';
      case 'accent':
      default:
        return 'bg-orange-500/20 text-orange-400';
    }
  }
}