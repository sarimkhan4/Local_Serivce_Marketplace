import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { Provider } from './provider.entity';
import { Address } from './address.entity';

/**
 * Booking Entity
 * Central transactional entity connecting Customer, Provider, and Services.
 */
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn({ name: 'booking_id' })
  bookingId: number;

  @Column({ length: 50, default: 'PENDING' })
  status: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

  // Booking created by (Customer)
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // Booking handled by (Provider)
  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  // Occurs at (Address)
  @ManyToOne(() => Address)
  @JoinColumn({ name: 'address_id' })
  address: Address;
}
