import { Routes } from '@angular/router';

export const INVOICES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/invoice-list/invoice-list.component')
      .then(m => m.InvoiceListComponent)
  },
  // {
  //   path: 'new',
  //   loadComponent: () => import('./components/vehicle-form/vehicle-form.component')
  //     .then(m => m.VehicleFormComponent)
  // },
  // {
  //   path: ':id',
  //   loadComponent: () => import('./components/vehicle-detail/vehicle-detail.component')
  //     .then(m => m.VehicleDetailComponent)
  // },
  // {
  //   path: ':id/edit',
  //   loadComponent: () => import('./components/vehicle-form/vehicle-form.component')
  //     .then(m => m.VehicleFormComponent)
  // }
];