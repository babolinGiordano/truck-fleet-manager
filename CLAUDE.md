# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Truck Fleet Manager is a monorepo containing an Angular 19 frontend and NestJS backend for managing truck fleet operations. Built with TypeScript, featuring shared types between frontend and backend.

## Monorepo Structure

```
truck-fleet-manager/
├── apps/
│   ├── frontend/          # Angular 19 app
│   └── backend/           # NestJS API
├── libs/
│   └── shared/            # Shared TypeScript types
├── docker-compose.yml     # PostgreSQL + Redis
└── pnpm-workspace.yaml    # Workspace config
```

**Tech Stack:**
- **Frontend:** Angular 19.2, TypeScript 5.8, SCSS, Tailwind CSS 3.4, Angular Material 19.2
- **Backend:** NestJS 10, Prisma ORM, PostgreSQL, Swagger/OpenAPI
- **Shared:** TypeScript interfaces for all entities

## Development Commands

```bash
# Root commands
pnpm install             # Install all dependencies
pnpm dev                 # Start frontend + backend concurrently
pnpm build               # Build all packages

# Frontend
pnpm dev:frontend        # Start Angular dev server (port 4200)
pnpm build:frontend      # Production build

# Backend
pnpm dev:backend         # Start NestJS with hot reload (port 3000)
pnpm build:backend       # Production build

# Database
pnpm docker:up           # Start PostgreSQL + Redis containers
pnpm docker:down         # Stop containers
pnpm db:generate         # Generate Prisma client
pnpm db:migrate          # Run migrations
pnpm db:studio           # Open Prisma Studio
```

## Architecture

### Frontend (`apps/frontend/`)

- `src/app/core/services/` - Signals-based services with RxJS
- `src/app/features/` - Lazy-loaded feature modules (dashboard, vehicles, drivers, etc.)
- `src/app/layout/` - Main layout with header and sidebar
- `src/app/shared/` - Reusable components, pipes, directives
- `src/app/models/` - Re-exports from `@truck-fleet/shared`

### Backend (`apps/backend/`)

- `src/modules/` - Feature modules (vehicles, drivers, clients, trips, invoices, fuel, maintenance)
- `src/prisma/` - Prisma service and module
- `prisma/schema.prisma` - Database schema
- API prefix: `/api`
- Swagger docs: `/api/docs`

### Shared Library (`libs/shared/`)

- `src/models/` - TypeScript interfaces and constants
- Import as: `import { Vehicle, Driver } from '@truck-fleet/shared'`

## Key Patterns

**Frontend State Management:** Angular Signals
```typescript
private vehiclesSignal = signal<Vehicle[]>([]);
readonly vehicles = this.vehiclesSignal.asReadonly();
```

**Backend Module Structure:**
```typescript
// controller.ts - REST endpoints
// service.ts - Business logic with Prisma
// dto/ - Validation DTOs with class-validator
```

**Shared Types Import:**
```typescript
// Frontend
import { Vehicle, VehicleStatus } from '@truck-fleet/shared';

// Backend
import { Vehicle } from '@truck-fleet/shared';
```

## API Endpoints

All endpoints prefixed with `/api`:

| Resource | Endpoints |
|----------|-----------|
| Vehicles | GET/POST `/vehicles`, GET/PATCH/DELETE `/vehicles/:id` |
| Drivers | GET/POST `/drivers`, GET/PATCH/DELETE `/drivers/:id` |
| Clients | GET/POST `/clients`, GET/PATCH/DELETE `/clients/:id` |
| Trips | GET/POST `/trips`, GET/PATCH/DELETE `/trips/:id` |
| Invoices | GET/POST `/invoices`, GET/PATCH/DELETE `/invoices/:id` |
| Fuel | GET/POST `/fuel`, GET/PATCH/DELETE `/fuel/:id` |
| Maintenance | GET/POST `/maintenance`, GET/PATCH/DELETE `/maintenance/:id` |

## Database

PostgreSQL via Docker. Schema defined in `apps/backend/prisma/schema.prisma`.

**Main entities:** Vehicle, Driver, Client, Trip, Invoice, InvoiceItem, FuelRecord, MaintenanceRecord

## Styling

- Primary styling with Tailwind utility classes
- Custom colors: sidebar `#1a1f2e`, accent orange `#f97316`
- Material Icons (outlined variant)
- All UI text in Italian

## Environment Variables

Backend (`.env` in `apps/backend/`):
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - API port (default 3000)
- `CORS_ORIGIN` - Frontend URL for CORS

## CI/CD

GitHub Actions with selective deployment:
- `.github/workflows/deploy-frontend.yml` - Triggers on `apps/frontend/**` or `libs/shared/**`
- `.github/workflows/deploy-backend.yml` - Triggers on `apps/backend/**` or `libs/shared/**`
