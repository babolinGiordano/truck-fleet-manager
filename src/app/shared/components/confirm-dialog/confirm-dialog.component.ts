import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      (click)="cancel.emit()"
    >
      <!-- Dialog -->
      <div 
        class="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        (click)="$event.stopPropagation()"
      >
        <!-- Icon -->
        <div class="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
             [ngClass]="confirmColor === 'red' ? 'bg-red-100' : 'bg-accent/10'">
          <span class="material-icons-outlined text-2xl"
                [ngClass]="confirmColor === 'red' ? 'text-red-600' : 'text-accent'">
            {{ icon }}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-lg font-semibold text-gray-800 text-center mb-2">
          {{ title }}
        </h3>

        <!-- Message -->
        <p class="text-gray-600 text-center mb-6">
          {{ message }}
        </p>

        <!-- Actions -->
        <div class="flex gap-3">
          <button 
            (click)="cancel.emit()"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                   hover:bg-gray-50 font-medium transition-all"
          >
            {{ cancelText }}
          </button>
          <button 
            (click)="confirm.emit()"
            class="flex-1 px-4 py-2 rounded-lg font-medium transition-all text-white"
            [ngClass]="confirmColor === 'red' ? 'bg-red-600 hover:bg-red-700' : 'bg-accent hover:bg-accent-dark'"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() title = 'Conferma';
  @Input() message = 'Sei sicuro di voler procedere?';
  @Input() confirmText = 'Conferma';
  @Input() cancelText = 'Annulla';
  @Input() confirmColor: 'accent' | 'red' = 'accent';
  @Input() icon = 'warning';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}