import { Component, OnInit, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuelService } from '../../../../core/services/fuel.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { DriversService } from '../../../../core/services/drivers.service';
import { FuelType } from '../../../../models/fuel.model';

@Component({
  selector: 'app-fuel-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './fuel-form.component.html'
})
export class FuelFormComponent implements OnInit {
  @Input() id?: string;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fuelService = inject(FuelService);
  vehiclesService = inject(VehiclesService);
  driversService = inject(DriversService);

  form!: FormGroup;
  saving = signal(false);

  fuelTypes: { value: FuelType; label: string }[] = [
    { value: 'diesel', label: 'Diesel' },
    { value: 'gasoline', label: 'Benzina' },
    { value: 'lpg', label: 'GPL' },
    { value: 'methane', label: 'Metano' },
    { value: 'electric', label: 'Elettrico' }
  ];

  get isEditMode(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.vehiclesService.loadVehicles();
    this.driversService.loadDrivers();
    this.initForm();

    if (this.isEditMode && this.id) {
      this.loadFuelRecord();
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
      driverId: [''],
      date: [today, Validators.required],
      liters: [null, [Validators.required, Validators.min(0.1)]],
      pricePerLiter: [null, [Validators.required, Validators.min(0.01)]],
      totalCost: [{ value: null, disabled: true }],
      fuelType: ['diesel' as FuelType, Validators.required],
      stationName: [''],
      odometer: [null, [Validators.required, Validators.min(0)]],
      fullTank: [true],
      notes: ['']
    });

    // Auto-calculate total cost
    this.form.get('liters')?.valueChanges.subscribe(() => this.calculateTotal());
    this.form.get('pricePerLiter')?.valueChanges.subscribe(() => this.calculateTotal());
  }

  private calculateTotal(): void {
    const liters = this.form.get('liters')?.value;
    const pricePerLiter = this.form.get('pricePerLiter')?.value;

    if (liters && pricePerLiter) {
      const total = Math.round(liters * pricePerLiter * 100) / 100;
      this.form.get('totalCost')?.setValue(total);
    }
  }

  private loadFuelRecord(): void {
    this.fuelService.getFuelRecord(this.id!).subscribe({
      next: (fuel) => {
        this.form.patchValue({
          vehicleId: fuel.vehicleId,
          driverId: fuel.driverId || '',
          date: fuel.date.split('T')[0],
          liters: fuel.liters,
          pricePerLiter: fuel.pricePerLiter,
          totalCost: fuel.totalCost,
          fuelType: fuel.fuelType,
          stationName: fuel.stationName || '',
          odometer: fuel.odometer,
          fullTank: fuel.fullTank,
          notes: fuel.notes || ''
        });
      },
      error: () => {
        this.router.navigate(['/fuel']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);

    const formValue = this.form.getRawValue();
    const formData = {
      vehicleId: formValue.vehicleId,
      driverId: formValue.driverId || undefined,
      date: formValue.date,
      liters: formValue.liters,
      pricePerLiter: formValue.pricePerLiter,
      totalCost: formValue.totalCost,
      fuelType: formValue.fuelType,
      stationName: formValue.stationName || undefined,
      odometer: formValue.odometer,
      fullTank: formValue.fullTank,
      notes: formValue.notes || undefined
    };

    const operation = this.isEditMode
      ? this.fuelService.updateFuelRecord(this.id!, formData)
      : this.fuelService.createFuelRecord(formData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/fuel']);
      },
      error: (err) => {
        console.error('Error saving fuel record:', err);
        this.saving.set(false);
      }
    });
  }
}
