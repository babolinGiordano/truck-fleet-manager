# Truck Fleet Manager

Sistema di gestione flotta camion sviluppato in Angular 19. Applicazione web completa per il monitoraggio e la gestione di veicoli, autisti, viaggi e fatturazione.

![Angular](https://img.shields.io/badge/Angular-19.2-dd0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-Private-gray?style=flat-square)

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
- Anagrafica aziendale
- Storico viaggi per cliente
- Dati per fatturazione

### Fatturazione
- Generazione fatture
- Tracking stato pagamenti
- Reportistica

### Altre Funzionalita
- **Mappa Live**: tracking real-time della flotta
- **Manutenzioni**: pianificazione e storico interventi
- **Rifornimenti**: registro consumi carburante

## Tech Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Angular 19.2 |
| Linguaggio | TypeScript 5.8 |
| Styling | Tailwind CSS 3.4, SCSS |
| UI Components | Angular Material 19.2 |
| Mappe | Leaflet + @bluehalo/ngx-leaflet |
| Grafici | @swimlane/ngx-charts |
| Date | date-fns |
| Mock Backend | JSON-Server |
| Testing | Karma + Jasmine |

## Requisiti

- Node.js 18+
- npm 9+

## Installazione

```bash
# Clona il repository
git clone <repository-url>
cd truck-fleet-manager

# Installa le dipendenze
npm install
```

## Avvio

```bash
# Avvia app + mock API (consigliato)
npm run dev

# L'applicazione sara disponibile su http://localhost:4200
# Il mock API sara disponibile su http://localhost:3000
```

### Altri comandi

```bash
npm run start    # Solo Angular dev server (porta 4200)
npm run api      # Solo JSON-Server mock API (porta 3000)
npm run build    # Build di produzione
npm test         # Esegui unit tests
```

## Struttura Progetto

```
src/
├── app/
│   ├── core/
│   │   └── services/          # Servizi con Angular Signals
│   ├── features/
│   │   ├── dashboard/         # Dashboard con KPI e grafici
│   │   ├── vehicles/          # CRUD veicoli
│   │   ├── drivers/           # CRUD autisti
│   │   ├── trips/             # CRUD viaggi
│   │   ├── clients/           # CRUD clienti
│   │   ├── invoices/          # Gestione fatture
│   │   ├── live-map/          # Mappa real-time
│   │   ├── maintenance/       # Manutenzioni
│   │   └── fuel/              # Rifornimenti
│   ├── layout/
│   │   ├── header/            # Barra superiore
│   │   └── sidebar/           # Menu navigazione
│   ├── shared/
│   │   ├── components/        # Componenti riutilizzabili
│   │   ├── pipes/             # Pipe personalizzate
│   │   └── directives/        # Direttive
│   └── models/                # Interfacce TypeScript
├── assets/                    # Risorse statiche
└── styles.scss                # Stili globali

mock-api/
└── db.json                    # Database JSON-Server
```

## Architettura

### State Management
Utilizzo di Angular Signals per la gestione dello stato reattivo:

```typescript
private vehiclesSignal = signal<Vehicle[]>([]);
readonly vehicles = this.vehiclesSignal.asReadonly();
readonly vehicleCount = computed(() => this.vehiclesSignal().length);
```

### Componenti
Standalone components (default Angular 19+) con dependency injection tramite `inject()`:

```typescript
@Component({
  imports: [CommonModule, ...],
})
export class MyComponent {
  private service = inject(MyService);
}
```

### Routing
Lazy loading delle feature modules tramite `loadComponent`:

```typescript
{
  path: 'vehicles',
  loadComponent: () => import('./features/vehicles/vehicle-list.component')
}
```

## Localizzazione

L'interfaccia e completamente in italiano:
- Etichette UI: "Veicoli", "Autisti", "Viaggi", etc.
- Formattazione date e numeri: locale `it-IT`
- Stati e costanti localizzate

## Modelli Dati

### Vehicle
- Targa, marca, modello, anno
- Posizione GPS (lat/lng)
- Stato: `available` | `in_transit` | `maintenance` | `inactive`
- Scadenze assicurazione/revisione
- Chilometraggio totale

### Driver
- Dati anagrafici + codice fiscale
- Scadenze patente, CQC, ADR
- Stato: `active` | `on_leave` | `inactive`

### Trip
- Origine/destinazione con coordinate
- Info carico: peso, volume, ADR, temperatura
- Prezzo e cliente associato

### Client
- Ragione sociale
- Dati fiscali per fatturazione

## Screenshots

*Dashboard con KPI, mappa e grafici*

## Licenza

Progetto privato.
