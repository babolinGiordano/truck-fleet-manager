import { Component, OnInit, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { InvoicesService } from '../../../../core/services/invoices.service';
import { ClientsService } from '../../../../core/services/clients.service';
import { TripsService } from '../../../../core/services/trips.service';
import { Invoice, INVOICE_STATUS_LABELS, Client, Trip } from '../../../../models';

@Component({
  selector: 'app-invoice-detail',
  imports: [
    CommonModule,
    RouterModule,
    StatusBadgeComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './invoice-detail.component.html'
})
export class InvoiceDetailComponent implements OnInit {
  @Input() id!: string;

  invoicesService = inject(InvoicesService);
  private clientsService = inject(ClientsService);
  private tripsService = inject(TripsService);
  private router = inject(Router);

  statusLabels = INVOICE_STATUS_LABELS;
  invoiceToDelete = signal<Invoice | null>(null);
  isPrinting = signal(false);

  ngOnInit(): void {
    if (this.id) {
      this.invoicesService.getInvoice(this.id).subscribe({
        error: () => this.router.navigate(['/invoices'])
      });
      this.clientsService.loadClients();
      this.tripsService.loadTrips();
    }
  }

  getClient(clientId: string): Client | null {
    return this.clientsService.clients().find(c => c.id === clientId) || null;
  }

  getTrip(tripId: string): Trip | null {
    return this.tripsService.trips().find(t => t.id === tripId) || null;
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
          this.router.navigate(['/invoices']);
        },
        error: (err) => {
          console.error('Error deleting invoice:', err);
        }
      });
    }
  }

  printInvoice(): void {
    this.isPrinting.set(true);

    // Piccolo delay per far vedere il loading
    setTimeout(() => {
      const invoice = this.invoicesService.selectedInvoice();
      const client = invoice ? this.getClient(invoice.clientId) : null;

      if (!invoice || !client) {
        this.isPrinting.set(false);
        return;
      }

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        this.isPrinting.set(false);
        return;
      }

      const itemsHtml = invoice.items.map(item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">€ ${item.unitPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">€ ${item.totalPrice.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</td>
        </tr>
      `).join('');

      const html = `
        <!DOCTYPE html>
        <html lang="it">
        <head>
          <meta charset="UTF-8">
          <title>Fattura ${invoice.invoiceNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #1f2937;
              line-height: 1.5;
            }
            .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #f97316;
            }
            .company-info h1 {
              font-size: 24px;
              color: #f97316;
              margin-bottom: 8px;
            }
            .company-info p {
              color: #6b7280;
              font-size: 14px;
            }
            .invoice-info {
              text-align: right;
            }
            .invoice-info h2 {
              font-size: 28px;
              color: #1f2937;
              margin-bottom: 8px;
            }
            .invoice-info .number {
              font-size: 18px;
              color: #f97316;
              font-weight: 600;
            }
            .invoice-info .dates {
              margin-top: 12px;
              font-size: 14px;
              color: #6b7280;
            }
            .parties {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }
            .party {
              width: 45%;
            }
            .party h3 {
              font-size: 12px;
              text-transform: uppercase;
              color: #9ca3af;
              margin-bottom: 8px;
              letter-spacing: 0.5px;
            }
            .party .name {
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
              margin-bottom: 4px;
            }
            .party p {
              font-size: 14px;
              color: #6b7280;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            thead {
              background: #f9fafb;
            }
            th {
              padding: 12px;
              text-align: left;
              font-size: 12px;
              text-transform: uppercase;
              color: #6b7280;
              border-bottom: 2px solid #e5e7eb;
            }
            th:nth-child(2), th:nth-child(3), th:nth-child(4) {
              text-align: center;
            }
            th:last-child {
              text-align: right;
            }
            .totals {
              margin-left: auto;
              width: 300px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .totals-row.total {
              font-size: 18px;
              font-weight: 700;
              color: #1f2937;
              border-bottom: none;
              padding-top: 16px;
              border-top: 2px solid #1f2937;
            }
            .totals-row span:first-child {
              color: #6b7280;
            }
            .notes {
              margin-top: 40px;
              padding: 20px;
              background: #f9fafb;
              border-radius: 8px;
            }
            .notes h4 {
              font-size: 14px;
              color: #6b7280;
              margin-bottom: 8px;
            }
            .notes p {
              font-size: 14px;
              color: #1f2937;
            }
            .footer {
              margin-top: 60px;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .status-paid { background: #dcfce7; color: #166534; }
            .status-sent { background: #dbeafe; color: #1e40af; }
            .status-draft { background: #f3f4f6; color: #374151; }
            .status-overdue { background: #fee2e2; color: #991b1b; }
            .status-cancelled { background: #f3f4f6; color: #6b7280; }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h1>Truck Fleet Manager</h1>
              <p>Gestione Flotta Trasporti</p>
              <p>Via Esempio, 123 - 00100 Roma</p>
              <p>P.IVA: 12345678901</p>
            </div>
            <div class="invoice-info">
              <h2>FATTURA</h2>
              <div class="number">${invoice.invoiceNumber}</div>
              <div class="dates">
                <p>Data emissione: ${new Date(invoice.issueDate).toLocaleDateString('it-IT')}</p>
                <p>Data scadenza: ${new Date(invoice.dueDate).toLocaleDateString('it-IT')}</p>
              </div>
              <div style="margin-top: 12px;">
                <span class="status-badge status-${invoice.status}">${this.statusLabels[invoice.status]}</span>
              </div>
            </div>
          </div>

          <div class="parties">
            <div class="party">
              <h3>Emittente</h3>
              <p class="name">Truck Fleet Manager S.r.l.</p>
              <p>Via Esempio, 123</p>
              <p>00100 Roma (RM)</p>
              <p>P.IVA: 12345678901</p>
            </div>
            <div class="party">
              <h3>Cliente</h3>
              <p class="name">${client.companyName}</p>
              <p>${client.address}</p>
              <p>${client.postalCode} ${client.city} (${client.province})</p>
              <p>P.IVA: ${client.vatNumber}</p>
              ${client.sdiCode ? `<p>SDI: ${client.sdiCode}</p>` : ''}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Descrizione</th>
                <th>Qtà</th>
                <th>Prezzo Unit.</th>
                <th>Totale</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row">
              <span>Imponibile</span>
              <span>€ ${invoice.subtotal.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="totals-row">
              <span>IVA (${invoice.vatRate}%)</span>
              <span>€ ${invoice.vatAmount.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
            </div>
            <div class="totals-row total">
              <span>Totale</span>
              <span>€ ${invoice.total.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          ${invoice.notes ? `
          <div class="notes">
            <h4>Note</h4>
            <p>${invoice.notes}</p>
          </div>
          ` : ''}

          ${invoice.paidDate ? `
          <div class="notes" style="background: #dcfce7;">
            <h4>Pagamento ricevuto</h4>
            <p>Data pagamento: ${new Date(invoice.paidDate).toLocaleDateString('it-IT')}</p>
          </div>
          ` : ''}

          <div class="footer">
            <p>Documento generato automaticamente da Truck Fleet Manager</p>
            <p>Stampato il ${new Date().toLocaleDateString('it-IT')} alle ${new Date().toLocaleTimeString('it-IT')}</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
      this.isPrinting.set(false);
    }, 300);
  }

  markAsPaid(): void {
    const invoice = this.invoicesService.selectedInvoice();
    if (invoice) {
      this.invoicesService.updateInvoice(invoice.id, {
        status: 'paid',
        paidDate: new Date().toISOString().split('T')[0]
      }).subscribe();
    }
  }

  markAsSent(): void {
    const invoice = this.invoicesService.selectedInvoice();
    if (invoice) {
      this.invoicesService.updateInvoice(invoice.id, {
        status: 'sent'
      }).subscribe();
    }
  }
}
