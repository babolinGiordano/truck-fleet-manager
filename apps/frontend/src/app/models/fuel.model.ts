export interface Fuel {
  id: string;
  vehicleId: string;
  driverId?: string;
  date: string;
  liters: number;
  pricePerLiter: number;
  totalCost: number;
  fuelType: FuelType;
  stationName?: string;
  odometer: number;
  fullTank: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type FuelType = 'diesel' | 'gasoline' | 'lpg' | 'methane' | 'electric';

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  diesel: 'Diesel',
  gasoline: 'Benzina',
  lpg: 'GPL',
  methane: 'Metano',
  electric: 'Elettrico'
};
