# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Truck Fleet Manager is an Angular 19.2 web application for managing truck fleet operations. Built with standalone components, signals-based state management, and Italian localization.

**Tech Stack:** Angular 19.2, TypeScript 5.8, SCSS, Tailwind CSS 3.4, Angular Material 19.2, NGX-Charts, Leaflet maps (@bluehalo/ngx-leaflet), JSON-Server mock backend.

## Development Commands

```bash
npm run dev          # Start app + mock API (recommended for development)
npm run start        # Start Angular dev server only (port 4200)
npm run api          # Start JSON-Server mock API only (port 3000)
npm run build        # Production build
npm test             # Run unit tests via Karma
```

## Architecture

### Directory Structure

- `src/app/core/services/` - Signals-based services with RxJS (e.g., `vehicles.service.ts`)
- `src/app/features/` - Lazy-loaded feature modules (dashboard, vehicles, drivers, trips, etc.)
- `src/app/layout/` - Main layout with header and sidebar components
- `src/app/shared/` - Reusable components (status-badge, confirm-dialog, data-table), pipes, directives
- `src/app/models/` - TypeScript interfaces with barrel exports in `index.ts`
- `mock-api/db.json` - JSON-Server database file

### Key Patterns

**State Management:** Angular Signals pattern
```typescript
private vehiclesSignal = signal<Vehicle[]>([]);
readonly vehicles = this.vehiclesSignal.asReadonly();
readonly vehicleCount = computed(() => this.vehiclesSignal().length);
```

**Components:** Standalone by default (Angular 19+) with `inject()` for DI
```typescript
@Component({
  imports: [CommonModule, ...],  // standalone: true is now the default
})
export class ComponentName {
  private service = inject(ServiceName);
}
```

**Routing:** Lazy-loaded via `loadComponent` in `app.routes.ts`

### Styling

- Primary styling with Tailwind utility classes
- Custom colors: sidebar `#1a1f2e`, accent orange `#f97316`
- Material Icons (outlined variant)
- Global styles in `src/styles.scss`

### Localization

All UI is in Italian:
- Labels: "Veicoli", "Autisti", "Fatturato mese"
- Dates/numbers: `it-IT` locale
- Status constants: `VEHICLE_STATUS_LABELS`, etc. export Italian text

## Data Models

- **Vehicle:** License plate, GPS position, status (available|in_transit|maintenance|inactive), insurance/revision dates
- **Driver:** Italian fiscal code, license/CQC/ADR expiry, status (active|on_leave|inactive)
- **Trip:** Origin/destination with coordinates, cargo info (weight, volume, ADR, temperature), pricing
- **Client:** Company data for invoicing

## Build Configuration

- Output: `dist/truck-fleet-manager`
- Production budgets: 500KB initial, 1MB max
- Tests skipped by default in schematics
- Strict TypeScript enabled
