import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Fuel, FuelType } from '../../models/fuel.model';

@Injectable({
  providedIn: 'root'
})
export class FuelService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/fuel';

  // State con Signals
  private fuelRecordsSignal = signal<Fuel[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private selectedFuelSignal = signal<Fuel | null>(null);

  // Public readonly signals
  readonly fuelRecords = this.fuelRecordsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedFuel = this.selectedFuelSignal.asReadonly();

  // Computed signals
  readonly fuelCount = computed(() => this.fuelRecordsSignal().length);

  readonly fuelByType = computed(() => {
    const records = this.fuelRecordsSignal();
    return {
      diesel: records.filter(r => r.fuelType === 'diesel'),
      gasoline: records.filter(r => r.fuelType === 'gasoline'),
      lpg: records.filter(r => r.fuelType === 'lpg'),
      methane: records.filter(r => r.fuelType === 'methane'),
      electric: records.filter(r => r.fuelType === 'electric')
    };
  });

  readonly totalLiters = computed(() =>
    this.fuelRecordsSignal().reduce((sum, r) => sum + r.liters, 0)
  );

  readonly totalCost = computed(() =>
    this.fuelRecordsSignal().reduce((sum, r) => sum + r.totalCost, 0)
  );

  readonly averagePricePerLiter = computed(() => {
    const records = this.fuelRecordsSignal();
    if (records.length === 0) return 0;
    const total = records.reduce((sum, r) => sum + r.pricePerLiter, 0);
    return total / records.length;
  });

  // CRUD Operations

  loadFuelRecords(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Fuel[]>(this.apiUrl).pipe(
      tap(records => {
        this.fuelRecordsSignal.set(records);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Errore nel caricamento dei rifornimenti');
        this.loadingSignal.set(false);
        console.error('Error loading fuel records:', err);
        return of([]);
      })
    ).subscribe();
  }

  getFuelRecord(id: string): Observable<Fuel> {
    this.loadingSignal.set(true);
    return this.http.get<Fuel>(`${this.apiUrl}/${id}`).pipe(
      tap(record => {
        this.selectedFuelSignal.set(record);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Rifornimento non trovato');
        this.loadingSignal.set(false);
        throw err;
      })
    );
  }

  createFuelRecord(record: Omit<Fuel, 'id' | 'createdAt' | 'updatedAt'>): Observable<Fuel> {
    const newRecord = {
      ...record,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Fuel>(this.apiUrl, newRecord).pipe(
      tap(created => {
        this.fuelRecordsSignal.update(records => [...records, created]);
      })
    );
  }

  updateFuelRecord(id: string, updates: Partial<Fuel>): Observable<Fuel> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Fuel>(`${this.apiUrl}/${id}`, updatedData).pipe(
      tap(updated => {
        this.fuelRecordsSignal.update(records =>
          records.map(r => r.id === id ? updated : r)
        );
        if (this.selectedFuelSignal()?.id === id) {
          this.selectedFuelSignal.set(updated);
        }
      })
    );
  }

  deleteFuelRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.fuelRecordsSignal.update(records =>
          records.filter(r => r.id !== id)
        );
        if (this.selectedFuelSignal()?.id === id) {
          this.selectedFuelSignal.set(null);
        }
      })
    );
  }

  clearSelectedFuel(): void {
    this.selectedFuelSignal.set(null);
  }

  private generateId(): string {
    return 'f' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}
