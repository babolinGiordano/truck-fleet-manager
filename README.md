# Truck Fleet Manager

Sistema di gestione flotta camion con frontend Angular 19 e backend Spring Boot 3.4. Applicazione web completa per il monitoraggio e la gestione di veicoli, autisti, viaggi, clienti e fatturazione.

![Angular](https://img.shields.io/badge/Angular-19.2-dd0031?style=flat-square&logo=angular)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4-6db33f?style=flat-square&logo=springboot)
![Java](https://img.shields.io/badge/Java-21-ed8b00?style=flat-square&logo=openjdk)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?style=flat-square&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)

## Architettura

```
truck-fleet-manager/
├── apps/
│   ├── frontend/          # Angular 19 (porta 4200)
│   └── backend/           # Spring Boot 3.4 (porta 3000)
├── libs/
│   └── shared/            # TypeScript interfaces condivise
├── docker-compose.yml     # PostgreSQL + Redis
└── pnpm-workspace.yaml    # Monorepo config
```

## Funzionalita

### Dashboard
- **KPI in tempo reale**: viaggi giornalieri, veicoli in transito, chilometri mensili, fatturato
- **Mappa interattiva**: visualizzazione posizione veicoli con Leaflet
- **Pannello avvisi**: notifiche su scadenze e manutenzioni
- **Grafici**: statistiche viaggi con NGX-Charts

### Gestione Veicoli
- Anagrafica completa (targa, marca, modello, anno)
- Tracking posizione GPS
- Stati: disponibile, in transito, manutenzione, inattivo
- Monitoraggio scadenze assicurazione e revisione
- Contachilometri totale

### Gestione Autisti
- Anagrafica con codice fiscale italiano
- Gestione patenti e certificazioni (CQC, ADR)
- Stati: attivo, in ferie, inattivo
- Assegnazione a veicoli

### Gestione Viaggi
- Origine/destinazione con coordinate GPS
- Informazioni carico: peso, volume, ADR, temperatura
- Calcolo prezzi e tariffe
- Assegnazione veicolo e autista

### Gestione Clienti
- Anagrafica aziendale (P.IVA, PEC, SDI)
- Storico viaggi per cliente
- Dati per fatturazione elettronica

### Fatturazione
- Generazione fatture con voci multiple
- Tracking stato pagamenti (bozza, inviata, pagata, scaduta)
- Calcolo automatico IVA

### Altre Funzionalita
- **Mappa Live**: tracking real-time della flotta
- **Manutenzioni**: pianificazione e storico interventi
- **Rifornimenti**: registro consumi carburante

## Tech Stack

### Frontend
| Tecnologia | Versione |
|------------|----------|
| Angular | 19.2 |
| TypeScript | 5.8 |
| Tailwind CSS | 3.4 |
| Angular Material | 19.2 |
| Leaflet | 1.9 |
| NGX-Charts | 23.1 |

### Backend
| Tecnologia | Versione |
|------------|----------|
| Java | 21 (LTS) |
| Spring Boot | 3.4.1 |
| Spring Data JPA | 3.4 |
| PostgreSQL | 16 |
| Flyway | 11 |
| MapStruct | 1.6.3 |
| Lombok | 1.18 |
| SpringDoc OpenAPI | 2.7 |

## Requisiti

- **Node.js** 20+
- **pnpm** 9+
- **Java** 21
- **Maven** 3.9+
- **Docker** (per PostgreSQL)

## Installazione

```bash
# Clona il repository
git clone <repository-url>
cd truck-fleet-manager

# Installa pnpm (se non presente)
npm install -g pnpm

# Installa le dipendenze
pnpm install
```

## Avvio

### 1. Avvia il database

```bash
pnpm docker:up
```

Questo avvia PostgreSQL (porta 5432) e Redis (porta 6379) tramite Docker.

### 2. Avvia il backend

```bash
pnpm dev:backend
```

Il backend Spring Boot sara disponibile su http://localhost:3000/api

**Swagger UI**: http://localhost:3000/api/docs/swagger-ui.html

### 3. Avvia il frontend

```bash
pnpm dev:frontend
```

Il frontend Angular sara disponibile su http://localhost:4200

### Avvio rapido (tutto insieme)

```bash
pnpm docker:up      # Avvia PostgreSQL
pnpm dev            # Avvia frontend + backend
```

## Comandi Disponibili

| Comando | Descrizione |
|---------|-------------|
| `pnpm install` | Installa tutte le dipendenze |
| `pnpm dev` | Avvia frontend + backend |
| `pnpm dev:frontend` | Solo frontend Angular (porta 4200) |
| `pnpm dev:backend` | Solo backend Spring Boot (porta 3000) |
| `pnpm build` | Build produzione di entrambi |
| `pnpm build:frontend` | Build produzione frontend |
| `pnpm build:backend` | Build produzione backend (JAR) |
| `pnpm test` | Esegue tutti i test |
| `pnpm test:frontend` | Test frontend (Karma) |
| `pnpm test:backend` | Test backend (JUnit) |
| `pnpm docker:up` | Avvia PostgreSQL + Redis |
| `pnpm docker:down` | Ferma i container Docker |

## API Endpoints

Tutti gli endpoint sono prefissati con `/api`:

| Risorsa | Metodi | Endpoint |
|---------|--------|----------|
| Veicoli | GET, POST, PATCH, DELETE | `/api/vehicles`, `/api/vehicles/{id}` |
| Autisti | GET, POST, PATCH, DELETE | `/api/drivers`, `/api/drivers/{id}` |
| Clienti | GET, POST, PATCH, DELETE | `/api/clients`, `/api/clients/{id}` |
| Viaggi | GET, POST, PATCH, DELETE | `/api/trips`, `/api/trips/{id}` |
| Fatture | GET, POST, PATCH, DELETE | `/api/invoices`, `/api/invoices/{id}` |
| Rifornimenti | GET, POST, PATCH, DELETE | `/api/fuel`, `/api/fuel/{id}` |
| Manutenzioni | GET, POST, PATCH, DELETE | `/api/maintenance`, `/api/maintenance/{id}` |

## Struttura Progetto

### Frontend (`apps/frontend/`)

```
src/app/
├── core/services/         # Servizi con Angular Signals
├── features/
│   ├── dashboard/         # Dashboard con KPI e grafici
│   ├── vehicles/          # CRUD veicoli
│   ├── drivers/           # CRUD autisti
│   ├── trips/             # CRUD viaggi
│   ├── clients/           # CRUD clienti
│   ├── invoices/          # Gestione fatture
│   ├── live-map/          # Mappa real-time
│   ├── maintenance/       # Manutenzioni
│   └── fuel/              # Rifornimenti
├── layout/
│   ├── header/            # Barra superiore
│   └── sidebar/           # Menu navigazione
├── shared/
│   ├── components/        # Componenti riutilizzabili
│   ├── pipes/             # Pipe personalizzate
│   └── directives/        # Direttive
└── models/                # Re-export da @truck-fleet/shared
```

### Backend (`apps/backend/`)

```
src/main/java/com/truckfleet/
├── TruckFleetApplication.java
├── config/                # CorsConfig, OpenApiConfig
├── entity/                # JPA Entities
│   ├── Vehicle.java, Driver.java, Client.java
│   ├── Trip.java, Invoice.java, InvoiceItem.java
│   ├── FuelRecord.java, MaintenanceRecord.java
│   ├── enums/             # VehicleStatus, DriverStatus, etc.
│   └── converter/         # JPA AttributeConverters
├── repository/            # Spring Data JPA Repositories
├── dto/                   # Data Transfer Objects
├── mapper/                # MapStruct Mappers
├── service/               # Business Logic
├── controller/            # REST Controllers
└── common/exception/      # Exception Handling

src/main/resources/
├── application.yml        # Configurazione Spring
├── application-test.yml   # Configurazione test (H2)
└── db/migration/          # Flyway migrations
```

### Shared Library (`libs/shared/`)

```
src/models/
├── vehicle.model.ts
├── driver.model.ts
├── client.model.ts
├── trip.model.ts
├── invoice.model.ts
└── index.ts
```

Importazione: `import { Vehicle, Driver } from '@truck-fleet/shared'`

## Database

PostgreSQL 16 via Docker. Schema gestito con Flyway migrations.

**Entita principali:**
- `vehicles` - Anagrafica veicoli
- `drivers` - Anagrafica autisti
- `clients` - Anagrafica clienti
- `trips` - Viaggi
- `invoices` + `invoice_items` - Fatture
- `fuel_records` - Rifornimenti
- `maintenance_records` - Manutenzioni

**Connessione default:**
```
Host: localhost:5432
Database: truck_fleet
Username: truck_admin
Password: truck_secret_2024
```

## Variabili d'Ambiente

Il backend legge le seguenti variabili (con valori di default):

| Variabile | Default | Descrizione |
|-----------|---------|-------------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/truck_fleet` | URL database |
| `DB_USERNAME` | `truck_admin` | Username database |
| `DB_PASSWORD` | `truck_secret_2024` | Password database |
| `PORT` | `3000` | Porta del server |
| `CORS_ORIGIN` | `http://localhost:4200` | Origin CORS consentito |

## Localizzazione

L'interfaccia e completamente in italiano:
- Etichette UI: "Veicoli", "Autisti", "Viaggi", etc.
- Formattazione date e numeri: locale `it-IT`
- Messaggi di errore localizzati

## Licenza

Progetto privato.
