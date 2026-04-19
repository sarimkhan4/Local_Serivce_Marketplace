import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

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
export class Bookings {
  private titleService = inject(Title);
  public bookingService = inject(BookingService);
  private messageService = inject(MessageService);

  statusFilter = signal<BookingStatus | 'All'>('All');
  statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  bookings = signal<CustomerBooking[]>([
    { id: 'b1', serviceName: 'Full Home Deep Clean', providerName: 'Pro Cleaning Services', providerInitials: 'PC', providerColor: '#14b8a6', date: '2026-05-12', time: '09:00', price: 150, status: 'Completed', address: 'House 12, Gulshan, Karachi', serviceId: 's1', providerId: 'p1' },
    { id: 'b2', serviceName: 'Pipe Leak Repair', providerName: 'Mario Bros Plumbing', providerInitials: 'MB', providerColor: '#6366f1', date: '2026-04-28', time: '11:00', price: 85, status: 'Completed', address: 'House 12, Gulshan, Karachi', serviceId: 's2', providerId: 'p2' },
    { id: 'b3', serviceName: 'Electrical Panel Upgrade', providerName: 'Volt Masters', providerInitials: 'VM', providerColor: '#f59e0b', date: '2026-04-20', time: '10:00', price: 200, status: 'Confirmed', address: 'House 12, Gulshan, Karachi', serviceId: 's3', providerId: 'p3' },
    { id: 'b4', serviceName: 'Window Washing', providerName: 'Crystal Clear', providerInitials: 'CC', providerColor: '#ef4444', date: '2026-04-10', time: '14:00', price: 75, status: 'Cancelled', address: 'House 12, Gulshan, Karachi', serviceId: 's4', providerId: 'p4' },
    { id: 'b5', serviceName: 'Post-Construction Cleanup', providerName: 'Build Clean Co.', providerInitials: 'BC', providerColor: '#8b5cf6', date: '2026-03-30', time: '08:00', price: 320, status: 'Completed', address: 'House 12, Gulshan, Karachi', serviceId: 's5', providerId: 'p5' },
    { id: 'b6', serviceName: 'Lawn Mowing & Edging', providerName: 'Green Thumb', providerInitials: 'GT', providerColor: '#22c55e', date: '2026-04-25', time: '09:00', price: 60, status: 'Pending', address: 'House 12, Gulshan, Karachi', serviceId: 's6', providerId: 'p6' },
  ]);

  filteredBookings = computed(() => {
    const sf = this.statusFilter();
    return sf === 'All' ? this.bookings() : this.bookings().filter(b => b.status === sf);
  });

  // ── Counts ──
  completedCount = computed(() => this.bookings().filter(b => b.status === 'Completed').length);
  pendingCount   = computed(() => this.bookings().filter(b => b.status === 'Pending').length);
  totalSpent     = computed(() => this.bookings().filter(b => b.status === 'Completed').reduce((s, b) => s + b.price, 0));

  // ── Review Dialog ──
  showReviewDialog = false;
  reviewTarget: CustomerBooking | null = null;
  reviewRating = 0;
  reviewComment = '';

  constructor() {
    this.titleService.setTitle('Servicio | My Bookings');
  }

  getStatusSeverity(status: BookingStatus): TagSeverity {
    const map: Record<BookingStatus, TagSeverity> = {
      Confirmed: 'success',
      Pending: 'warn',
      Completed: 'info',
      Cancelled: 'danger',
    };
    return map[status];
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
    return booking.status === 'Completed' && !this.bookingService.hasReview(booking.id);
  }

  openReview(booking: CustomerBooking) {
    this.reviewTarget = booking;
    this.reviewRating = 0;
    this.reviewComment = '';
    this.showReviewDialog = true;
  }

  submitReview() {
    if (!this.reviewTarget || this.reviewRating === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Please select a rating', life: 3000 });
      return;
    }
    this.bookingService.addReview(this.reviewTarget.id, {
      bookingId: this.reviewTarget.id,
      serviceId: this.reviewTarget.serviceId,
      providerId: this.reviewTarget.providerId,
      customerId: 'c1',
      customerName: 'Guest User',
      customerInitials: 'GU',
      customerColor: '#f97316',
      rating: this.reviewRating,
      comment: this.reviewComment,
      serviceName: this.reviewTarget.serviceName,
      providerName: this.reviewTarget.providerName,
      providerInitials: this.reviewTarget.providerInitials,
      providerColor: this.reviewTarget.providerColor
    });
    this.messageService.add({ severity: 'success', summary: 'Review Submitted!', detail: 'Thank you for your feedback.', life: 3000 });
    this.showReviewDialog = false;
  }
}
