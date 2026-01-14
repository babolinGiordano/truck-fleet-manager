import { Component, OnInit, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { MaintenanceType, MaintenanceStatus } from '../../../../models/maintenance.model';

@Component({
  selector: 'app-maintenance-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './maintenance-form.component.html'
})
export class MaintenanceFormComponent implements OnInit {
  @Input() id?: string;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private maintenanceService = inject(MaintenanceService);
  vehiclesService = inject(VehiclesService);

  form!: FormGroup;
  saving = signal(false);

  maintenanceTypes: { value: MaintenanceType; label: string }[] = [
    { value: 'oil_change', label: 'Cambio Olio' },
    { value: 'tires', label: 'Pneumatici' },
    { value: 'brakes', label: 'Freni' },
    { value: 'filters', label: 'Filtri' },
    { value: 'revision', label: 'Revisione' },
    { value: 'repair', label: 'Riparazione' },
    { value: 'other', label: 'Altro' }
  ];

  statusOptions: { value: MaintenanceStatus; label: string }[] = [
    { value: 'scheduled', label: 'Programmata' },
    { value: 'in_progress', label: 'In Corso' },
    { value: 'completed', label: 'Completata' },
    { value: 'cancelled', label: 'Annullata' }
  ];

  get isEditMode(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.vehiclesService.loadVehicles();
    this.initForm();

    if (this.isEditMode && this.id) {
      this.loadMaintenanceRecord();
    } else {
      // Check for vehicleId in query params (from vehicle detail page)
      const vehicleId = this.route.snapshot.queryParamMap.get('vehicleId');
      if (vehicleId) {
        this.form.patchValue({ vehicleId });
      }
    }
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      vehicleId: ['', Validators.required],
      type: ['oil_change' as MaintenanceType, Validators.required],
      description: ['', Validators.required],
      date: [today, Validators.required],
      odometer: [null, [Validators.required, Validators.min(0)]],
      cost: [null, [Validators.required, Validators.min(0)]],
      workshop: [''],
      invoiceNumber: [''],
      nextMaintenanceDate: [''],
      nextMaintenanceKm: [null],
      status: ['scheduled' as MaintenanceStatus, Validators.required],
      notes: ['']
    });
  }

  private loadMaintenanceRecord(): void {
    this.maintenanceService.getMaintenanceRecord(this.id!).subscribe({
      next: (maintenance) => {
        this.form.patchValue({
          vehicleId: maintenance.vehicleId,
          type: maintenance.type,
          description: maintenance.description,
          date: maintenance.date.split('T')[0],
          odometer: maintenance.odometer,
          cost: maintenance.cost,
          workshop: maintenance.workshop || '',
          invoiceNumber: maintenance.invoiceNumber || '',
          nextMaintenanceDate: maintenance.nextMaintenanceDate?.split('T')[0] || '',
          nextMaintenanceKm: maintenance.nextMaintenanceKm || null,
          status: maintenance.status,
          notes: maintenance.notes || ''
        });
      },
      error: () => {
        this.router.navigate(['/maintenance']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);

    const formValue = this.form.value;
    const formData = {
      vehicleId: formValue.vehicleId,
      type: formValue.type,
      description: formValue.description,
      date: formValue.date,
      odometer: formValue.odometer,
      cost: formValue.cost,
      workshop: formValue.workshop || undefined,
      invoiceNumber: formValue.invoiceNumber || undefined,
      nextMaintenanceDate: formValue.nextMaintenanceDate || undefined,
      nextMaintenanceKm: formValue.nextMaintenanceKm || undefined,
      status: formValue.status,
      notes: formValue.notes || undefined
    };

    const operation = this.isEditMode
      ? this.maintenanceService.updateMaintenanceRecord(this.id!, formData)
      : this.maintenanceService.createMaintenanceRecord(formData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/maintenance']);
      },
      error: (err) => {
        console.error('Error saving maintenance record:', err);
        this.saving.set(false);
      }
    });
  }
}
