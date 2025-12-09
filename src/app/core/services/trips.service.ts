import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Trip, TripStatus } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class TripsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/trips';

  // State con Signals
  private tripsSignal = signal<Trip[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private selectedTripSignal = signal<Trip | null>(null);

  // Public readonly signals
  readonly trips = this.tripsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedTrip = this.selectedTripSignal.asReadonly();

  // Computed signals
  readonly tripCount = computed(() => this.tripsSignal().length);

  readonly tripsByStatus = computed(() => {
    const trips = this.tripsSignal();
    return {
      planned: trips.filter(t => t.status === 'planned'),
      in_progress: trips.filter(t => t.status === 'in_progress'),
      completed: trips.filter(t => t.status === 'completed'),
      cancelled: trips.filter(t => t.status === 'cancelled')
    };
  });

  readonly plannedCount = computed(() =>
    this.tripsSignal().filter(t => t.status === 'planned').length
  );

  readonly inProgressCount = computed(() =>
    this.tripsSignal().filter(t => t.status === 'in_progress').length
  );

  readonly completedCount = computed(() =>
    this.tripsSignal().filter(t => t.status === 'completed').length
  );

  readonly cancelledCount = computed(() =>
    this.tripsSignal().filter(t => t.status === 'cancelled').length
  );

  // CRUD Operations

  loadTrips(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Trip[]>(this.apiUrl).pipe(
      tap(trips => {
        this.tripsSignal.set(trips);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Errore nel caricamento dei viaggi');
        this.loadingSignal.set(false);
        console.error('Error loading trips:', err);
        return of([]);
      })
    ).subscribe();
  }

  getTrip(id: string): Observable<Trip> {
    this.loadingSignal.set(true);
    return this.http.get<Trip>(`${this.apiUrl}/${id}`).pipe(
      tap(trip => {
        this.selectedTripSignal.set(trip);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Viaggio non trovato');
        this.loadingSignal.set(false);
        throw err;
      })
    );
  }

  createTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Observable<Trip> {
    const newTrip = {
      ...trip,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Trip>(this.apiUrl, newTrip).pipe(
      tap(created => {
        this.tripsSignal.update(trips => [...trips, created]);
      })
    );
  }

  updateTrip(id: string, updates: Partial<Trip>): Observable<Trip> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Trip>(`${this.apiUrl}/${id}`, updatedData).pipe(
      tap(updated => {
        this.tripsSignal.update(trips =>
          trips.map(t => t.id === id ? updated : t)
        );
        if (this.selectedTripSignal()?.id === id) {
          this.selectedTripSignal.set(updated);
        }
      })
    );
  }

  deleteTrip(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.tripsSignal.update(trips =>
          trips.filter(t => t.id !== id)
        );
        if (this.selectedTripSignal()?.id === id) {
          this.selectedTripSignal.set(null);
        }
      })
    );
  }

  clearSelectedTrip(): void {
    this.selectedTripSignal.set(null);
  }

  private generateId(): string {
    return 't' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}
