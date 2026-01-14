export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  tripId?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  notes?: string;
  paidDate?: string;
  createdAt: string;
  updatedAt: string;
}

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  draft: 'Bozza',
  sent: 'Inviata',
  paid: 'Pagata',
  overdue: 'Scaduta',
  cancelled: 'Annullata'
};
