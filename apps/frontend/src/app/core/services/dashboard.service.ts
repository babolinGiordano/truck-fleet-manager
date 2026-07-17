import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';
import { DashboardResponse, DashboardStats, DashboardAlert, RecentTrip, MonthlyTripData, LiveVehicle } from '../../models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  // State con Signals
  private statsSignal = signal<DashboardStats>({
    tripsToday: 0,
    vehiclesInTransit: 0,
    kmThisMonth: 0,
    revenueThisMonth: 0
  });
  private alertsSignal = signal<DashboardAlert[]>([]);
  private recentTripsSignal = signal<RecentTrip[]>([]);
  private chartDataSignal = signal<MonthlyTripData[]>([]);
  private chartYearSignal = signal<number>(new Date().getFullYear());
  private availableYearsSignal = signal<number[]>([]);
  private liveVehiclesSignal = signal<LiveVehicle[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Public readonly signals
  readonly stats = this.statsSignal.asReadonly();
  readonly alerts = this.alertsSignal.asReadonly();
  readonly recentTrips = this.recentTripsSignal.asReadonly();
  readonly chartData = this.chartDataSignal.asReadonly();
  readonly chartYear = this.chartYearSignal.asReadonly();
  readonly availableYears = this.availableYearsSignal.asReadonly();
  readonly liveVehicles = this.liveVehiclesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  loadDashboard(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<DashboardResponse>(this.apiUrl).pipe(
      tap(response => {
        this.statsSignal.set(response.stats);
        this.alertsSignal.set(response.alerts);
        this.recentTripsSignal.set(response.recentTrips);
        this.liveVehiclesSignal.set(response.liveVehicles ?? []);
        this.setChartState(response);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Errore nel caricamento della dashboard');
        this.loadingSignal.set(false);
        console.error('Error loading dashboard:', err);
        return of(null);
      })
    ).subscribe();
  }

  /** Reloads only the chart, so switching year does not blank the whole dashboard. */
  loadChartYear(year: number): void {
    this.http.get<DashboardResponse>(`${this.apiUrl}?year=${year}`).pipe(
      tap(response => this.setChartState(response)),
      catchError(err => {
        console.error('Error loading chart data:', err);
        return of(null);
      })
    ).subscribe();
  }

  private setChartState(response: DashboardResponse): void {
    this.chartDataSignal.set(response.chartData);
    this.chartYearSignal.set(response.chartYear ?? new Date().getFullYear());
    this.availableYearsSignal.set(response.availableYears ?? []);
  }
}
