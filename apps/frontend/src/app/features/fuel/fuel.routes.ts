import { Routes } from '@angular/router';

export const FUEL_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/fuel-list/fuel-list.component')
      .then(m => m.FuelListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/fuel-form/fuel-form.component')
      .then(m => m.FuelFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/fuel-detail/fuel-detail.component')
      .then(m => m.FuelDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/fuel-form/fuel-form.component')
      .then(m => m.FuelFormComponent)
  }
];
