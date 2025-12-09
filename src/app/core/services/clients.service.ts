import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Client } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/clients';

  // State con Signals
  private clientsSignal = signal<Client[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private selectedClientSignal = signal<Client | null>(null);

  // Public readonly signals
  readonly clients = this.clientsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedClient = this.selectedClientSignal.asReadonly();

  // Computed signals
  readonly clientCount = computed(() => this.clientsSignal().length);
  readonly activeCount = computed(() => this.clientsSignal().filter(c => c.isActive).length);
  readonly inactiveCount = computed(() => this.clientsSignal().filter(c => !c.isActive).length);

  // CRUD Operations

  loadClients(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Client[]>(this.apiUrl).pipe(
      tap(clients => {
        this.clientsSignal.set(clients);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Errore nel caricamento dei clienti');
        this.loadingSignal.set(false);
        console.error('Error loading clients:', err);
        return of([]);
      })
    ).subscribe();
  }

  getClient(id: string): Observable<Client> {
    this.loadingSignal.set(true);
    return this.http.get<Client>(`${this.apiUrl}/${id}`).pipe(
      tap(client => {
        this.selectedClientSignal.set(client);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Cliente non trovato');
        this.loadingSignal.set(false);
        throw err;
      })
    );
  }

  createClient(client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Observable<Client> {
    const newClient = {
      ...client,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Client>(this.apiUrl, newClient).pipe(
      tap(created => {
        this.clientsSignal.update(clients => [...clients, created]);
      })
    );
  }

  updateClient(id: string, updates: Partial<Client>): Observable<Client> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Client>(`${this.apiUrl}/${id}`, updatedData).pipe(
      tap(updated => {
        this.clientsSignal.update(clients =>
          clients.map(c => c.id === id ? updated : c)
        );
        if (this.selectedClientSignal()?.id === id) {
          this.selectedClientSignal.set(updated);
        }
      })
    );
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.clientsSignal.update(clients =>
          clients.filter(c => c.id !== id)
        );
        if (this.selectedClientSignal()?.id === id) {
          this.selectedClientSignal.set(null);
        }
      })
    );
  }

  clearSelectedClient(): void {
    this.selectedClientSignal.set(null);
  }

  private generateId(): string {
    return 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}