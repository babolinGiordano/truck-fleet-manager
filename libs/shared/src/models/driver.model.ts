export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  fiscalCode: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  licenseExpiry: string;
  cqcExpiry: string;
  adrExpiry?: string;
  status: DriverStatus;
  assignedVehicleId?: string;
  hireDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type DriverStatus = 'active' | 'on_leave' | 'inactive';

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  active: 'Attivo',
  on_leave: 'In Ferie',
  inactive: 'Inattivo'
};

export const DRIVER_STATUSES: DriverStatus[] = ['active', 'on_leave', 'inactive'];

export interface DriverFormData {
  firstName: string;
  lastName: string;
  fiscalCode: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  cqcExpiry: string;
  adrExpiry: string;
  status: DriverStatus;
  assignedVehicleId: string;
  hireDate: string;
  notes: string;
}

export const DEFAULT_DRIVER_FORM_DATA: DriverFormData = {
  firstName: '',
  lastName: '',
  fiscalCode: '',
  phone: '',
  email: '',
  licenseNumber: '',
  licenseExpiry: '',
  cqcExpiry: '',
  adrExpiry: '',
  status: 'active',
  assignedVehicleId: '',
  hireDate: new Date().toISOString().split('T')[0],
  notes: ''
};
