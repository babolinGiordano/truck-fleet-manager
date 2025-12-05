import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChartData {
  month: string;
  value: number;
  isProjection?: boolean;
}

@Component({
  selector: 'app-trips-chart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100">
      <div class="p-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="material-icons-outlined text-gray-500">bar_chart</span>
          <h3 class="font-semibold text-gray-800">Viaggi per Mese</h3>
        </div>
        <select 
          [(ngModel)]="selectedYear"
          class="text-sm text-gray-600 bg-gray-100 border-0 rounded-lg px-3 py-1.5 
                 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          <option value="2024">2024</option>
          <option value="2023">2023</option>
        </select>
      </div>
      
      <div class="p-6">
        <!-- Chart bars -->
        <div class="flex items-end justify-between h-48 gap-2">
          @for (item of data; track item.month) {
            <div class="flex-1 flex flex-col items-center gap-2">
              <div 
                class="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
                [ngClass]="item.isProjection ? 'bg-gray-200' : 'bg-orange-500'"
                [style.height.%]="getBarHeight(item.value)"
              ></div>
              <span 
                class="text-xs"
                [ngClass]="item.isProjection ? 'text-gray-400' : 'text-gray-500'"
              >
                {{ item.month }}
              </span>
            </div>
          }
        </div>
        
        <!-- Legend -->
        <div class="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-orange-500 rounded"></div>
            <span class="text-sm text-gray-600">Completati</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-gray-200 rounded"></div>
            <span class="text-sm text-gray-600">Proiezione</span>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TripsChartComponent {
  @Input() data: ChartData[] = [];
  selectedYear = '2024';

  getBarHeight(value: number): number {
    const maxValue = Math.max(...this.data.map(d => d.value));
    return maxValue > 0 ? (value / maxValue) * 100 : 0;
  }
}