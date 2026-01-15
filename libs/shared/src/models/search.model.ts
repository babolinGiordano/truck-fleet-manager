export interface SearchResult {
  id: string;
  type: 'trip' | 'vehicle' | 'driver' | 'client' | 'invoice';
  title: string;
  subtitle: string;
  icon: string;
  link: string;
}

export interface SearchResponse {
  trips: SearchResult[];
  vehicles: SearchResult[];
  drivers: SearchResult[];
  clients: SearchResult[];
  invoices: SearchResult[];
  totalResults: number;
}
