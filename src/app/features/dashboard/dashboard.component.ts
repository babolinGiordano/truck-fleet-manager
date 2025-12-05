import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { AlertsPanelComponent } from './components/alerts-panel/alerts-panel.component';
import { RecentTripsComponent } from './components/recent-trips/recent-trips.component';
import { TripsChartComponent } from './components/trips-chart/trips-chart.component';
import { MapPreviewComponent } from './components/map-preview/map-preview.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    KpiCardComponent,
    AlertsPanelComponent,
    RecentTripsComponent,
    TripsChartComponent,
    MapPreviewComponent
  ],
  template: `
    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <app-kpi-card
        title="Viaggi oggi"
        [value]="stats().tripsToday"
        icon="route"
        iconBgColor="bg-blue-100"
        iconColor="text-blue-600"
        [trend]="12"
        trendDirection="up"
      />
      <app-kpi-card
        title="Veicoli in transito"
        [value]="stats().vehiclesInTransit"
        icon="local_shipping"
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
        [isLive]="true"
      />
      <app-kpi-card
        title="Km questo mese"
        [value]="stats().kmThisMonth"
        [formatNumber]="true"
        icon="speed"
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
        [trend]="8"
        trendDirection="up"
      />
      <app-kpi-card
        title="Fatturato mese"
        [value]="stats().revenueThisMonth"
        [isCurrency]="true"
        icon="payments"
        iconBgColor="bg-orange-100"
        iconColor="text-orange-600"
        [trend]="15"
        trendDirection="up"
      />
    </div>

    <!-- Main Grid: Map + Alerts -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Map Preview (2 cols) -->
      <div class="lg:col-span-2">
        <app-map-preview [vehiclesInTransit]="stats().vehiclesInTransit" />
      </div>
      
      <!-- Alerts Panel -->
      <app-alerts-panel [alerts]="alerts()" />
    </div>

    <!-- Bottom Section: Recent Trips + Chart -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <app-recent-trips [trips]="recentTrips()" />
      <app-trips-chart [data]="chartData()" />
    </div>
  `
})
export class DashboardComponent {
  // Stats con Signals
  stats = signal({
    tripsToday: 8,
    vehiclesInTransit: 3,
    kmThisMonth: 24850,
    revenueThisMonth: 42300
  });
  
  // Alerts
  alerts = signal([
    {
      id: '1',
      type: 'danger' as const,
      icon: 'warning',
      title: 'Patente in scadenza',
      description: 'Marco Bianchi - scade tra 7 giorni'
    },
    {
      id: '2',
      type: 'warning' as const,
      icon: 'build',
      title: 'Manutenzione programmata',
      description: 'FH 123 AB - tagliando 28/11'
    },
    {
      id: '3',
      type: 'warning' as const,
      icon: 'receipt_long',
      title: 'Fattura in scadenza',
      description: 'FT-2024-089 - LogiTrans SRL'
    },
    {
      id: '4',
      type: 'info' as const,
      icon: 'local_gas_station',
      title: 'Consumo anomalo',
      description: 'GH 789 CD - +15% vs media'
    }
  ]);
  
  // Recent Trips
  recentTrips = signal([
    {
      id: 't1',
      route: 'Milano → Roma',
      client: 'TechCorp SRL',
      vehicle: 'FH 123 AB',
      status: 'completed' as const,
      price: 850,
      km: 574
    },
    {
      id: 't2',
      route: 'Torino → Napoli',
      client: 'LogiTrans SRL',
      vehicle: 'DE 456 FG',
      status: 'in_progress' as const,
      price: 1200,
      km: 912
    },
    {
      id: 't3',
      route: 'Bologna → Bari',
      client: 'FastDelivery',
      vehicle: 'GH 789 CD',
      status: 'planned' as const,
      price: 680,
      km: 680
    }
  ]);
  
  // Chart Data
  chartData = signal([
    { month: 'Gen', value: 45 },
    { month: 'Feb', value: 52 },
    { month: 'Mar', value: 38 },
    { month: 'Apr', value: 65 },
    { month: 'Mag', value: 48 },
    { month: 'Giu', value: 72 },
    { month: 'Lug', value: 55 },
    { month: 'Ago', value: 35 },
    { month: 'Set', value: 62 },
    { month: 'Ott', value: 78 },
    { month: 'Nov', value: 85 },
    { month: 'Dic', value: 25, isProjection: true }
  ]);
}
