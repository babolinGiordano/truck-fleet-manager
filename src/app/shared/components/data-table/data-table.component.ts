import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              @for (col of columns; track col.key) {
                <th 
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  [style.width]="col.width"
                >
                  @if (col.sortable) {
                    <button 
                      (click)="sort(col.key)"
                      class="flex items-center gap-1 hover:text-gray-700"
                    >
                      {{ col.label }}
                      <span class="material-icons-outlined text-sm">unfold_more</span>
                    </button>
                  } @else {
                    {{ col.label }}
                  }
                </th>
              }
              @if (showActions) {
                <th class="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Azioni
                </th>
              }
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            @for (item of data; track trackBy(item)) {
              <tr class="hover:bg-gray-50 transition-colors">
                <ng-container 
                  [ngTemplateOutlet]="rowTemplate" 
                  [ngTemplateOutletContext]="{ $implicit: item }"
                />
              </tr>
            } @empty {
              <tr>
                <td [attr.colspan]="columns.length + (showActions ? 1 : 0)" class="px-6 py-12 text-center">
                  <ng-content select="[empty]" />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class DataTableComponent<T> {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() showActions = true;
  @Input() trackBy: (item: T) => any = (item: any) => item.id;

  @ContentChild('row') rowTemplate!: TemplateRef<any>;

  @Output() sortChange = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();

  private sortDirection: 'asc' | 'desc' = 'asc';
  private sortKey = '';

  sort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sortChange.emit({ key, direction: this.sortDirection });
  }
}