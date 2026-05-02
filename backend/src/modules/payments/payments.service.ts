import { Injectable, Inject } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { Booking } from '../../entities/booking.entity';
import { BookingService as BookingServiceJunction } from '../../entities/booking-service.entity';

/**
 * PaymentsService
 * Handles payment status updates.
 * Aligns with the 1:1 ER diagram relation between Booking and Payment.
 */
@Injectable()
export class PaymentsService {
  constructor(
    @Inject('PAYMENT_REPOSITORY')
    private paymentRepository: Repository<Payment>,
    @Inject('BOOKING_SERVICE_REPOSITORY')
    private bookingServiceRepository: Repository<BookingServiceJunction>,
  ) {}

  /**
   * Process a payment for a booking
   */
  async processPayment(bookingId: number, method: string, amount: number): Promise<Payment> {
    const payment = this.paymentRepository.create({
      booking: { bookingId } as any,
      method,
      amount,
      paymentStatus: 'PAID',
    });
    return this.paymentRepository.save(payment);
  }

  /**
   * Get payment details by booking ID
   */
  async getPaymentByBooking(bookingId: number): Promise<Payment | null> {
    return this.paymentRepository.findOneBy({ booking: { bookingId } as any });
  }

  private async attachServicesToBookings(bookings: Booking[]): Promise<void> {
    const ids = [...new Set(bookings.map((b) => b.bookingId).filter((id) => id != null))];
    if (!ids.length) return;

    const rows = await this.bookingServiceRepository.find({
      where: { booking: { bookingId: In(ids) } },
      relations: ['booking', 'service'],
    });

    const byBooking = new Map<number, { id: number; name: string }[]>();
    for (const row of rows) {
      const bid = row.booking?.bookingId;
      if (bid == null || !row.service) continue;
      const list = byBooking.get(bid) ?? [];
      list.push({
        id: row.service.serviceId,
        name: row.service.name,
      });
      byBooking.set(bid, list);
    }

    for (const b of bookings) {
      (b as Booking & { services: { id: number; name: string }[] }).services =
        byBooking.get(b.bookingId) ?? [];
    }
  }

  /**
   * All payments for bookings owned by this customer (with booking + provider + services summary).
   */
  async getPaymentsByCustomer(customerId: number): Promise<Payment[]> {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.booking', 'booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.provider', 'provider')
      .where('customer.userId = :customerId', { customerId })
      .orderBy('payment.date', 'DESC')
      .getMany();

    const bookings = payments.map((p) => p.booking).filter(Boolean) as Booking[];
    await this.attachServicesToBookings(bookings);
    return payments;
  }

  /**
   * All payments for bookings handled by this provider.
   */
  async getPaymentsByProvider(providerId: number): Promise<Payment[]> {
    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.booking', 'booking')
      .leftJoinAndSelect('booking.customer', 'customer')
      .leftJoinAndSelect('booking.provider', 'provider')
      .where('provider.userId = :providerId', { providerId })
      .orderBy('payment.date', 'DESC')
      .getMany();

    const bookings = payments.map((p) => p.booking).filter(Boolean) as Booking[];
    await this.attachServicesToBookings(bookings);
    return payments;
  }
}
