import { Injectable, signal } from '@angular/core';

export interface Booking {
  id: string;
  customerId: string;
  providerId: string;
  serviceId: string;
  scheduledTime: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  totalPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  // Signal to hold bookings for the current session
  readonly bookings = signal<Booking[]>([]);

  constructor() {}

  async getBookingsForUser(userId: string): Promise<Booking[]> {
    // Mock API call
    return [];
  }

  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const newBooking: Booking = { ...booking, id: Math.random().toString(36).substr(2, 9) };
    this.bookings.update(b => [...b, newBooking]);
    return newBooking;
  }
}
