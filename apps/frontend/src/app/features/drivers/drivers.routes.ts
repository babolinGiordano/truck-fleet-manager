import { Routes } from '@angular/router';

export const DRIVERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/driver-list/driver-list.component')
      .then(m => m.DriverListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/driver-form/driver-form.component')
      .then(m => m.DriverFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/driver-detail/driver-detail.component')
      .then(m => m.DriverDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/driver-form/driver-form.component')
      .then(m => m.DriverFormComponent)
  }
];