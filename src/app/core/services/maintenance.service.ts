import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Maintenance, MaintenanceStatus, MaintenanceType } from '../../models/maintenance.model';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/maintenance';

  // State con Signals
  private maintenanceRecordsSignal = signal<Maintenance[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private selectedMaintenanceSignal = signal<Maintenance | null>(null);

  // Public readonly signals
  readonly maintenanceRecords = this.maintenanceRecordsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedMaintenance = this.selectedMaintenanceSignal.asReadonly();

  // Computed signals
  readonly maintenanceCount = computed(() => this.maintenanceRecordsSignal().length);

  readonly maintenanceByStatus = computed(() => {
    const records = this.maintenanceRecordsSignal();
    return {
      scheduled: records.filter(r => r.status === 'scheduled'),
      in_progress: records.filter(r => r.status === 'in_progress'),
      completed: records.filter(r => r.status === 'completed'),
      cancelled: records.filter(r => r.status === 'cancelled')
    };
  });

  readonly maintenanceByType = computed(() => {
    const records = this.maintenanceRecordsSignal();
    return {
      oil_change: records.filter(r => r.type === 'oil_change'),
      tires: records.filter(r => r.type === 'tires'),
      brakes: records.filter(r => r.type === 'brakes'),
      filters: records.filter(r => r.type === 'filters'),
      revision: records.filter(r => r.type === 'revision'),
      repair: records.filter(r => r.type === 'repair'),
      other: records.filter(r => r.type === 'other')
    };
  });

  readonly totalCost = computed(() =>
    this.maintenanceRecordsSignal()
      .filter(r => r.status === 'completed')
      .reduce((sum, r) => sum + r.cost, 0)
  );

  readonly scheduledCount = computed(() =>
    this.maintenanceRecordsSignal().filter(r => r.status === 'scheduled').length
  );

  readonly completedCount = computed(() =>
    this.maintenanceRecordsSignal().filter(r => r.status === 'completed').length
  );

  // CRUD Operations

  loadMaintenanceRecords(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Maintenance[]>(this.apiUrl).pipe(
      tap(records => {
        this.maintenanceRecordsSignal.set(records);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Errore nel caricamento delle manutenzioni');
        this.loadingSignal.set(false);
        console.error('Error loading maintenance records:', err);
        return of([]);
      })
    ).subscribe();
  }

  getMaintenanceRecord(id: string): Observable<Maintenance> {
    this.loadingSignal.set(true);
    return this.http.get<Maintenance>(`${this.apiUrl}/${id}`).pipe(
      tap(record => {
        this.selectedMaintenanceSignal.set(record);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Manutenzione non trovata');
        this.loadingSignal.set(false);
        throw err;
      })
    );
  }

  createMaintenanceRecord(record: Omit<Maintenance, 'id' | 'createdAt' | 'updatedAt'>): Observable<Maintenance> {
    const newRecord = {
      ...record,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Maintenance>(this.apiUrl, newRecord).pipe(
      tap(created => {
        this.maintenanceRecordsSignal.update(records => [...records, created]);
      })
    );
  }

  updateMaintenanceRecord(id: string, updates: Partial<Maintenance>): Observable<Maintenance> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Maintenance>(`${this.apiUrl}/${id}`, updatedData).pipe(
      tap(updated => {
        this.maintenanceRecordsSignal.update(records =>
          records.map(r => r.id === id ? updated : r)
        );
        if (this.selectedMaintenanceSignal()?.id === id) {
          this.selectedMaintenanceSignal.set(updated);
        }
      })
    );
  }

  deleteMaintenanceRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.maintenanceRecordsSignal.update(records =>
          records.filter(r => r.id !== id)
        );
        if (this.selectedMaintenanceSignal()?.id === id) {
          this.selectedMaintenanceSignal.set(null);
        }
      })
    );
  }

  clearSelectedMaintenance(): void {
    this.selectedMaintenanceSignal.set(null);
  }

  private generateId(): string {
    return 'm' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}
