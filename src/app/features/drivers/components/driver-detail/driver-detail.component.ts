import { CommonModule } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { StatusBadgeComponent } from "../../../../shared/components/status-badge/status-badge.component";
import { DriversService } from "../../../../core/services/drivers.service";
import { DRIVER_STATUS_LABELS } from "../../../../models";

@Component({
    selector: 'app-driver-detail',
    imports: [CommonModule, RouterModule, StatusBadgeComponent],
    templateUrl:'./driver-detail.component.html'
})
export class DriverDetailComponent implements OnInit {
  @Input() id!: string; // From route param
  
  driversService = inject(DriversService);
  private router = inject(Router);

  statusLabels = DRIVER_STATUS_LABELS;

  ngOnInit(): void {
    if (this.id) {
      this.driversService.getDriver(this.id).subscribe({
        error: () => this.router.navigate(['/drivers'])
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