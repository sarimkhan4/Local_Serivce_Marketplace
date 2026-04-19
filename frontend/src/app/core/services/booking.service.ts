import { Injectable, signal, computed, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from './api.service';

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  label: string;
}

export type PaymentMethod = 'Credit Card' | 'Debit Card' | 'Cash' | 'Bank Transfer' | 'JazzCash' | 'EasyPaisa';
export type PaymentStatus = 'Pending' | 'Completed' | 'Failed' | 'Refunded';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  date: Date;
  serviceName?: string;
  providerName?: string;
  customerName?: string;
}

export interface Review {
  id: string;
  bookingId: string;
  serviceId?: string;
  providerId?: string;
  customerId?: string;
  customerName?: string;
  customerInitials?: string;
  customerColor?: string;
  rating: number;     // 1-5
  comment: string;
  createdAt: Date;
  serviceName?: string;
  providerName?: string;
  providerInitials?: string;
  providerColor?: string;
}

export interface ProviderSchedule {
  id: string;           // Schedule_ID
  providerId: string;
  date: string;         // YYYY-MM-DD
  timeSlot: string;     // e.g. "09:00 AM"
}

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiService = inject(ApiService);

  // ─────────────────────────────────────────
  // Customer Addresses
  // ─────────────────────────────────────────

  private _addresses = signal<Address[]>([]);
  addresses = this._addresses.asReadonly();

  /** Load all addresses for a given user from the backend */
  loadAddresses(userId: string) {
    this.apiService.getUserAddresses(userId).subscribe({
      next: (data: any) => {
        const formatted: Address[] = data.map((a: any) => ({
          id:        a.addressId.toString(),
          street:    a.street,
          city:      a.city,
          state:     a.state,
          zipCode:   a.zipCode,
          isDefault: a.isDefault ?? false,
          label:     a.label ?? 'Home'
        }));
        this._addresses.set(formatted);
      },
      error: (err) => console.error('[BookingService] Failed to load addresses', err)
    });
  }

  async addAddress(userId: string, address: Omit<Address, 'id'>) {
    try {
      await lastValueFrom(
        this.apiService.createAddress(userId, {
          street: address.street,
          city: address.city,
          state: address.state,
          zipCode: address.zipCode,
        })
      );
      this.loadAddresses(userId);
    } catch (e) {
      console.error('[BookingService] addAddress failed', e);
    }
  }

  /** Update an existing address in-place (optimistic update + reload) */
  updateAddress(address: Address) {
    this._addresses.update(list =>
      list.map(a => a.id === address.id ? address : a)
    );
  }

  /** Remove an address by id (local optimistic remove) */
  deleteAddress(id: string) {
    this._addresses.update(list => list.filter(a => a.id !== id));
  }

  /** Mark an address as the default */
  setDefault(id: string) {
    this._addresses.update(list =>
      list.map(a => ({ ...a, isDefault: a.id === id }))
    );
  }

  // ─────────────────────────────────────────
  // Customer Payments
  // ─────────────────────────────────────────

  private _payments = signal<Payment[]>([]);
  payments    = this._payments.asReadonly();
  totalSpent  = computed(() =>
    this._payments().filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0)
  );

  /** Placeholder — backend should expose /payments/customer/:id */
  async loadPayments(_bookingIds: string[]) {
    this._payments.set([]);
  }

  // ─────────────────────────────────────────
  // Customer Reviews
  // ─────────────────────────────────────────

  private _reviews = signal<Review[]>([]);
  reviews = this._reviews.asReadonly();

  /** Load reviews for a set of bookings (stub — extend when backend exposes route) */
  async loadReviews(_bookingIds: string[]) {
    this._reviews.set([]);
  }

  async addReview(bookingId: string, review: Omit<Review, 'id' | 'createdAt'>) {
    try {
      await lastValueFrom(this.apiService.createReview(bookingId, review.rating, review.comment));
      // Optimistically add the review to local state
      const newReview: Review = {
        ...review,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: new Date()
      };
      this._reviews.update(list => [...list, newReview]);
    } catch (e) { console.error('[BookingService] addReview failed', e); }
  }

  hasReview(bookingId: string): boolean {
    return this._reviews().some(r => r.bookingId === bookingId);
  }

  // ─────────────────────────────────────────
  // Provider Availability (Schedule)
  // ─────────────────────────────────────────

  private _schedules = signal<ProviderSchedule[]>([]);
  schedules = this._schedules.asReadonly();

  /** Load all schedule slots for a provider from the backend */
  loadSchedules(providerId: string) {
    this.apiService.getProviderSchedule(providerId).subscribe({
      next: (data: any) => {
        const formatted: ProviderSchedule[] = data.map((s: any) => ({
          id:         s.scheduleId.toString(),
          providerId: s.provider?.userId?.toString() || providerId,
          date:       new Date(s.date).toISOString().split('T')[0],
          timeSlot:   s.timeSlot
        }));
        this._schedules.set(formatted);
      },
      error: (err) => console.error('[BookingService] Failed to load schedules', err)
    });
  }

  /**
   * Toggle a single time-slot for a provider on a given date.
   * If the slot exists it is removed; otherwise it is created.
   */
  async toggleScheduleBlock(providerId: string, date: string, timeSlot: string) {
    const exists = this._schedules().some(
      s => s.providerId === providerId && s.date === date && s.timeSlot === timeSlot
    );

    if (exists) {
      // Remove locally (ideally would call DELETE endpoint)
      this._schedules.update(list =>
        list.filter(s => !(s.providerId === providerId && s.date === date && s.timeSlot === timeSlot))
      );
    } else {
      try {
        await lastValueFrom(this.apiService.createSchedule(providerId, { date, timeSlot }));
        // Add optimistically
        const newSlot: ProviderSchedule = {
          id:         Math.random().toString(36).substring(2, 9),
          providerId,
          date,
          timeSlot
        };
        this._schedules.update(list => [...list, newSlot]);
      } catch (e) { console.error('[BookingService] toggleScheduleBlock failed', e); }
    }
  }

  /** Remove all schedule slots for a given date (local optimistic clear) */
  deleteSchedulesByDate(date: string) {
    this._schedules.update(list => list.filter(s => s.date !== date));
  }

  // ─────────────────────────────────────────
  // Provider Earnings
  // ─────────────────────────────────────────

  private _providerPayments = signal<Payment[]>([]);
  providerPayments = this._providerPayments.asReadonly();
  totalEarned      = computed(() =>
    this._providerPayments().filter(p => p.status === 'Completed').reduce((s, p) => s + p.amount, 0)
  );
  pendingEarnings  = computed(() =>
    this._providerPayments().filter(p => p.status === 'Pending').reduce((s, p) => s + p.amount, 0)
  );

  /** Placeholder — backend should expose /payments/provider/:id */
  async loadProviderPayments(_providerId: string) {
    this._providerPayments.set([]);
  }
}
