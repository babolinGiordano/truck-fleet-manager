import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { NavSection } from '../../models/nav.model';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
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