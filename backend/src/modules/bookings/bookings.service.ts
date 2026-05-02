import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';
import { BookingService } from '../../entities/booking-service.entity';

/**
 * BookingsService
 * Handles the central transaction logic linking Customers, Providers, Addresses, and Services.
 * Aligns with the ER Diagram's central Booking entity and Booking_Service junction.
 */
@Injectable()
export class BookingsService {
  constructor(
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
    @Inject('BOOKING_SERVICE_REPOSITORY')
    private bookingServiceRepository: Repository<BookingService>,
  ) {}

  /**
   * Create a new booking
   */
  async createBooking(
    customerId: number,
    providerId: number,
    addressId: number,
    date: Date,
    totalAmount: number
  ): Promise<Booking> {
    const booking = this.bookingRepository.create({
      customer: { userId: customerId } as any,
      provider: { userId: providerId } as any,
      address: { addressId: addressId } as any,
      date,
      totalAmount,
      status: 'PENDING'
    });
    return this.bookingRepository.save(booking);
  }

  /**
   * Link a specific service to a booking (Booking_Service junction)
   */
  async addServiceToBooking(bookingId: number, serviceId: number): Promise<BookingService> {
    const bookingService = this.bookingServiceRepository.create({
      booking: { bookingId } as any,
      service: { serviceId } as any,
      serviceStatus: 'PENDING'
    });
    return this.bookingServiceRepository.save(bookingService);
  }

  /**
   * Fetch a booking with its services
   */
  async getBookingDetails(bookingId: number): Promise<any> {
    const booking = await this.bookingRepository.findOne({ 
      where: { bookingId },
      relations: ['customer', 'provider', 'address'] 
    });

    const services = await this.bookingServiceRepository.find({
      where: { booking: { bookingId } },
      relations: ['service']
    });

    return { ...booking, services };
  }

  /**
   * Fetch bookings for a provider
   */
  async getBookingsByProvider(providerId: number): Promise<any[]> {
    const bookings = await this.bookingRepository.find({
      where: { provider: { userId: providerId } as any },
      relations: ['customer', 'address'],
      order: { date: 'DESC' }
    });
    
    // Attach services to each booking
    const result: any[] = [];
    for (const b of bookings) {
      const services = await this.bookingServiceRepository.find({
        where: { booking: { bookingId: b.bookingId } },
        relations: ['service']
      });
      result.push({ ...b, services });
    }
    return result;
  }

  /**
   * Fetch bookings for a customer
   */
  async getBookingsByCustomer(customerId: number): Promise<any[]> {
    const bookings = await this.bookingRepository.find({
      where: { customer: { userId: customerId } as any },
      relations: ['provider', 'address'],
      order: { date: 'DESC' }
    });
    
    const result: any[] = [];
    for (const b of bookings) {
      const services = await this.bookingServiceRepository.find({
        where: { booking: { bookingId: b.bookingId } },
        relations: ['service']
      });
      result.push({ ...b, services });
    }
    return result;
  }

  /**
   * Update booking status (normalized to uppercase canonical values)
   */
  async updateStatus(bookingId: number, status: string): Promise<Booking> {
    const normalized = this.normalizeBookingStatus(status);
    const booking = await this.bookingRepository.findOne({ where: { bookingId } });
    if (!booking) {
      throw new NotFoundException(`Booking ${bookingId} not found`);
    }
    booking.status = normalized;
    return this.bookingRepository.save(booking);
  }

  /** Map common UI / client labels to persisted status strings */
  private normalizeBookingStatus(raw: string): string {
    const s = (raw ?? '').trim().toUpperCase().replace(/[\s-]+/g, '_');
    const aliases: Record<string, string> = {
      COMPLETE: 'COMPLETED',
      DONE: 'COMPLETED',
      COMPLETED: 'COMPLETED',
      PENDING: 'PENDING',
      CONFIRM: 'CONFIRMED',
      CONFIRMED: 'CONFIRMED',
      CANCELLED: 'CANCELLED',
      CANCELED: 'CANCELLED',
      IN_PROGRESS: 'IN_PROGRESS',
      INPROGRESS: 'IN_PROGRESS',
    };
    if (!s) return 'PENDING';
    return aliases[s] ?? s;
  }
}
