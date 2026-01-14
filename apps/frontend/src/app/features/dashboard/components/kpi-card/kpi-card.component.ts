import { Component, Input } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-kpi-card',
    imports: [CommonModule, DecimalPipe],
    template: `
    <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div class="flex items-center justify-between mb-4">
        <div 
          class="w-12 h-12 rounded-lg flex items-center justify-center"
          [ngClass]="iconBgColor"
        >
          <span class="material-icons-outlined" [ngClass]="iconColor">{{ icon }}</span>
        </div>
        
        @if (isLive) {
          <span class="flex items-center gap-1 text-green-500">
            <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium">Live</span>
          </span>
        } @else if (trend !== undefined) {
          <span 
            class="text-sm font-medium flex items-center gap-1"
            [ngClass]="trendDirection === 'up' ? 'text-green-500' : 'text-red-500'"
          >
            <span class="material-icons-outlined text-sm">
              {{ trendDirection === 'up' ? 'trending_up' : 'trending_down' }}
            </span>
            {{ trendDirection === 'up' ? '+' : '-' }}{{ trend }}%
          </span>
        }
      </div>
      
      <p class="text-3xl font-bold text-gray-800">
        @if (isCurrency) {
          € {{ value | number:'1.0-0':'it-IT' }}
        } @else if (formatNumber) {
          {{ value | number:'1.0-0':'it-IT' }}
        } @else {
          {{ value }}
        }
      </p>
      <p class="text-gray-500 text-sm mt-1">{{ title }}</p>
    </div>
  `
})
export class KpiCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number;
  @Input({ required: true }) icon!: string;
  @Input() iconBgColor = 'bg-gray-100';
  @Input() iconColor = 'text-gray-600';
  @Input() trend?: number;
  @Input() trendDirection: 'up' | 'down' = 'up';
  @Input() isLive = false;
  @Input() isCurrency = false;
  @Input() formatNumber = false;
}