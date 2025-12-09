import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriversService } from '../../../../core/services/drivers.service';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { Driver, DRIVER_STATUS_LABELS, DriverStatus } from '../../../../models';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-driver-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgeComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './driver-list.component.html'
})
export class DriverListComponent {
  driversService = inject(DriversService);

  searchQuery = '';
  statusFilter = signal<DriverStatus | null>(null);
  driverToDelete = signal<Driver | null>(null);

  statusLabels = DRIVER_STATUS_LABELS;

  statusOptions: { value: DriverStatus; label: string }[] = [
    { value: 'active', label: 'Attivo' },
    { value: 'on_leave', label: 'In Ferie' },
    { value: 'inactive', label: 'Inattivi' }
  ];

  filteredDrivers = computed(() => {
    let drivers = this.driversService.drivers();

    // Filter by status
    const status = this.statusFilter();
    if (status) {
      drivers = drivers.filter(v => v.status === status);
    }

    // Filter by search query
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      drivers = drivers.filter(d =>
        d.firstName.toLowerCase().includes(query) ||
        d.lastName.toLowerCase().includes(query) ||
        d.fiscalCode.toLowerCase().includes(query) ||
        d.phone.includes(query)
      );
    }

    return drivers;
  });

  ngOnInit(): void {
    this.driversService.loadDrivers();
  }

  isExpiringSoon(dateStr: string): boolean {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }

  confirmDelete(driver: Driver): void {
    this.driverToDelete.set(driver);
  }

  deleteDriver(): void {
    const driver = this.driverToDelete();
    if (driver) {
      this.driversService.deleteDriver(driver.id).subscribe({
        next: () => {
          this.driverToDelete.set(null);
        },
        error: (err) => {
          console.error('Error deleting driver:', err);
        }
      });
    }
  }
}