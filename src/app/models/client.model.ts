export interface Client {
  id: string;
  companyName: string;
  vatNumber: string;
  fiscalCode?: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  pec?: string;
  sdiCode?: string;
  contactPerson?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}