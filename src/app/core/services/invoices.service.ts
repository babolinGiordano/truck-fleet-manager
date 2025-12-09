import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { Invoice } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/invoices';

  // State con Signals
  private invoicesSignal = signal<Invoice[]>([]);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);
  private selectedInvoiceSignal = signal<Invoice | null>(null);

  // Public readonly signals
  readonly invoices = this.invoicesSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly selectedInvoice = this.selectedInvoiceSignal.asReadonly();

  // Computed signals
  readonly invoiceCount = computed(() => this.invoicesSignal().length);
  readonly draftCount = computed(() => this.invoicesSignal().filter(i => i.status === 'draft').length);
  readonly sentCount = computed(() => this.invoicesSignal().filter(i => i.status === 'sent').length);
  readonly paidCount = computed(() => this.invoicesSignal().filter(i => i.status === 'paid').length);
  readonly overdueCount = computed(() => this.invoicesSignal().filter(i => i.status === 'overdue').length);
  readonly cancelledCount = computed(() => this.invoicesSignal().filter(i => i.status === 'cancelled').length);

  readonly totalRevenue = computed(() =>
    this.invoicesSignal()
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + i.total, 0)
  );

  readonly totalPending = computed(() =>
    this.invoicesSignal()
      .filter(i => i.status === 'sent' || i.status === 'overdue')
      .reduce((sum, i) => sum + i.total, 0)
  );

  // CRUD Operations

  loadInvoices(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.http.get<Invoice[]>(this.apiUrl).pipe(
      tap(invoices => {
        this.invoicesSignal.set(invoices);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Errore nel caricamento delle fatture');
        this.loadingSignal.set(false);
        console.error('Error loading invoices:', err);
        return of([]);
      })
    ).subscribe();
  }

  getInvoice(id: string): Observable<Invoice> {
    this.loadingSignal.set(true);
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`).pipe(
      tap(invoice => {
        this.selectedInvoiceSignal.set(invoice);
        this.loadingSignal.set(false);
      }),
      catchError(err => {
        this.errorSignal.set('Fattura non trovata');
        this.loadingSignal.set(false);
        throw err;
      })
    );
  }

  createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Observable<Invoice> {
    const newInvoice = {
      ...invoice,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return this.http.post<Invoice>(this.apiUrl, newInvoice).pipe(
      tap(created => {
        this.invoicesSignal.update(invoices => [...invoices, created]);
      })
    );
  }

  updateInvoice(id: string, updates: Partial<Invoice>): Observable<Invoice> {
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    return this.http.patch<Invoice>(`${this.apiUrl}/${id}`, updatedData).pipe(
      tap(updated => {
        this.invoicesSignal.update(invoices =>
          invoices.map(i => i.id === id ? updated : i)
        );
        if (this.selectedInvoiceSignal()?.id === id) {
          this.selectedInvoiceSignal.set(updated);
        }
      })
    );
  }

  deleteInvoice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.invoicesSignal.update(invoices =>
          invoices.filter(i => i.id !== id)
        );
        if (this.selectedInvoiceSignal()?.id === id) {
          this.selectedInvoiceSignal.set(null);
        }
      })
    );
  }

  clearSelectedInvoice(): void {
    this.selectedInvoiceSignal.set(null);
  }

  private generateId(): string {
    return 'inv' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}
