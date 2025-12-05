import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Vehicle, VehicleStatus } from '../../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/vehicles';

  // State con Signals
  private vehiclesSignal = signal<Vehicle[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private selectedVehicleSignal = signal<Vehicle | null>(null);

  // Public readonly signals
  readonly vehicles = this.vehiclesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedVehicle = this.selectedVehicleSignal.asReadonly();

  // Computed signals
  readonly vehicleCount = computed(() => this.vehiclesSignal().length);
  
  readonly vehiclesByStatus = computed(() => {
    const vehicles = this.vehiclesSignal();
    return {
      available: vehicles.filter(v => v.status === 'available'),
      in_transit: vehicles.filter(v => v.status === 'in_transit'),
      maintenance: vehicles.filter(v => v.status === 'maintenance'),
      inactive: vehicles.filter(v => v.status === 'inactive')
    };
  });

  readonly inTransitCount = computed(() => 
    this.vehiclesSignal().filter(v => v.status === 'in_transit').length
  );

  readonly availableCount = computed(() => 
    this.vehiclesSignal().filter(v => v.status === 'available').length
  );

  // CRUD Operations

  loadVehicles(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Vehicle[]>(this.apiUrl).pipe(
      tap(vehicles => {
        this.vehiclesSignal.set(vehicles);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Errore nel caricamento dei veicoli');
        this.loadingSignal.set(false);
        console.error('Error loading vehicles:', err);
        return of([]);
      })
    ).subscribe();
  }

  getVehicle(id: string): Observable<Vehicle> {
    this.loadingSignal.set(true);
    return this.http.get<Vehicle>(`${this.apiUrl}/${id}`).pipe(
      tap(vehicle => {
        this.selectedVehicleSignal.set(vehicle);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Veicolo non trovato');
        this.loadingSignal.set(false);
        throw err;
      })
    );
  }

  createVehicle(vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>): Observable<Vehicle> {
    const newVehicle = {
      ...vehicle,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Vehicle>(this.apiUrl, newVehicle).pipe(
      tap(created => {
        this.vehiclesSignal.update(vehicles => [...vehicles, created]);
      })
    );
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): Observable<Vehicle> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Vehicle>(`${this.apiUrl}/${id}`, updatedData).pipe(
      tap(updated => {
        this.vehiclesSignal.update(vehicles => 
          vehicles.map(v => v.id === id ? updated : v)
        );
        if (this.selectedVehicleSignal()?.id === id) {
          this.selectedVehicleSignal.set(updated);
        }
      })
    );
  }

  deleteVehicle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.vehiclesSignal.update(vehicles => 
          vehicles.filter(v => v.id !== id)
        );
        if (this.selectedVehicleSignal()?.id === id) {
          this.selectedVehicleSignal.set(null);
        }
      })
    );
  }

  clearSelectedVehicle(): void {
    this.selectedVehicleSignal.set(null);
  }

  private generateId(): string {
    return 'v' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}