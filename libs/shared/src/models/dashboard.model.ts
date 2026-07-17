export interface DashboardStats {
  tripsToday: number;
  vehiclesInTransit: number;
  kmThisMonth: number;
  revenueThisMonth: number;
  tripsTrend?: number;
  kmTrend?: number;
  revenueTrend?: number;
}

export interface DashboardAlert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  icon: string;
  title: string;
  description: string;
  daysUntil?: number;
  expired?: boolean;
  link?: string;
}

export interface RecentTrip {
  id: string;
  route: string;
  client: string;
  vehicle: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  price: number;
  km: number;
}

export interface MonthlyTripData {
  month: string;
  value: number;
  isProjection?: boolean;
}

export interface LiveVehicle {
  vehicleId: string;
  tripId: string;
  plate: string;
  lat: number;
  lng: number;
  route: string;
  client: string;
  lastPositionAt: string;
}

export interface DashboardResponse {
  stats: DashboardStats;
  alerts: DashboardAlert[];
  recentTrips: RecentTrip[];
  chartData: MonthlyTripData[];
  chartYear: number;
  availableYears: number[];
  liveVehicles: LiveVehicle[];
}
