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

  /** Load payments for a customer */
  async loadPaymentsForCustomer(customerId: string) {
    try {
      const rows: any = await lastValueFrom(this.apiService.getCustomerPayments(customerId));
      const list = (rows || []).map((p: any) => this.mapPaymentFromApi(p));
      this._payments.set(list);
    } catch (e) {
      console.error('[BookingService] Failed to load customer payments', e);
      this._payments.set([]);
    }
  }

  // ─────────────────────────────────────────
  // Customer vs provider reviews (separate signals — no cross-role clobbering)
  // ─────────────────────────────────────────

  private _customerReviews = signal<Review[]>([]);
  customerReviews = this._customerReviews.asReadonly();

  private _providerReviews = signal<Review[]>([]);
  providerReviews = this._providerReviews.asReadonly();

  /** Load reviews for a customer by fetching reviews for their bookings */
  async loadReviewsForBookings(bookingIds: string[]) {
    if (!bookingIds.length) {
      this._customerReviews.set([]);
      return;
    }
    try {
      const reviewPromises = bookingIds.map(id =>
        lastValueFrom(this.apiService.getBookingReview(id)).catch(() => null)
      );
      const results = await Promise.all(reviewPromises);
      const validReviews = results
        .map((r: any) =>
          r?.reviewId != null || r?.review_id != null ? this.mapReviewFromApi(r) : null
        )
        .filter((r: Review | null): r is Review => r != null);
      this._customerReviews.set(validReviews);
    } catch (e) {
      console.error('[BookingService] Failed to load reviews', e);
      this._customerReviews.set([]);
    }
  }

  /** Load all reviews for a specific provider (replaces provider-side cache only). */
  async loadProviderReviews(providerId: string) {
    try {
      const response: unknown = await lastValueFrom(this.apiService.getProviderReviews(providerId));
      const rows = Array.isArray(response) ? response : [];

      const reviews = rows
        .map((r: any) => this.mapReviewFromApi(r, providerId))
        .filter((r: Review | null): r is Review => r != null);

      reviews.sort((a: Review, b: Review) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      this._providerReviews.set(reviews);
    } catch (e) {
      console.error('[BookingService] Failed to load provider reviews:', e);
      throw e;
    }
  }

  async addReview(bookingId: string, review: Omit<Review, 'id' | 'createdAt'>) {
    try {
      const response: any = await lastValueFrom(this.apiService.createReview(bookingId, review.rating, review.comment));
      const mapped = response?.reviewId ? this.mapReviewFromApi(response) : null;
      const newReview: Review =
        mapped ??
        ({
          ...review,
          id: response?.reviewId?.toString() || Math.random().toString(36).substring(2, 9),
          createdAt: new Date(response?.createdAt ?? Date.now()),
        } as Review);
      this._customerReviews.update(list => [...list, newReview]);
      return newReview;
    } catch (e) {
      console.error('[BookingService] addReview failed', e);
      throw e;
    }
  }

  hasReview(bookingId: string): boolean {
    return this._customerReviews().some(r => r.bookingId === bookingId);
  }

  private mapReviewFromApi(r: any, fallbackProviderId?: string): Review | null {
    const rid = r?.reviewId ?? r?.review_id;
    if (rid === undefined || rid === null) return null;
    const customerName = r.booking?.customer?.name || r.customer?.name || 'Anonymous';
    const providerName = r.booking?.provider?.name || r.provider?.name || 'Provider';
    const mappedProviderId =
      r.booking?.provider?.userId?.toString() || r.provider?.userId?.toString() || fallbackProviderId || '';

    return {
      id: String(rid),
      bookingId: r.booking?.bookingId?.toString() || r.bookingId?.toString() || '',
      serviceId: r.booking?.services?.[0]?.id?.toString(),
      providerId: mappedProviderId,
      customerId: r.booking?.customer?.userId?.toString() || r.customer?.userId?.toString(),
      customerName,
      customerInitials: this.getInitials(customerName),
      customerColor: this.getRandomColor(customerName),
      rating: r.rating,
      comment: r.comment || '',
      createdAt: new Date(r.createdAt ?? Date.now()),
      serviceName: r.booking?.services?.[0]?.name || 'Service',
      providerName,
      providerInitials: this.getInitials(providerName),
      providerColor: this.getRandomColor(providerName),
    };
  }

  private mapPaymentFromApi(p: any): Payment {
    const rawStatus = (p.paymentStatus ?? '').toString().toUpperCase();
    let status: PaymentStatus = 'Pending';
    if (rawStatus === 'PAID' || rawStatus === 'COMPLETED') status = 'Completed';
    else if (rawStatus === 'FAILED') status = 'Failed';
    else if (rawStatus === 'REFUNDED') status = 'Refunded';

    const allowed: PaymentMethod[] = [
      'Credit Card',
      'Debit Card',
      'Cash',
      'Bank Transfer',
      'JazzCash',
      'EasyPaisa',
    ];
    const methodRaw = (p.method ?? 'Cash').toString();
    const method = (allowed.includes(methodRaw as PaymentMethod) ? methodRaw : 'Cash') as PaymentMethod;

    const svc = p.booking?.services?.[0];

    return {
      id: p.paymentId?.toString() ?? '',
      bookingId: p.booking?.bookingId?.toString() ?? '',
      amount: Number(p.amount) || 0,
      method,
      status,
      date: new Date(p.date ?? Date.now()),
      serviceName: svc?.name,
      providerName: p.booking?.provider?.name,
      customerName: p.booking?.customer?.name,
    };
  }

  private getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  private getRandomColor(name: string = ''): string {
    const colors = ['#14b8a6', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#22c55e', '#ec4899'];
    const index = name.length > 0 ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
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

  async loadProviderPayments(providerId: string) {
    try {
      const rows: any = await lastValueFrom(this.apiService.getProviderPaymentsList(providerId));
      const list = (rows || []).map((p: any) => this.mapPaymentFromApi(p));
      this._providerPayments.set(list);
    } catch (e) {
      console.error('[BookingService] Failed to load provider payments', e);
      this._providerPayments.set([]);
    }
  }
}
