import { Component, OnInit, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ClientsService } from '../../../../core/services/clients.service';

@Component({
  selector: 'app-client-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './client-detail.component.html'
})
export class ClientDetailComponent implements OnInit {
  @Input() id!: string; // From route param

  clientsService = inject(ClientsService);
  private router = inject(Router);

  ngOnInit(): void {
    if (this.id) {
      this.clientsService.getClient(this.id).subscribe({
        error: () => this.router.navigate(['/clients'])
      });
    }
  }
}