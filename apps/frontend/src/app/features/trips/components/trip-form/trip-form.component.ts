import { Component, OnInit, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripsService } from '../../../../core/services/trips.service';
import { VehiclesService } from '../../../../core/services/vehicles.service';
import { DriversService } from '../../../../core/services/drivers.service';
import { ClientsService } from '../../../../core/services/clients.service';
import { TripStatus } from '../../../../models';

@Component({
  selector: 'app-trip-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './trip-form.component.html'
})
export class TripFormComponent implements OnInit {
  @Input() id?: string; // From route param (edit mode)

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tripsService = inject(TripsService);
  vehiclesService = inject(VehiclesService);
  driversService = inject(DriversService);
  clientsService = inject(ClientsService);

  form!: FormGroup;
  saving = signal(false);

  statusOptions: { value: TripStatus; label: string }[] = [
    { value: 'planned', label: 'Pianificato' },
    { value: 'in_progress', label: 'In Corso' },
    { value: 'completed', label: 'Completato' },
    { value: 'cancelled', label: 'Annullato' }
  ];

  get isEditMode(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.initForm();
    this.loadRelatedData();

    if (this.isEditMode && this.id) {
      this.loadTrip();
    } else {
      // Check for query params (new trip from client/driver detail)
      this.route.queryParams.subscribe(params => {
        const clientId = params['clientId'];
        const driverId = params['driverId'];

        if (clientId) {
          this.form.patchValue({ clientId });
          // Pre-fill origin with client address
          const client = this.clientsService.clients().find(c => c.id === clientId);
          if (client) {
            this.form.patchValue({
              originCompanyName: client.companyName,
              originAddress: client.address,
              originCity: client.city,
              originProvince: client.province,
              originPostalCode: client.postalCode,
              originCountry: client.country
            });
          }
        }

        if (driverId) {
          this.form.patchValue({ driverId });
          // Pre-fill vehicle if driver has one assigned
          const driver = this.driversService.drivers().find(d => d.id === driverId);
          if (driver?.assignedVehicleId) {
            this.form.patchValue({ vehicleId: driver.assignedVehicleId });
          }
        }
      });
    }
  }

  private loadRelatedData(): void {
    this.vehiclesService.loadVehicles();
    this.driversService.loadDrivers();
    this.clientsService.loadClients();
  }

  private initForm(): void {
    this.form = this.fb.group({
      tripNumber: ['', Validators.required],
      vehicleId: [''],
      driverId: [''],
      clientId: [''],
      status: ['planned' as TripStatus],
      // Origin
      originCompanyName: [''],
      originAddress: ['', Validators.required],
      originCity: ['', Validators.required],
      originProvince: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      originPostalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      originCountry: ['Italia', Validators.required],
      // Destination
      destinationCompanyName: [''],
      destinationAddress: ['', Validators.required],
      destinationCity: ['', Validators.required],
      destinationProvince: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      destinationPostalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      destinationCountry: ['Italia', Validators.required],
      // Cargo
      cargoDescription: ['', Validators.required],
      cargoWeight: [0, [Validators.required, Validators.min(0)]],
      cargoVolume: [null],
      cargoPackages: [null],
      cargoIsADR: [false],
      cargoTemperature: [null],
      // Schedule
      plannedDeparture: ['', Validators.required],
      plannedArrival: ['', Validators.required],
      kmPlanned: [0, [Validators.required, Validators.min(0)]],
      // Pricing
      price: [0, [Validators.required, Validators.min(0)]],
      notes: ['']
    });
  }

  private loadTrip(): void {
    this.tripsService.getTrip(this.id!).subscribe({
      next: (trip) => {
        this.form.patchValue({
          tripNumber: trip.tripNumber,
          vehicleId: trip.vehicleId || '',
          driverId: trip.driverId || '',
          clientId: trip.clientId || '',
          status: trip.status,
          // Origin
          originCompanyName: trip.origin.companyName || '',
          originAddress: trip.origin.address,
          originCity: trip.origin.city,
          originProvince: trip.origin.province,
          originPostalCode: trip.origin.postalCode,
          originCountry: trip.origin.country,
          // Destination
          destinationCompanyName: trip.destination.companyName || '',
          destinationAddress: trip.destination.address,
          destinationCity: trip.destination.city,
          destinationProvince: trip.destination.province,
          destinationPostalCode: trip.destination.postalCode,
          destinationCountry: trip.destination.country,
          // Cargo
          cargoDescription: trip.cargo.description,
          cargoWeight: trip.cargo.weight,
          cargoVolume: trip.cargo.volume || null,
          cargoPackages: trip.cargo.packages || null,
          cargoIsADR: trip.cargo.isADR,
          cargoTemperature: trip.cargo.temperature || null,
          // Schedule
          plannedDeparture: this.formatDateTimeLocal(trip.plannedDeparture),
          plannedArrival: this.formatDateTimeLocal(trip.plannedArrival),
          kmPlanned: trip.kmPlanned,
          // Pricing
          price: trip.price,
          notes: trip.notes || ''
        });
      },
      error: () => {
        this.router.navigate(['/trips']);
      }
    });
  }

  private formatDateTimeLocal(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().slice(0, 16);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const formData = this.form.value;

    const tripData = {
      tripNumber: formData.tripNumber,
      vehicleId: formData.vehicleId,
      driverId: formData.driverId,
      clientId: formData.clientId,
      status: formData.status,
      origin: {
        companyName: formData.originCompanyName,
        address: formData.originAddress,
        city: formData.originCity,
        province: formData.originProvince,
        postalCode: formData.originPostalCode,
        country: formData.originCountry
      },
      destination: {
        companyName: formData.destinationCompanyName,
        address: formData.destinationAddress,
        city: formData.destinationCity,
        province: formData.destinationProvince,
        postalCode: formData.destinationPostalCode,
        country: formData.destinationCountry
      },
      cargo: {
        description: formData.cargoDescription,
        weight: formData.cargoWeight,
        volume: formData.cargoVolume,
        packages: formData.cargoPackages,
        isADR: formData.cargoIsADR,
        temperature: formData.cargoTemperature
      },
      plannedDeparture: new Date(formData.plannedDeparture).toISOString(),
      plannedArrival: new Date(formData.plannedArrival).toISOString(),
      kmPlanned: formData.kmPlanned,
      price: formData.price,
      notes: formData.notes
    };

    const operation = this.isEditMode
      ? this.tripsService.updateTrip(this.id!, tripData)
      : this.tripsService.createTrip(tripData as any);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/trips']);
      },
      error: (err) => {
        console.error('Error saving trip:', err);
        this.saving.set(false);
      }
    });
  }
}
