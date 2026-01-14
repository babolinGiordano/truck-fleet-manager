import { Component, OnInit, inject, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientsService } from '../../../../core/services/clients.service';

@Component({
  selector: 'app-client-form',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {
  @Input() id?: string; // From route param (edit mode)

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private clientsService = inject(ClientsService);

  form!: FormGroup;
  saving = signal(false);

  get isEditMode(): boolean {
    return !!this.id;
  }

  ngOnInit(): void {
    this.initForm();

    if (this.isEditMode && this.id) {
      this.loadClient();
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      vatNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      fiscalCode: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      province: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      postalCode: ['', [Validators.required, Validators.pattern(/^[0-9]{5}$/)]],
      country: ['Italia', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      pec: ['', Validators.email],
      sdiCode: ['', Validators.maxLength(7)],
      contactPerson: [''],
      notes: [''],
      isActive: [true]
    });
  }

  private loadClient(): void {
    this.clientsService.getClient(this.id!).subscribe({
      next: (client) => {
        this.form.patchValue({
          companyName: client.companyName,
          vatNumber: client.vatNumber,
          fiscalCode: client.fiscalCode || '',
          address: client.address,
          city: client.city,
          province: client.province,
          postalCode: client.postalCode,
          country: client.country,
          phone: client.phone,
          email: client.email,
          pec: client.pec || '',
          sdiCode: client.sdiCode || '',
          contactPerson: client.contactPerson || '',
          notes: client.notes || '',
          isActive: client.isActive
        });
      },
      error: () => {
        this.router.navigate(['/clients']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.saving.set(true);
    const formData = this.form.value;

    const operation = this.isEditMode
      ? this.clientsService.updateClient(this.id!, formData)
      : this.clientsService.createClient(formData);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/clients']);
      },
      error: (err) => {
        console.error('Error saving client:', err);
        this.saving.set(false);
      }
    });
  }
}
