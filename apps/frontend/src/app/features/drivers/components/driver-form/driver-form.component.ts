import { Component, inject, input, signal, computed, effect, linkedSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DriversService } from '../../../../core/services/drivers.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import {
  Driver,
  DriverStatus,
  DriverFormData,
  DRIVER_STATUS_LABELS,
  DEFAULT_DRIVER_FORM_DATA
} from '../../../../models';

/**
 * SIGNAL FORMS - Angular 19+
 *
 * Questo componente utilizza il nuovo approccio "Signal Forms" invece dei classici Reactive Forms.
 *
 * CONCETTI CHIAVE:
 *
 * 1. linkedSignal() - Crea un signal che si sincronizza con una sorgente ma può essere modificato localmente
 *    Perfetto per i campi del form che devono inizializzarsi con dati esterni (edit mode)
 *
 * 2. computed() - Per validazioni e stati derivati (isValid, errorMessages, etc.)
 *
 * 3. effect() - Per side-effects quando i valori cambiano (auto-save, logging, etc.)
 *
 * VANTAGGI vs Reactive Forms:
 * - Type-safe al 100% senza FormBuilder
 * - Nessun subscribe() necessario
 * - Integrazione nativa con il change detection di Angular
 * - Più leggibile e meno boilerplate
 * - Validazioni come computed signals
 */

@Component({
  selector: 'app-driver-form',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './driver-form.component.html'
})
export class DriverFormComponent {
  // Input signal per l'ID (edit mode) - nuova sintassi Angular 17.1+
  readonly id = input<string>();

  private router = inject(Router);
  private driversService = inject(DriversService);
  private vehiclesService = inject(VehiclesService);

  // Stato UI
  saving = signal(false);
  loading = signal(false);
  touched = signal(false);

  // Dati caricati dal server (per edit mode)
  private loadedDriver = signal<Driver | null>(null);

  // ============================================================
  // SIGNAL FORM FIELDS
  // ============================================================
  // linkedSignal: si sincronizza con loadedDriver ma può essere modificato dall'utente
  // Quando loadedDriver cambia (es. dopo fetch), i campi si aggiornano automaticamente

  firstName = linkedSignal(() => this.loadedDriver()?.firstName ?? DEFAULT_DRIVER_FORM_DATA.firstName);
  lastName = linkedSignal(() => this.loadedDriver()?.lastName ?? DEFAULT_DRIVER_FORM_DATA.lastName);
  fiscalCode = linkedSignal(() => this.loadedDriver()?.fiscalCode ?? DEFAULT_DRIVER_FORM_DATA.fiscalCode);
  phone = linkedSignal(() => this.loadedDriver()?.phone ?? DEFAULT_DRIVER_FORM_DATA.phone);
  email = linkedSignal(() => this.loadedDriver()?.email ?? DEFAULT_DRIVER_FORM_DATA.email);
  licenseNumber = linkedSignal(() => this.loadedDriver()?.licenseNumber ?? DEFAULT_DRIVER_FORM_DATA.licenseNumber);
  licenseExpiry = linkedSignal(() => this.loadedDriver()?.licenseExpiry?.split('T')[0] ?? DEFAULT_DRIVER_FORM_DATA.licenseExpiry);
  cqcExpiry = linkedSignal(() => this.loadedDriver()?.cqcExpiry?.split('T')[0] ?? DEFAULT_DRIVER_FORM_DATA.cqcExpiry);
  adrExpiry = linkedSignal(() => this.loadedDriver()?.adrExpiry?.split('T')[0] ?? DEFAULT_DRIVER_FORM_DATA.adrExpiry);
  status = linkedSignal(() => this.loadedDriver()?.status ?? DEFAULT_DRIVER_FORM_DATA.status);
  assignedVehicleId = linkedSignal(() => this.loadedDriver()?.assignedVehicleId ?? DEFAULT_DRIVER_FORM_DATA.assignedVehicleId);
  hireDate = linkedSignal(() => this.loadedDriver()?.hireDate?.split('T')[0] ?? DEFAULT_DRIVER_FORM_DATA.hireDate);
  notes = linkedSignal(() => this.loadedDriver()?.notes ?? DEFAULT_DRIVER_FORM_DATA.notes);

  // ============================================================
  // COMPUTED SIGNALS - Validazioni
  // ============================================================

  readonly firstNameError = computed(() => {
    const value = this.firstName();
    if (!value.trim()) return 'Il nome è obbligatorio';
    if (value.length < 2) return 'Il nome deve avere almeno 2 caratteri';
    return null;
  });

  readonly lastNameError = computed(() => {
    const value = this.lastName();
    if (!value.trim()) return 'Il cognome è obbligatorio';
    if (value.length < 2) return 'Il cognome deve avere almeno 2 caratteri';
    return null;
  });

  readonly fiscalCodeError = computed(() => {
    const value = this.fiscalCode();
    if (!value.trim()) return 'Il codice fiscale è obbligatorio';
    const cfRegex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;
    if (!cfRegex.test(value)) return 'Formato codice fiscale non valido';
    return null;
  });

