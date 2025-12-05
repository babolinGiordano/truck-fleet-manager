import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
        <div class="relative hidden md:block">
          <span class="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
            search
          </span>
          <input 
            type="text" 
            placeholder="Cerca..."
            [(ngModel)]="searchQuery"
            class="w-64 pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm 
                   focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          >
        </div>
        
        <!-- Notifications -->
        <button 
          class="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 
                 rounded-lg transition-all"
        >
          <span class="material-icons-outlined">notifications</span>
          @if (unreadNotifications() > 0) {
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          }
        </button>
        
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
  
  searchQuery = '';
  unreadNotifications = signal(4);
  
  currentDate = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}