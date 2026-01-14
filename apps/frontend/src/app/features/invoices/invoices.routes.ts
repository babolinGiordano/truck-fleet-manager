import { Routes } from '@angular/router';

export const INVOICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/invoice-list/invoice-list.component')
      .then(m => m.InvoiceListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/invoice-form/invoice-form.component')
      .then(m => m.InvoiceFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/invoice-detail/invoice-detail.component')
      .then(m => m.InvoiceDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/invoice-form/invoice-form.component')
      .then(m => m.InvoiceFormComponent)
  }
];