  readonly phoneError = computed(() => {
    const value = this.phone();
    if (!value.trim()) return 'Il telefono è obbligatorio';
    const phoneRegex = /^(\+39|0039)?[\s.-]?[0-9]{6,12}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) return 'Formato telefono non valido';
    return null;
  });

  readonly emailError = computed(() => {
    const value = this.email();
    if (!value) return null; // Email è opzionale
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Formato email non valido';
    return null;
  });

  readonly licenseNumberError = computed(() => {
    const value = this.licenseNumber();
    if (!value.trim()) return 'Il numero patente è obbligatorio';
    if (value.length < 5) return 'Numero patente troppo corto';
    return null;
  });

  readonly licenseExpiryError = computed(() => {
    const value = this.licenseExpiry();
    if (!value) return 'La scadenza patente è obbligatoria';
    return null;
  });

  readonly cqcExpiryError = computed(() => {
    const value = this.cqcExpiry();
    if (!value) return 'La scadenza CQC è obbligatoria';
    return null;
  });

  readonly hireDateError = computed(() => {
    const value = this.hireDate();
    if (!value) return 'La data assunzione è obbligatoria';
    return null;
  });

  readonly isFormValid = computed(() => {
    return !this.firstNameError() &&
      !this.lastNameError() &&
      !this.fiscalCodeError() &&
      !this.phoneError() &&
      !this.emailError() &&
      !this.licenseNumberError() &&
      !this.licenseExpiryError() &&
      !this.cqcExpiryError() &&
      !this.hireDateError();
  });

  readonly errorCount = computed(() => {
    let count = 0;
    if (this.firstNameError()) count++;
    if (this.lastNameError()) count++;
    if (this.fiscalCodeError()) count++;
    if (this.phoneError()) count++;
    if (this.emailError()) count++;
    if (this.licenseNumberError()) count++;
    if (this.licenseExpiryError()) count++;
    if (this.cqcExpiryError()) count++;
    if (this.hireDateError()) count++;
    return count;
  });

  // ============================================================
  // COMPUTED - Dati derivati
  // ============================================================

  readonly isEditMode = computed(() => !!this.id());

  readonly pageTitle = computed(() =>
    this.isEditMode() ? 'Modifica Autista' : 'Nuovo Autista'
  );

  readonly submitButtonText = computed(() =>
    this.isEditMode() ? 'Salva Modifiche' : 'Crea Autista'
  );

  readonly fullName = computed(() => {
    const first = this.firstName().trim();
    const last = this.lastName().trim();
    if (!first && !last) return 'Nuovo Autista';
    return `${first} ${last}`.trim();
  });

  readonly statusOptions = Object.entries(DRIVER_STATUS_LABELS).map(([value, label]) => ({
    value: value as DriverStatus,
    label
  }));

  readonly availableVehicles = computed(() => {
    const vehicles = this.vehiclesService.vehicles();
    const currentAssigned = this.assignedVehicleId();
    return vehicles.filter(v =>
      v.status === 'available' || v.id === currentAssigned
    );
  });

  // ============================================================
  // EFFECTS
  // ============================================================

  constructor() {
    effect(() => {
      const driverId = this.id();
      if (driverId) {
        this.loadDriver(driverId);
      }
    });

    effect(() => {
      if (this.vehiclesService.vehicles().length === 0) {
        this.vehiclesService.loadVehicles();
      }
    });
  }

  // ============================================================
  // METODI
  // ============================================================

  private loadDriver(id: string): void {
    this.loading.set(true);
    this.driversService.getDriver(id).subscribe({
      next: (driver) => {
        this.loadedDriver.set(driver);
        this.loading.set(false);
      },
      error: () => {
        this.router.navigate(['/drivers']);
      }
    });
  }

  private getFormData(): DriverFormData {
    return {
      firstName: this.firstName(),
      lastName: this.lastName(),
      fiscalCode: this.fiscalCode().toUpperCase(),
      phone: this.phone(),
      email: this.email(),
      licenseNumber: this.licenseNumber(),
      licenseExpiry: this.licenseExpiry(),
      cqcExpiry: this.cqcExpiry(),
      adrExpiry: this.adrExpiry() || '',
      status: this.status(),
      assignedVehicleId: this.assignedVehicleId() || '',
      hireDate: this.hireDate(),
      notes: this.notes()
    };
  }

  markAsTouched(): void {
    this.touched.set(true);
  }

  onSubmit(): void {
    this.markAsTouched();

    if (!this.isFormValid()) {
      return;
    }

    this.saving.set(true);
    const formData = this.getFormData();

    const operation = this.isEditMode()
      ? this.driversService.updateDriver(this.id()!, formData)
      : this.driversService.createDriver(formData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/drivers']);
      },
      error: (err) => {
        console.error('Error saving driver:', err);
        this.saving.set(false);
      }
    });
  }

  resetForm(): void {
    this.loadedDriver.set(null);
    this.touched.set(false);
  }

  showError(error: string | null): boolean {
    return this.touched() && !!error;
  }
}
