import { Component, OnInit, inject, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { TripsService } from '../../../../core/services/trips.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { DriversService } from '../../../../core/services/drivers.service';
import { ClientsService } from '../../../../core/services/clients.service';
import { TRIP_STATUS_LABELS } from '../../../../models';

@Component({
  selector: 'app-trip-detail',
  imports: [CommonModule, RouterModule, StatusBadgeComponent],
  templateUrl: './trip-detail.component.html'
})
export class TripDetailComponent implements OnInit {
  @Input() id!: string; // From route param

  tripsService = inject(TripsService);
  private vehiclesService = inject(VehiclesService);
  private driversService = inject(DriversService);
  private clientsService = inject(ClientsService);
  private router = inject(Router);

  statusLabels = TRIP_STATUS_LABELS;

  // Computed per ottenere le entità correlate
  vehicle = computed(() => {
    const trip = this.tripsService.selectedTrip();
    if (!trip?.vehicleId) return null;
    return this.vehiclesService.vehicles().find(v => v.id === trip.vehicleId) || null;
  });

  driver = computed(() => {
    const trip = this.tripsService.selectedTrip();
    if (!trip?.driverId) return null;
    return this.driversService.drivers().find(d => d.id === trip.driverId) || null;
  });

  client = computed(() => {
    const trip = this.tripsService.selectedTrip();
    if (!trip?.clientId) return null;
    return this.clientsService.clients().find(c => c.id === trip.clientId) || null;
  });

  ngOnInit(): void {
    // Carica i dati correlati
    this.vehiclesService.loadVehicles();
    this.driversService.loadDrivers();
    this.clientsService.loadClients();

    if (this.id) {
      this.tripsService.getTrip(this.id).subscribe({
        error: () => this.router.navigate(['/trips'])
      });
    }
  }
}
