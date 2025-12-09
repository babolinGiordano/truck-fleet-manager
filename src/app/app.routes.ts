import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent)
      },
      {
        path: 'vehicles',
        loadChildren: () => import('./features/vehicles/vehicles.routes')
          .then(m => m.VEHICLES_ROUTES)
      },
      {
        path: 'drivers',
        loadChildren: () => import('./features/drivers/drivers.routes')
          .then(m => m.DRIVERS_ROUTES)
      },
      {
        path: 'trips',
        loadComponent: () => import('./features/trips/trip-list.component')
          .then(m => m.TripListComponent)
      },
      {
        path: 'clients',
        loadChildren: () => import('./features/clients/clients.routes')
          .then(m => m.CLIENTS_ROUTES)
      },
      {
        path: 'invoices',
        loadComponent: () => import('./features/invoices/invoice-list.component')
          .then(m => m.InvoiceListComponent)
      },
      {
        path: 'maintenance',
        loadComponent: () => import('./features/maintenance/maintenance-list.component')
          .then(m => m.MaintenanceListComponent)
      },
      {
        path: 'fuel',
        loadComponent: () => import('./features/fuel/fuel-list.component')
          .then(m => m.FuelListComponent)
      },
      {
        path: 'live-map',
        loadComponent: () => import('./features/live-map/live-map.component')
          .then(m => m.LiveMapComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];