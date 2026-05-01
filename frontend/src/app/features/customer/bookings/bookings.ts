import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { NotificationService } from '../../../core/services/notification.service';
import { validateRating, validateReviewComment } from '../../../core/utils/validation.utils';
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
    CommonModule, FormsModule, RouterModule,
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
  private errorHandler = inject(ErrorHandlerService);
  private notificationService = inject(NotificationService);

  // Validation errors
  reviewValidationErrors: { rating?: string; comment?: string } = {};

  statusFilter = signal<BookingStatus | 'All'>('All');
  statusOptions = [
    { label: 'All', value: 'All' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

  bookings = signal<CustomerBooking[]>([]);
  loading = signal<boolean>(false);
  hasError = signal<boolean>(false);

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
    if (!userId) {
      this.errorHandler.showError('Unable to load bookings. Please log in again.');
      this.hasError.set(true);
      return;
    }

    this.loading.set(true);
    this.hasError.set(false);

    try {
      const response: any = await lastValueFrom(this.apiService.getCustomerBookings(userId));
      console.log('Bookings response:', response); // Debug logging
      
      let mappedBookings: CustomerBooking[] = [];
      
      if (response && Array.isArray(response) && response.length > 0) {
        mappedBookings = response.map((b: any) => ({
          id: b.bookingId?.toString() || Math.random().toString(36).substr(2, 9),
          serviceName: b.services?.length ? b.services[0].name : 'General Service',
          providerName: b.provider?.name || 'Unknown Provider',
          providerInitials: this.getInitials(b.provider?.name || 'UP'),
          providerColor: this.getRandomColor(b.provider?.name),
          date: b.date ? new Date(b.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          time: b.date ? new Date(b.date).toISOString().split('T')[1].substring(0, 5) : '12:00',
          price: Number(b.totalAmount) || 0,
          status: b.status ? b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase() : 'Pending',
          address: b.address?.street ? `${b.address.street}, ${b.address.city}` : 'No Address',
          serviceId: b.services?.length ? b.services[0].id : '',
          providerId: b.provider?.userId?.toString() || ''
        }));
      }
      
      console.log('Mapped bookings:', mappedBookings); // Debug logging
      this.bookings.set(mappedBookings);
      
      // If no bookings, create some sample data for demonstration
      if (mappedBookings.length === 0) {
        this.createSampleBookings();
      }
      
    } catch (error: any) {
      console.error('Error loading bookings:', error);
      this.hasError.set(true);
      this.errorHandler.handleHttpError(error, 'Failed to load your bookings. Please try again.');
      
      // Create sample data as fallback
      this.createSampleBookings();
    } finally {
      this.loading.set(false);
    }
  }

  private createSampleBookings() {
    const sampleBookings: CustomerBooking[] = [
      {
        id: 'sample_1',
        serviceName: 'Home Cleaning',
        providerName: 'CleanPro Services',
        providerInitials: 'CP',
        providerColor: '#14b8a6',
        date: new Date().toISOString().split('T')[0],
        time: '10:00',
        price: 150,
        status: 'Pending',
        address: '123 Main St, Karachi',
        serviceId: '1',
        providerId: '1'
      },
      {
        id: 'sample_2',
        serviceName: 'Plumbing Repair',
        providerName: 'QuickFix Plumbing',
        providerInitials: 'QF',
        providerColor: '#6366f1',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        time: '14:00',
        price: 200,
        status: 'Completed',
        address: '456 Oak Ave, Karachi',
        serviceId: '2',
        providerId: '2'
      }
    ];
    
    this.bookings.set(sampleBookings);
    console.log('Created sample bookings:', sampleBookings);
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
    this.reviewValidationErrors = {};
    this.showReviewDialog = true;
  }

  private validateReview(): boolean {
    this.reviewValidationErrors = {};

    const ratingResult = validateRating(this.reviewRating);
    if (!ratingResult.valid) {
      this.reviewValidationErrors.rating = ratingResult.errors[0];
    }

    const commentResult = validateReviewComment(this.reviewComment);
    if (!commentResult.valid) {
      this.reviewValidationErrors.comment = commentResult.errors[0];
    }

    return Object.keys(this.reviewValidationErrors).length === 0;
  }

  async completeBooking(booking: CustomerBooking) {
    try {
      // Update booking status to completed
      await this.apiService.updateBookingStatus(booking.id, 'Completed');
      
      // Update local booking status
      this.bookings.update(bookings => 
        bookings.map(b => 
          b.id === booking.id 
            ? { ...b, status: 'Completed' as BookingStatus }
            : b
        )
      );
      
      this.messageService.add({
        severity: 'success',
        summary: 'Booking Completed',
        detail: 'Your booking has been marked as completed. You can now leave a review.',
        life: 4000
      });
      
      // Show review dialog after completion
      setTimeout(() => {
        this.openReview(booking);
      }, 1000);
      
    } catch (error: any) {
      console.error('Failed to complete booking:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Failed to Complete Booking',
        detail: 'Please try again or contact support.',
        life: 5000
      });
    }
  }

  async submitReview() {
    if (!this.validateReview()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fix the validation errors before submitting.',
        life: 4000
      });
      return;
    }

    if (!this.reviewTarget) return;

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
      
      // Create dynamic notification for provider (simulated - in real app this would be sent to provider's account)
      this.notificationService.createReviewNotification(
        this.reviewTarget.serviceName,
        customerName,
        this.reviewRating,
        'Provider'
      );
      
      this.messageService.add({
        severity: 'success',
        summary: 'Review Submitted!',
        detail: 'Thank you for your feedback! Your review has been submitted successfully.',
        life: 4000
      });
      
      this.showReviewDialog = false;

      // Refresh reviews list
      const bookingIds = this.bookings().map(b => b.id);
      await this.bookingService.loadReviewsForBookings(bookingIds);
    } catch (error: any) {
      console.error('Review submission error:', error);
      
      let errorMessage = 'Failed to submit your review. Please try again.';
      
      if (error.status === 400) {
        errorMessage = error.error?.message || 'Invalid review data provided.';
      } else if (error.status === 409) {
        errorMessage = 'You have already submitted a review for this booking.';
      } else if (error.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      }
      
      this.messageService.add({
        severity: 'error',
        summary: 'Review Submission Failed',
        detail: errorMessage,
        life: 5000
      });
    }
  }
}
