import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { InvoicesService } from '../../../../core/services/invoices.service';
import { ClientsService } from '../../../../core/services/clients.service';
import { Invoice, InvoiceStatus, INVOICE_STATUS_LABELS, Client } from '../../../../models';

@Component({
  selector: 'app-invoice-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    StatusBadgeComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './invoice-list.component.html'
})
export class InvoiceListComponent implements OnInit {
  private route = inject(ActivatedRoute);
  invoicesService = inject(InvoicesService);
  private clientsService = inject(ClientsService);

  searchQuery = signal('');
  statusFilter = signal<InvoiceStatus | null>(null);
  clientIdFilter = signal<string | null>(null);
  invoiceToDelete = signal<Invoice | null>(null);
  filteringClient = signal<Client | null>(null);

  statusLabels = INVOICE_STATUS_LABELS;

  statusOptions: { value: InvoiceStatus; label: string }[] = [
    { value: 'draft', label: 'Bozze' },
    { value: 'sent', label: 'Inviate' },
    { value: 'paid', label: 'Pagate' },
    { value: 'overdue', label: 'Scadute' },
    { value: 'cancelled', label: 'Annullate' }
  ];

  filteredInvoices = computed(() => {
    let invoices = this.invoicesService.invoices();

    // Filter by clientId (from query param)
    const clientId = this.clientIdFilter();
    if (clientId) {
      invoices = invoices.filter(i => i.clientId === clientId);
    }

    // Filter by status
    const status = this.statusFilter();
    if (status) {
      invoices = invoices.filter(i => i.status === status);
    }

    // Filter by search query
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      const clients = this.clientsService.clients();

      invoices = invoices.filter(i => {
        // Search in invoice fields
        if (i.invoiceNumber.toLowerCase().includes(query)) return true;

        // Search in client name
        if (i.clientId) {
          const client = clients.find(c => c.id === i.clientId);
          if (client?.companyName.toLowerCase().includes(query)) return true;
        }

        return false;
      });
    }

    return invoices;
  });

  ngOnInit(): void {
    this.invoicesService.loadInvoices();
    this.clientsService.loadClients();

    // Check for clientId query param
    this.route.queryParams.subscribe(params => {
      const clientId = params['clientId'];
      if (clientId) {
        this.clientIdFilter.set(clientId);
        // Find the client to display name
        const client = this.clientsService.clients().find(c => c.id === clientId);
        this.filteringClient.set(client || null);
      }
    });
  }

  clearClientFilter(): void {
    this.clientIdFilter.set(null);
    this.filteringClient.set(null);
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  getClient(clientId: string): Client | null {
    if (!clientId) return null;
    return this.clientsService.clients().find(c => c.id === clientId) || null;
  }

  isOverdue(invoice: Invoice): boolean {
    if (invoice.status === 'paid' || invoice.status === 'cancelled') return false;
    const dueDate = new Date(invoice.dueDate);
    const today = new Date();
    return dueDate < today;
  }

  confirmDelete(invoice: Invoice): void {
    this.invoiceToDelete.set(invoice);
  }

  deleteInvoice(): void {
    const invoice = this.invoiceToDelete();
    if (invoice) {
      this.invoicesService.deleteInvoice(invoice.id).subscribe({
        next: () => {
          this.invoiceToDelete.set(null);
        },
        error: (err) => {
          console.error('Error deleting invoice:', err);
        }
      });
    }
  }
}
