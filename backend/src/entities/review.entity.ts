import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Booking } from './booking.entity';

/**
 * Review Entity
 * Allows customers to rate and review a completed booking.
 */
@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn({ name: 'review_id' })
  reviewId: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ name: 'booking_id', type: 'int' })
  bookingId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // Linked optionally to one booking (0..1:1)
  @OneToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_id' })
  booking: Booking;
}
