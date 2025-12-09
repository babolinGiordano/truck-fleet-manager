import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Driver } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/drivers';

  // State con Signals
  private driversSignal = signal<Driver[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private selectedDriverSignal = signal<Driver | null>(null);

  // Public readonly signals
  readonly drivers = this.driversSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedDriver = this.selectedDriverSignal.asReadonly();

  // Computed signals
  readonly driverCount = computed(() => this.driversSignal().length);
  
  readonly driversByStatus = computed(() => {
    const drivers = this.driversSignal();
    return {
      active: drivers.filter(v => v.status === 'active'),
      on_leave: drivers.filter(v => v.status === 'on_leave'),
      inactive: drivers.filter(v => v.status === 'inactive')
    };
  });

  readonly activeCount = computed(() => 
    this.driversSignal().filter(v => v.status === 'active').length
  );

  // CRUD Operations

  loadDrivers(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Driver[]>(this.apiUrl).pipe(
      tap(drivers => {
        this.driversSignal.set(drivers);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Errore nel caricamento degli autisti');
        this.loadingSignal.set(false);
        console.error('Error loading drivers:', err);
        return of([]);
      })
    ).subscribe();
  }

  getDriver(id: string): Observable<Driver> {
    this.loadingSignal.set(true);
    return this.http.get<Driver>(`${this.apiUrl}/${id}`).pipe(
      tap(driver => {
        this.selectedDriverSignal.set(driver);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Autista non trovato');
        this.loadingSignal.set(false);
        throw err;
      })
    );
  }

  createDriver(driver: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Observable<Driver> {
    const newDriver = {
      ...driver,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Driver>(this.apiUrl, newDriver).pipe(
      tap(created => {
        this.driversSignal.update(drivers => [...drivers, created]);
      })
    );
  }

  updateDriver(id: string, updates: Partial<Driver>): Observable<Driver> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Driver>(`${this.apiUrl}/${id}`, updatedData).pipe(
      tap(updated => {
        this.driversSignal.update(drivers => 
          drivers.map(v => v.id === id ? updated : v)
        );
        if (this.selectedDriverSignal()?.id === id) {
          this.selectedDriverSignal.set(updated);
        }
      })
    );
  }

  deleteDriver(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.driversSignal.update(drivers => 
          drivers.filter(v => v.id !== id)
        );
        if (this.selectedDriverSignal()?.id === id) {
          this.selectedDriverSignal.set(null);
        }
      })
    );
  }

  clearSelectedDriver(): void {
    this.selectedDriverSignal.set(null);
  }

  private generateId(): string {
    return 'v' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}