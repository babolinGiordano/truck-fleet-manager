import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-status-badge',
    imports: [CommonModule],
    template: `
    <span 
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      [ngClass]="getBadgeClasses()"
    >
      {{ getLabel() }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) status!: string;
  @Input() labels: Record<string, string> = {};
  @Input() colorMap: Record<string, string> = {};

  // Default color mappings
  private defaultColors: Record<string, string> = {
    // Vehicle statuses
    available: 'bg-green-100 text-green-700',
    in_transit: 'bg-blue-100 text-blue-700',
    maintenance: 'bg-amber-100 text-amber-700',
    inactive: 'bg-gray-100 text-gray-700',
    
    // Trip statuses
    planned: 'bg-orange-100 text-orange-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    
    // Driver statuses
    active: 'bg-green-100 text-green-700',
    on_leave: 'bg-amber-100 text-amber-700',
    
    // Invoice statuses
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    
    // Maintenance statuses
    scheduled: 'bg-blue-100 text-blue-700'
  };

  getLabel(): string {
    return this.labels[this.status] || this.status;
  }

  getBadgeClasses(): string {
    return this.colorMap[this.status] || this.defaultColors[this.status] || 'bg-gray-100 text-gray-700';
  }
}