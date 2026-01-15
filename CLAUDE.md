# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Truck Fleet Manager is a monorepo containing an Angular 19 frontend and Spring Boot backend for managing truck fleet operations.

## Monorepo Structure

```
truck-fleet-manager/
├── apps/
│   ├── frontend/          # Angular 19 app
│   └── backend/           # Spring Boot API (Java 21)
├── libs/
│   └── shared/            # Shared TypeScript types (frontend)
├── docker-compose.yml     # PostgreSQL + Redis
└── pnpm-workspace.yaml    # Workspace config
```

**Tech Stack:**
- **Frontend:** Angular 19.2, TypeScript 5.8, SCSS, Tailwind CSS 3.4, Angular Material 19.2
- **Backend:** Java 21, Spring Boot 3.4, Spring Data JPA, PostgreSQL, Flyway, Swagger/OpenAPI
- **Shared:** TypeScript interfaces for frontend entities

## Development Commands

```bash
# Root commands
pnpm install             # Install frontend dependencies
pnpm dev                 # Start frontend + backend concurrently
pnpm build               # Build all packages

# Frontend
pnpm dev:frontend        # Start Angular dev server (port 4200)
pnpm build:frontend      # Production build

# Backend (requires Java 21 + Maven)
pnpm dev:backend         # Start Spring Boot with hot reload (port 3000)
pnpm build:backend       # Production build (mvn package)
pnpm test:backend        # Run backend tests

# Database
pnpm docker:up           # Start PostgreSQL + Redis containers
pnpm docker:down         # Stop containers
```

## Architecture

### Frontend (`apps/frontend/`)

- `src/app/core/services/` - Signals-based services with RxJS
- `src/app/features/` - Lazy-loaded feature modules (dashboard, vehicles, drivers, etc.)
- `src/app/layout/` - Main layout with header and sidebar
- `src/app/shared/` - Reusable components, pipes, directives
- `src/app/models/` - Re-exports from `@truck-fleet/shared`

### Backend (`apps/backend/`)

Spring Boot application with layered architecture:

- `src/main/java/com/truckfleet/`
  - `config/` - CORS, OpenAPI configuration
  - `entity/` - JPA entities
  - `entity/enums/` - Status and type enums
  - `repository/` - Spring Data JPA repositories
  - `dto/` - Request/Response DTOs with validation
  - `mapper/` - MapStruct mappers
  - `service/` - Business logic
  - `controller/` - REST controllers
  - `common/exception/` - Exception handling
- `src/main/resources/`
  - `application.yml` - Configuration
  - `db/migration/` - Flyway migrations
- API prefix: `/api` (configured via context-path)
- Swagger docs: `/api/docs/swagger-ui.html`

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
```java
// Controller - REST endpoints with Swagger annotations
// Service - Business logic with transactions
// Repository - Spring Data JPA interface
// DTO - Jakarta validation annotations
// Mapper - MapStruct interface
```

## API Endpoints

All endpoints prefixed with `/api`:

| Resource | Endpoints |
|----------|-----------|
| Vehicles | GET/POST `/vehicles`, GET/PATCH/DELETE `/vehicles/{id}` |
| Drivers | GET/POST `/drivers`, GET/PATCH/DELETE `/drivers/{id}` |
| Clients | GET/POST `/clients`, GET/PATCH/DELETE `/clients/{id}` |
| Trips | GET/POST `/trips`, GET/PATCH/DELETE `/trips/{id}` |
| Invoices | GET/POST `/invoices`, GET/PATCH/DELETE `/invoices/{id}` |
| Fuel | GET/POST `/fuel`, GET/PATCH/DELETE `/fuel/{id}` |
| Maintenance | GET/POST `/maintenance`, GET/PATCH/DELETE `/maintenance/{id}` |

## Database

PostgreSQL via Docker. Schema managed by Flyway migrations in `apps/backend/src/main/resources/db/migration/`.

**Main entities:** Vehicle, Driver, Client, Trip, Invoice, InvoiceItem, FuelRecord, MaintenanceRecord

**Enums:** VehicleStatus, DriverStatus, TripStatus, InvoiceStatus, FuelType, MaintenanceType, MaintenanceStatus

## Styling

- Primary styling with Tailwind utility classes
- Custom colors: sidebar `#1a1f2e`, accent orange `#f97316`
- Material Icons (outlined variant)
- All UI text in Italian

## Environment Variables

Backend (`.env` or system environment):
- `DATABASE_URL` - PostgreSQL JDBC URL (default: jdbc:postgresql://localhost:5432/truck_fleet)
- `DB_USERNAME` - Database username (default: truck_admin)
- `DB_PASSWORD` - Database password (default: truck_secret_2024)
- `PORT` - API port (default: 3000)
- `CORS_ORIGIN` - Frontend URL for CORS (default: http://localhost:4200)

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 9.0.0
- **Java** 21 (LTS)
- **Maven** 3.9+
- **Docker** (for PostgreSQL)
