import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { DataViewModule } from 'primeng/dataview';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface ScheduleBooking {
  id: string;
  customerName: string;
  customerInitials: string;
  avatarColor: string;
  serviceName: string;
  date: string;       // ISO date YYYY-MM-DD
  time: string;       // HH:MM
  duration: number;   // minutes
  status: BookingStatus;
  notes: string;
  price: number;
  address: string;
}

interface ProviderBookingApiResponse {
  bookingId: number | string;
  date: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | string;
  totalAmount: number | string;
  customer?: {
    firstName?: string;
    lastName?: string;
  };
  services?: Array<{
    service?: {
      name?: string;
    };
  }>;
  address?: {
    street?: string;
    city?: string;
  };
}

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, TagModule, DialogModule, InputTextModule,
    SelectModule, TextareaModule, DataViewModule, ChipModule,
    AvatarModule, SelectButtonModule, DividerModule, BadgeModule
  ],
  templateUrl: './schedule.html',
  styleUrl: './schedule.css'
})
export class Schedule {
  private titleService = inject(Title);

  // ── View filter ──
  viewMode: 'all' | 'today' | 'upcoming' | 'past' = 'all';
  viewOptions = [
    { label: 'All', value: 'all' },
    { label: 'Today', value: 'today' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Past', value: 'past' }
  ];

  statusFilter = signal<BookingStatus | 'All'>('All');
  statusOptions = [
    { label: 'All Statuses', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  // ── Mock bookings (ER: Booking → Schedule) ──
  bookings = signal<ScheduleBooking[]>([]);

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  ngOnInit() {
    this.loadBookings();
  }

  async loadBookings() {
    const user = this.authService.currentUser();
    if (!user) return;
    try {
      const data = await lastValueFrom(this.apiService.getProviderBookings(user.id)) as ProviderBookingApiResponse[];
      const mapped = data.map((b): ScheduleBooking => ({
        id: b.bookingId.toString(),
        customerName: `${b.customer?.firstName ?? ''} ${b.customer?.lastName ?? ''}`.trim() || 'Customer',
        customerInitials: `${b.customer?.firstName?.[0] || ''}${b.customer?.lastName?.[0] || ''}`.toUpperCase() || 'CU',
        avatarColor: '#14b8a6',
        serviceName: b.services?.[0]?.service?.name || 'Multiple Services',
        date: new Date(b.date).toISOString().split('T')[0],
        time: new Date(b.date).toTimeString().substring(0, 5),
        duration: 120,
        status: b.status === 'PENDING' ? 'Pending' : (b.status === 'CONFIRMED' ? 'Confirmed' : (b.status === 'COMPLETED' ? 'Completed' : 'Cancelled')),
        notes: '',
        price: Number(b.totalAmount),
        address: `${b.address?.street ?? ''}${b.address?.street && b.address?.city ? ', ' : ''}${b.address?.city ?? ''}`.trim() || 'Address not set',
      }));
      this.bookings.set(mapped);
    } catch (err) {
      console.error('Failed to load schedule bookings', err);
    }
  }

  // ── Detail / Edit Dialog ──
  showDetailDialog = false;
  selectedBooking: ScheduleBooking | null = null;

  // ── Computed stats ──
  todayCount = computed(() => this.bookings().filter(b => b.date === this.today()).length);
  pendingCount = computed(() => this.bookings().filter(b => b.status === 'Pending').length);
  confirmedCount = computed(() => this.bookings().filter(b => b.status === 'Confirmed').length);
  completedCount = computed(() => this.bookings().filter(b => b.status === 'Completed').length);
  totalRevenue = computed(() => this.bookings().filter(b => b.status === 'Completed').reduce((s, b) => s + b.price, 0));

  filteredBookings = computed(() => {
    let list = this.bookings();
    const todayStr = this.today();

    if (this.viewMode === 'today') list = list.filter(b => b.date === todayStr);
    else if (this.viewMode === 'upcoming') list = list.filter(b => b.date > todayStr);
    else if (this.viewMode === 'past') list = list.filter(b => b.date < todayStr);

    const sf = this.statusFilter();
    if (sf !== 'All') list = list.filter(b => b.status === sf);

    return list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  });

  constructor() {
    this.titleService.setTitle('Servicio | Provider Schedule');
  }

  // ── Helpers ──
  today(): string { return new Date().toISOString().split('T')[0]; }
  futureDate(days: number): string {
    const d = new Date(); d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }
  pastDate(days: number): string {
    const d = new Date(); d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
  }
  formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
  formatTime(time: string): string {
    const [h, m] = time.split(':');
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  }
  formatDuration(mins: number): string {
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? (mins % 60) + 'm' : ''}`.trim();
  }
  isToday(dateStr: string): boolean { return dateStr === this.today(); }

  getStatusSeverity(status: BookingStatus): 'success' | 'warn' | 'danger' | 'info' | 'secondary' {
    const map: Record<BookingStatus, 'success' | 'warn' | 'danger' | 'info' | 'secondary'> = {
      Confirmed: 'success', Pending: 'warn', Completed: 'info', Cancelled: 'danger'
    };
    return map[status];
  }

  openDetail(booking: ScheduleBooking) {
    this.selectedBooking = { ...booking };
    this.showDetailDialog = true;
  }

  updateStatus(id: string, status: BookingStatus) {
    this.apiService.updateBookingStatus(id, status.toUpperCase()).subscribe({
      next: () => {
        this.bookings.update(list => list.map(b => b.id === id ? { ...b, status } : b));
        if (this.selectedBooking?.id === id) this.selectedBooking = { ...this.selectedBooking, status };
      },
      error: (err) => console.error('Failed to update status', err)
    });
  }

  confirmBooking(id: string) { this.updateStatus(id, 'Confirmed'); }
  completeBooking(id: string) { this.updateStatus(id, 'Completed'); }
  cancelBooking(id: string)  { this.updateStatus(id, 'Cancelled'); this.showDetailDialog = false; }
}
