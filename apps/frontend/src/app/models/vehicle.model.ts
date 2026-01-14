export interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  status: VehicleStatus;
  currentDriverId?: string;
  lastPosition?: GeoPosition;
  kmTotal: number;
  insuranceExpiry: string;
  revisionExpiry: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type VehicleStatus = 'available' | 'in_transit' | 'maintenance' | 'inactive';

export interface GeoPosition {
  lat: number;
  lng: number;
  timestamp: string;
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  available: 'Disponibile',
  in_transit: 'In Transito',
  maintenance: 'In Manutenzione',
  inactive: 'Inattivo'
};