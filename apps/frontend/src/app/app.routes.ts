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
        loadChildren: () => import('./features/trips/trips.routes')
          .then(m => m.TRIPS_ROUTES)
      },
      {
        path: 'clients',
        loadChildren: () => import('./features/clients/clients.routes')
          .then(m => m.CLIENTS_ROUTES)
      },
      {
        path: 'invoices',
        loadChildren: () => import('./features/invoices/invoices.routes')
          .then(m => m.INVOICES_ROUTES)
      },
      {
        path: 'maintenance',
        loadChildren: () => import('./features/maintenance/maintenance.routes')
          .then(m => m.MAINTENANCE_ROUTES)
      },
      {
        path: 'fuel',
        loadChildren: () => import('./features/fuel/fuel.routes')
          .then(m => m.FUEL_ROUTES)
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