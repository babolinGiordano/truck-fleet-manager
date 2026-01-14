export interface Maintenance {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  date: string;
  odometer: number;
  cost: number;
  workshop?: string;
  invoiceNumber?: string;
  nextMaintenanceDate?: string;
  nextMaintenanceKm?: number;
  status: MaintenanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type MaintenanceType = 'oil_change' | 'tires' | 'brakes' | 'filters' | 'revision' | 'repair' | 'other';

export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  oil_change: 'Cambio Olio',
  tires: 'Pneumatici',
  brakes: 'Freni',
  filters: 'Filtri',
  revision: 'Revisione',
  repair: 'Riparazione',
  other: 'Altro'
};

export const MAINTENANCE_STATUS_LABELS: Record<MaintenanceStatus, string> = {
  scheduled: 'Programmata',
  in_progress: 'In Corso',
  completed: 'Completata',
  cancelled: 'Annullata'
};
