import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { VEHICLE_STATUS_LABELS } from '../../../../models/vehicle.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

@Component({
    selector: 'app-vehicle-detail',
    imports: [CommonModule, RouterModule, StatusBadgeComponent],
    templateUrl:'./vehicle-detail.component.html'
})
export class VehicleDetailComponent implements OnInit {
  @Input() id!: string; // From route param
  
  vehiclesService = inject(VehiclesService);
  private router = inject(Router);

  statusLabels = VEHICLE_STATUS_LABELS;

  ngOnInit(): void {
    if (this.id) {
      this.vehiclesService.getVehicle(this.id).subscribe({
        error: () => this.router.navigate(['/vehicles'])
      });
    }
  }

  isExpiringSoon(dateStr: string): boolean {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  }
}