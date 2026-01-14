import { Component, OnInit, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { VehicleStatus } from '../../../../models/vehicle.model';

@Component({
    selector: 'app-vehicle-form',
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl:'./vehicle-form.component.html'
})
export class VehicleFormComponent implements OnInit {
  @Input() id?: string; // From route param (edit mode)

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private vehiclesService = inject(VehiclesService);

  form!: FormGroup;
  saving = signal(false);
  currentYear = new Date().getFullYear();

  brands = ['Iveco', 'MAN', 'Scania', 'Volvo', 'Mercedes', 'DAF', 'Renault'];

  get isEditMode(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.initForm();

    if (this.isEditMode && this.id) {
      this.loadVehicle();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      plate: ['', [Validators.required, Validators.minLength(5)]],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      year: [this.currentYear, [Validators.required, Validators.min(2000), Validators.max(this.currentYear)]],
      status: ['available' as VehicleStatus],
      kmTotal: [0, [Validators.required, Validators.min(0)]],
      insuranceExpiry: [''],
      revisionExpiry: [''],
      notes: ['']
    });
  }

  private loadVehicle(): void {
    this.vehiclesService.getVehicle(this.id!).subscribe({
      next: (vehicle) => {
        this.form.patchValue({
          plate: vehicle.plate,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          status: vehicle.status,
          kmTotal: vehicle.kmTotal,
          insuranceExpiry: vehicle.insuranceExpiry?.split('T')[0] || '',
          revisionExpiry: vehicle.revisionExpiry?.split('T')[0] || '',
          notes: vehicle.notes || ''
        });
      },
      error: () => {
        this.router.navigate(['/vehicles']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const formData = this.form.value;

    const operation = this.isEditMode
      ? this.vehiclesService.updateVehicle(this.id!, formData)
      : this.vehiclesService.createVehicle(formData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/vehicles']);
      },
      error: (err) => {
        console.error('Error saving vehicle:', err);
        this.saving.set(false);
      }
    });
  }
}