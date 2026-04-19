import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { BookingService, Payment, PaymentMethod, PaymentStatus } from '../../../core/services/booking.service';
import type { TagSeverity } from '../../../core/types/ui.types';

@Component({
  selector: 'app-provider-earnings',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, TagModule, DividerModule, SelectButtonModule,
    TableModule, ChipModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './earnings.html',
  styleUrl: './earnings.css',
})
export class Earnings {
  private titleService = inject(Title);
  public bookingService = inject(BookingService);

  statusFilter = signal<PaymentStatus | 'All'>('All');
  statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Refunded', value: 'Refunded' }
  ];

  filteredPayments = computed(() => {
    const sf = this.statusFilter();
    return sf === 'All' ? this.bookingService.providerPayments() : this.bookingService.providerPayments().filter(p => p.status === sf);
  });

  avgPerJob = computed(() => {
    const completed = this.bookingService.providerPayments().filter(p => p.status === 'Completed');
    return completed.length ? Math.round(completed.reduce((s, p) => s + p.amount, 0) / completed.length) : 0;
  });

  constructor() {
    this.titleService.setTitle('Servicio PRO | Earnings');
  }

  getStatusSeverity(status: PaymentStatus): TagSeverity {
    const map: Record<PaymentStatus, TagSeverity> = {
      Completed: 'success',
      Pending: 'warn',
      Failed: 'danger',
      Refunded: 'info',
    };
    return map[status];
  }

  displayCustomer(payment: Payment): string {
    return payment.customerName ?? payment.providerName ?? '—';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  getMethodIcon(method: PaymentMethod): string {
    const map: Record<PaymentMethod, string> = {
      'Credit Card': 'pi pi-credit-card',
      'Debit Card': 'pi pi-credit-card',
      'Cash': 'pi pi-money-bill',
      'Bank Transfer': 'pi pi-building',
      'JazzCash': 'pi pi-mobile',
      'EasyPaisa': 'pi pi-mobile',
    };
    return map[method] ?? 'pi pi-dollar';
  }
}
