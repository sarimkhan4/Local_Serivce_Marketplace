import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { DataViewModule } from 'primeng/dataview';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { BookingService } from '../../../core/services/booking.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth';
import type { TagSeverity } from '../../../core/types/ui.types';

type BookingStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

interface CustomerBooking {
  id: string;
  serviceName: string;
  providerName: string;
  providerInitials: string;
  providerColor: string;
  date: string;
  time: string;
  price: number;
  status: BookingStatus;
  address: string;
  serviceId: string;
  providerId: string;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, TagModule, DialogModule, AvatarModule,
    DividerModule, SelectButtonModule, RatingModule, TextareaModule,
    DataViewModule, ChipModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './bookings.html',
  styleUrl: './bookings.css'
})
export class Bookings implements OnInit {
  private titleService = inject(Title);
  public bookingService = inject(BookingService);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  statusFilter = signal<BookingStatus | 'All'>('All');
  statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  bookings = signal<CustomerBooking[]>([]);

  filteredBookings = computed(() => {
    const sf = this.statusFilter();
    return sf === 'All' ? this.bookings() : this.bookings().filter(b => b.status.toLowerCase() === sf.toLowerCase());
  });

  // ── Counts ──
  completedCount = computed(() => this.bookings().filter(b => b.status.toLowerCase() === 'completed').length);
  pendingCount   = computed(() => this.bookings().filter(b => b.status.toLowerCase() === 'pending').length);
  totalSpent     = computed(() => this.bookings().filter(b => b.status.toLowerCase() === 'completed').reduce((s, b) => s + b.price, 0));

  // ── Review Dialog ──
  showReviewDialog = false;
  reviewTarget: CustomerBooking | null = null;
  reviewRating = 0;
  reviewComment = '';

  constructor() {
    this.titleService.setTitle('Servicio | My Bookings');
  }

  async ngOnInit() {
    await this.loadBookings();
    // Load reviews for all bookings
    const bookingIds = this.bookings().map(b => b.id);
    await this.bookingService.loadReviewsForBookings(bookingIds);
  }

  async loadBookings() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    try {
      const response: any = await lastValueFrom(this.apiService.getCustomerBookings(userId));
      const mappedBookings = response.map((b: any) => ({
        id: b.bookingId.toString(),
        serviceName: b.services?.length ? b.services[0].name : 'General Service',
        providerName: b.provider?.name || 'Unknown Provider',
        providerInitials: this.getInitials(b.provider?.name || 'UP'),
        providerColor: this.getRandomColor(b.provider?.name),
        date: new Date(b.date).toISOString().split('T')[0],
        time: new Date(b.date).toISOString().split('T')[1].substring(0, 5),
        price: Number(b.totalAmount),
        status: b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase(), // e.g. Pending, Completed
        address: b.address?.street ? `${b.address.street}, ${b.address.city}` : 'No Address',
        serviceId: b.services?.length ? b.services[0].id : '',
        providerId: b.provider?.userId?.toString() || ''
      }));
      this.bookings.set(mappedBookings);
    } catch (e) {
      console.error('Failed to load bookings', e);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load bookings' });
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
  
  getRandomColor(name: string = ''): string {
    const colors = ['#14b8a6', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e', '#ec4899'];
    const index = name.length > 0 ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  getStatusSeverity(status: BookingStatus): TagSeverity {
    const s = status.toLowerCase();
    if (s === 'confirmed') return 'success';
    if (s === 'pending') return 'warn';
    if (s === 'completed') return 'info';
    if (s === 'cancelled') return 'danger';
    return 'info';
  }

  formatDate(d: string): string {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatTime(t: string): string {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr > 12 ? hr - 12 : hr}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  }

  canReview(booking: CustomerBooking): boolean {
    return booking.status.toLowerCase() === 'completed' && !this.bookingService.hasReview(booking.id);
  }

  openReview(booking: CustomerBooking) {
    this.reviewTarget = booking;
    this.reviewRating = 0;
    this.reviewComment = '';
    this.showReviewDialog = true;
  }

  async submitReview() {
    if (!this.reviewTarget || this.reviewRating === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Please select a rating', life: 3000 });
      return;
    }

    try {
      const currentUser = this.authService.currentUser();
      const customerName = currentUser ? `${currentUser.firstName} ${currentUser.lastName}`.trim() : 'Anonymous';
      const reviewData = {
        bookingId: this.reviewTarget.id,
        serviceId: this.reviewTarget.serviceId,
        providerId: this.reviewTarget.providerId,
        customerId: currentUser?.id || '',
        customerName: customerName,
        customerInitials: this.getInitials(customerName),
        customerColor: this.getRandomColor(customerName),
        rating: this.reviewRating,
        comment: this.reviewComment,
        serviceName: this.reviewTarget.serviceName,
        providerName: this.reviewTarget.providerName,
        providerInitials: this.reviewTarget.providerInitials,
        providerColor: this.reviewTarget.providerColor
      };

      await this.bookingService.addReview(this.reviewTarget.id, reviewData);
      this.messageService.add({ severity: 'success', summary: 'Review Submitted!', detail: 'Thank you for your feedback.', life: 3000 });
      this.showReviewDialog = false;

      // Refresh reviews list
      const bookingIds = this.bookings().map(b => b.id);
      await this.bookingService.loadReviewsForBookings(bookingIds);
    } catch (e) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not submit review' });
    }
  }
}
