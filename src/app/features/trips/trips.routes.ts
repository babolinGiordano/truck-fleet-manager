import { Routes } from '@angular/router';

export const TRIPS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/trip-list/trip-list.component')
      .then(m => m.TripListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./components/trip-form/trip-form.component')
      .then(m => m.TripFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./components/trip-detail/trip-detail.component')
      .then(m => m.TripDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./components/trip-form/trip-form.component')
      .then(m => m.TripFormComponent)
  }
];