import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClientsService } from '../../../../core/services/clients.service';
import { Client } from '../../../../models';

@Component({
  selector: 'app-client-list',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ConfirmDialogComponent
  ],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnInit {
  clientsService = inject(ClientsService);

  searchQuery = '';
  statusFilter = signal<boolean | null>(null);
  clientToDelete = signal<Client | null>(null);

  filteredClients = computed(() => {
    let clients = this.clientsService.clients();

    // Filter by status (active/inactive)
    const status = this.statusFilter();
    if (status !== null) {
      clients = clients.filter(c => c.isActive === status);
    }

    // Filter by search query
    const query = this.searchQuery.toLowerCase().trim();
    if (query) {
      clients = clients.filter(c =>
        c.companyName.toLowerCase().includes(query) ||
        c.vatNumber.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query)
      );
    }

    return clients;
  });

  ngOnInit(): void {
    this.clientsService.loadClients();
  }

  confirmDelete(client: Client): void {
    this.clientToDelete.set(client);
  }

  deleteClient(): void {
    const client = this.clientToDelete();
    if (client) {
      this.clientsService.deleteClient(client.id).subscribe({
        next: () => {
          this.clientToDelete.set(null);
        },
        error: (err) => {
          console.error('Error deleting client:', err);
        }
      });
    }
  }
}