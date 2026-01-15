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

export interface DashboardResponse {
  stats: DashboardStats;
  alerts: DashboardAlert[];
  recentTrips: RecentTrip[];
  chartData: MonthlyTripData[];
}
