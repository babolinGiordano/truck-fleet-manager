import { Routes } from '@angular/router';

export const MAINTENANCE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/maintenance-list/maintenance-list.component')
      .then(m => m.MaintenanceListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/maintenance-form/maintenance-form.component')
      .then(m => m.MaintenanceFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/maintenance-detail/maintenance-detail.component')
      .then(m => m.MaintenanceDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/maintenance-form/maintenance-form.component')
      .then(m => m.MaintenanceFormComponent)
  }
];
