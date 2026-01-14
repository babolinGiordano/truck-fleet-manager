import { Component, OnInit, inject, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvoicesService } from '../../../../core/services/invoices.service';
import { ClientsService } from '../../../../core/services/clients.service';
import { TripsService } from '../../../../core/services/trips.service';
import { Invoice, InvoiceStatus, INVOICE_STATUS_LABELS, InvoiceItem, Trip } from '../../../../models';

@Component({
  selector: 'app-invoice-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './invoice-form.component.html'
})
export class InvoiceFormComponent implements OnInit {
  @Input() id?: string;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private invoicesService = inject(InvoicesService);
  clientsService = inject(ClientsService);
  tripsService = inject(TripsService);

  form!: FormGroup;
  saving = signal(false);
  selectedClientId = signal<string>('');
  statusLabels = INVOICE_STATUS_LABELS;

  statusOptions: { value: InvoiceStatus; label: string }[] = [
    { value: 'draft', label: 'Bozza' },
    { value: 'sent', label: 'Inviata' },
    { value: 'paid', label: 'Pagata' },
    { value: 'overdue', label: 'Scaduta' },
    { value: 'cancelled', label: 'Annullata' }
  ];

  // Viaggi filtrati per cliente selezionato
  clientTrips = computed(() => {
    const clientId = this.selectedClientId();
    if (!clientId) return [];

    return this.tripsService.trips().filter(trip =>
      trip.clientId === clientId && trip.status === 'completed'
    );
  });

  get isEditMode(): boolean {
    return !!this.id;
  }

  get itemsArray(): FormArray {
    return this.form.get('items') as FormArray;
  }

  subtotal = computed(() => {
    const items = this.itemsArray?.value || [];
    return items.reduce((sum: number, item: InvoiceItem) => sum + (item.totalPrice || 0), 0);
  });

  vatAmount = computed(() => {
    const rate = this.form?.get('vatRate')?.value || 22;
    return this.subtotal() * rate / 100;
  });

  total = computed(() => {
    return this.subtotal() + this.vatAmount();
  });

  ngOnInit(): void {
    this.clientsService.loadClients();
    this.tripsService.loadTrips();
    this.initForm();

    if (this.isEditMode && this.id) {
      this.loadInvoice();
    } else {
      // Non aggiungere righe di default - l'utente deve aggiungerle manualmente
      // Generate invoice number
      this.generateInvoiceNumber();
    }
  }

  onClientChange(clientId: string): void {
    // Se il cliente è cambiato rispetto a quello precedente
    if (this.selectedClientId() !== clientId) {
      this.selectedClientId.set(clientId);

      // In modalità creazione, svuota le voci esistenti
      if (!this.isEditMode) {
        this.itemsArray.clear();
      }
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      invoiceNumber: ['', [Validators.required]],
      clientId: ['', [Validators.required]],
      issueDate: [this.getTodayDate(), [Validators.required]],
      dueDate: [this.getDefaultDueDate(), [Validators.required]],
      status: ['draft' as InvoiceStatus, [Validators.required]],
      vatRate: [22, [Validators.required, Validators.min(0), Validators.max(100)]],
      notes: [''],
      paidDate: [''],
      items: this.fb.array([])
    });
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private getDefaultDueDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toISOString().split('T')[0];
  }

  private generateInvoiceNumber(): void {
    const year = new Date().getFullYear();
    const invoices = this.invoicesService.invoices();
    const yearInvoices = invoices.filter(i => i.invoiceNumber.includes(`FT-${year}`));
    const nextNumber = yearInvoices.length + 1;
    const invoiceNumber = `FT-${year}-${nextNumber.toString().padStart(3, '0')}`;
    this.form.patchValue({ invoiceNumber });
  }

  private loadInvoice(): void {
    this.invoicesService.getInvoice(this.id!).subscribe({
      next: (invoice) => {
        // Setta il cliente selezionato per filtrare i viaggi
        this.selectedClientId.set(invoice.clientId);

        this.form.patchValue({
          invoiceNumber: invoice.invoiceNumber,
          clientId: invoice.clientId,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          status: invoice.status,
          vatRate: invoice.vatRate,
          notes: invoice.notes || '',
          paidDate: invoice.paidDate || ''
        });

        // Clear existing items and add loaded ones
        this.itemsArray.clear();
        invoice.items.forEach(item => {
          this.addItem(item);
        });
      },
      error: () => {
        this.router.navigate(['/invoices']);
      }
    });
  }

  createItemGroup(item?: InvoiceItem): FormGroup {
    return this.fb.group({
      description: [item?.description || '', [Validators.required]],
      quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
      unitPrice: [item?.unitPrice || 0, [Validators.required, Validators.min(0)]],
      totalPrice: [item?.totalPrice || 0],
      tripId: [item?.tripId || '']
    });
  }

  addItem(item?: InvoiceItem): void {
    this.itemsArray.push(this.createItemGroup(item));
  }

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  updateItemTotal(index: number): void {
    const item = this.itemsArray.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const unitPrice = item.get('unitPrice')?.value || 0;
    item.patchValue({ totalPrice: quantity * unitPrice });
  }

  onTripSelect(index: number, tripId: string): void {
    if (!tripId) return;

    // Cerca il viaggio in tutti i viaggi
    const trip = this.tripsService.trips().find(t => t.id === tripId);
    if (trip) {
      const item = this.itemsArray.at(index) as FormGroup;
      const price = trip.price || 0;

      // Aggiorna i singoli controlli e forza l'aggiornamento
      item.controls['description'].setValue(`Trasporto ${trip.origin.city} - ${trip.destination.city}`);
      item.controls['unitPrice'].setValue(price);
      item.controls['quantity'].setValue(1);
      item.controls['totalPrice'].setValue(price);

      // Forza l'aggiornamento della validità
      item.updateValueAndValidity();
    }
  }

  calculateTotals(): { subtotal: number; vatAmount: number; total: number } {
    const items = this.itemsArray.value as InvoiceItem[];
    const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const vatRate = this.form.get('vatRate')?.value || 22;
    const vatAmount = subtotal * vatRate / 100;
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  }

  onSubmit(): void {
    if (this.form.invalid || this.itemsArray.length === 0) return;

    this.saving.set(true);
    const formData = this.form.value;
    const totals = this.calculateTotals();

    const invoiceData = {
      invoiceNumber: formData.invoiceNumber,
      clientId: formData.clientId,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      status: formData.status,
      items: formData.items,
      subtotal: totals.subtotal,
      vatRate: formData.vatRate,
      vatAmount: totals.vatAmount,
      total: totals.total,
      notes: formData.notes || undefined,
      paidDate: formData.status === 'paid' ? (formData.paidDate || this.getTodayDate()) : undefined
    };

    const operation = this.isEditMode
      ? this.invoicesService.updateInvoice(this.id!, invoiceData)
      : this.invoicesService.createInvoice(invoiceData as Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>);

    operation.subscribe({
      next: (invoice) => {
        this.router.navigate(['/invoices', invoice.id]);
      },
      error: (err) => {
        console.error('Error saving invoice:', err);
        this.saving.set(false);
      }
    });
  }

  // Ritorna i viaggi del cliente che non sono ancora stati usati nelle voci
  getAvailableTrips(): Trip[] {
    const usedTripIds = this.itemsArray.value
      .map((item: InvoiceItem) => item.tripId)
      .filter((id: string) => id);

    return this.clientTrips().filter(trip => !usedTripIds.includes(trip.id));
  }
}
