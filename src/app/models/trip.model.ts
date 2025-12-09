export interface Trip {
  id: string;
  tripNumber: string;
  vehicleId: string;
  driverId: string;
  clientId: string;
  origin: TripLocation;
  destination: TripLocation;
  cargo: CargoInfo;
  status: TripStatus;
  plannedDeparture: string;
  actualDeparture?: string;
  plannedArrival: string;
  actualArrival?: string;
  kmPlanned: number;
  kmActual?: number;
  price: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TripLocation {
  companyName?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  lat?: number;
  lng?: number;
}

export interface CargoInfo {
  description: string;
  weight: number;
  volume?: number;
  packages?: number;
  isADR: boolean;
  temperature?: number;
}

export type TripStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  planned: 'Pianificato',
  in_progress: 'In Corso',
  completed: 'Completato',
  cancelled: 'Annullato'
};