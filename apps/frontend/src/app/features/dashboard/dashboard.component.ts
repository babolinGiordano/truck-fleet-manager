import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { AlertsPanelComponent } from './components/alerts-panel/alerts-panel.component';
import { RecentTripsComponent } from './components/recent-trips/recent-trips.component';
import { TripsChartComponent } from './components/trips-chart/trips-chart.component';
import { MapPreviewComponent } from './components/map-preview/map-preview.component';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
    selector: 'app-dashboard',
    imports: [
        CommonModule,
        RouterModule,
        KpiCardComponent,
        AlertsPanelComponent,
        RecentTripsComponent,
        TripsChartComponent,
        MapPreviewComponent
    ],
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  // Expose signals from service
  stats = this.dashboardService.stats;
  alerts = this.dashboardService.alerts;
  recentTrips = this.dashboardService.recentTrips;
  chartData = this.dashboardService.chartData;
  chartYear = this.dashboardService.chartYear;
  availableYears = this.dashboardService.availableYears;
  liveVehicles = this.dashboardService.liveVehicles;
  loading = this.dashboardService.loading;
  error = this.dashboardService.error;

  ngOnInit(): void {
    this.dashboardService.loadDashboard();
  }

  onYearChange(year: number): void {
    this.dashboardService.loadChartYear(year);
  }
}
