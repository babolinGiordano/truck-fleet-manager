import { Component, OnInit, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { VehicleStatus } from '../../../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <a 
            routerLink="/vehicles"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-2"
          >
            <span class="material-icons-outlined">arrow_back</span>
            Torna alla lista
          </a>
          <h1 class="text-2xl font-bold text-gray-800">
            {{ isEditMode ? 'Modifica Veicolo' : 'Nuovo Veicolo' }}
          </h1>
        </div>
      </div>

      <!-- Form -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Informazioni Base</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Plate -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Targa *
              </label>
              <input 
                type="text"
                formControlName="plate"
                placeholder="ES: AB123CD"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                       uppercase"
                [ngClass]="{'border-red-500': form.get('plate')?.invalid && form.get('plate')?.touched}"
              >
              @if (form.get('plate')?.invalid && form.get('plate')?.touched) {
                <p class="text-red-500 text-sm mt-1">Targa obbligatoria</p>
              }
            </div>

            <!-- Brand -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <select 
                formControlName="brand"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="">Seleziona marca</option>
                @for (brand of brands; track brand) {
                  <option [value]="brand">{{ brand }}</option>
                }
              </select>
            </div>

            <!-- Model -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Modello *
              </label>
              <input 
                type="text"
                formControlName="model"
                placeholder="ES: Stralis"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
            </div>

            <!-- Year -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Anno *
              </label>
              <input 
                type="number"
                formControlName="year"
                placeholder="ES: 2023"
                min="2000"
                [max]="currentYear"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Stato
              </label>
              <select 
                formControlName="status"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
                <option value="available">Disponibile</option>
                <option value="in_transit">In Transito</option>
                <option value="maintenance">In Manutenzione</option>
                <option value="inactive">Inattivo</option>
              </select>
            </div>

            <!-- Km Total -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Km Totali
              </label>
              <input 
                type="number"
                formControlName="kmTotal"
                placeholder="ES: 150000"
                min="0"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
            </div>
          </div>
        </div>

        <!-- Expiry Dates -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Scadenze</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Insurance Expiry -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Scadenza Assicurazione
              </label>
              <input 
                type="date"
                formControlName="insuranceExpiry"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
            </div>

            <!-- Revision Expiry -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Scadenza Revisione
              </label>
              <input 
                type="date"
                formControlName="revisionExpiry"
                class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
              >
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Note</h2>
          <textarea 
            formControlName="notes"
            rows="4"
            placeholder="Note aggiuntive sul veicolo..."
            class="w-full px-4 py-2 border border-gray-200 rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent
                   resize-none"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4">
          <a 
            routerLink="/vehicles"
            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg 
                   hover:bg-gray-50 font-medium transition-all"
          >
            Annulla
          </a>
          <button 
            type="submit"
            [disabled]="form.invalid || saving()"
            class="px-6 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg 
                   font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center gap-2"
          >
            @if (saving()) {
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            }
            {{ isEditMode ? 'Salva Modifiche' : 'Crea Veicolo' }}
          </button>
        </div>
      </form>
    </div>
  `
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