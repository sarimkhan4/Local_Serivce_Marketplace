import {
  Injectable,
  Inject,
  ConflictException,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { Review } from '../../entities/review.entity';
import { Booking } from '../../entities/booking.entity';
import { BookingService as BookingServiceJunction } from '../../entities/booking-service.entity';

/**
 * ReviewsService
 * Handles customer reviews for a specific booking.
 * Aligns with the 1:1 ER diagram relation between Booking and Review.
 */
@Injectable()
export class ReviewsService {
  constructor(
    @Inject('REVIEW_REPOSITORY')
    private reviewRepository: Repository<Review>,
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository: Repository<Booking>,
    @Inject('BOOKING_SERVICE_REPOSITORY')
    private bookingServiceRepository: Repository<BookingServiceJunction>,
  ) {}

  private isBookingCompleted(status: string | undefined): boolean {
    const s = (status ?? '').trim().toUpperCase().replace(/\s+/g, '_');
    return s === 'COMPLETED' || s === 'COMPLETE' || s === 'DONE';
  }

  /** Attach `{ id, name, category }[]` as `booking.services` for API consumers (junction rows flattened). */
  private async attachServicesToBookings(bookings: Booking[]): Promise<void> {
    const ids = [...new Set(bookings.map((b) => b.bookingId).filter((id) => id != null))];
    if (!ids.length) return;

    const rows = await this.bookingServiceRepository.find({
      where: { booking: { bookingId: In(ids) } },
      relations: ['booking', 'service', 'service.category'],
    });

    const byBooking = new Map<number, { id: number; name: string; category?: unknown }[]>();
    for (const row of rows) {
      const bid = row.booking?.bookingId;
      if (bid == null || !row.service) continue;
      const list = byBooking.get(bid) ?? [];
      list.push({
        id: row.service.serviceId,
        name: row.service.name,
        category: row.service.category,
      });
      byBooking.set(bid, list);
    }

    for (const b of bookings) {
      (b as Booking & { services: { id: number; name: string; category?: unknown }[] }).services =
        byBooking.get(b.bookingId) ?? [];
    }
  }

  /**
   * Leave a review for a booking (customer-only; booking must be completed).
   */
  async leaveReview(
    bookingId: number,
    rating: number,
    comment: string,
    reviewerUserId: number,
  ): Promise<Review | null> {
    const booking = await this.bookingRepository.findOne({
      where: { bookingId },
      relations: ['customer', 'provider'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (Number(booking.customer?.userId) !== Number(reviewerUserId)) {
      throw new ForbiddenException('Only the customer who created this booking may leave a review');
    }

    if (!this.isBookingCompleted(booking.status)) {
      throw new BadRequestException(
        `Booking must be completed before leaving a review (current status: "${booking.status ?? 'unknown'}"). Mark the booking complete first.`,
      );
    }

    try {
      const existingReview = await this.reviewRepository.findOne({
        where: { bookingId },
      });

      if (existingReview) {
        throw new ConflictException('Review already exists for this booking');
      }

      const review = this.reviewRepository.create({
        bookingId,
        rating,
        comment,
      });

      await this.reviewRepository.save(review);
      return this.getReviewByBooking(bookingId);
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  /**
   * Get a review by booking ID (includes booking.services for UI).
   */
  async getReviewByBooking(bookingId: number): Promise<Review | null> {
    const review = await this.reviewRepository.findOne({
      where: { bookingId },
      relations: ['booking', 'booking.provider', 'booking.customer'],
    });
    if (review?.booking) {
      await this.attachServicesToBookings([review.booking]);
    }
    return review;
  }

  /**
   * Get all reviews for a specific provider (by provider user id).
   */
  async getProviderReviews(providerId: number): Promise<Review[]> {
    console.log(`[ReviewsService] Fetching reviews for provider ID: ${providerId}`);

    try {
      // Single optimized query: eagerly load all relations including booking services
      // to eliminate the N+1 attachServicesToBookings call
      const reviews = await this.reviewRepository
        .createQueryBuilder('review')
        .leftJoinAndSelect('review.booking', 'booking')
        .leftJoinAndSelect('booking.provider', 'provider')
        .leftJoinAndSelect('booking.customer', 'customer')
        .where('provider.userId = :providerId', { providerId })
        .orderBy('review.createdAt', 'DESC')
        .getMany();

      // Batch-load services for all bookings in a single query (no N+1)
      const bookingIds = [...new Set(
        reviews.map((r) => r.booking?.bookingId).filter((id) => id != null),
      )];

      if (bookingIds.length > 0) {
        const rows = await this.bookingServiceRepository.find({
          where: { booking: { bookingId: In(bookingIds) } },
          relations: ['booking', 'service', 'service.category'],
        });

        const byBooking = new Map<number, { id: number; name: string; category?: unknown }[]>();
        for (const row of rows) {
          const bid = row.booking?.bookingId;
          if (bid == null || !row.service) continue;
          const list = byBooking.get(bid) ?? [];
          list.push({
            id: row.service.serviceId,
            name: row.service.name,
            category: row.service.category,
          });
          byBooking.set(bid, list);
        }

        for (const review of reviews) {
          if (review.booking) {
            (review.booking as Booking & { services: any[] }).services =
              byBooking.get(review.booking.bookingId) ?? [];
          }
        }
      }

      console.log(`[ReviewsService] Found ${reviews.length} reviews for provider ${providerId}`);
      return reviews;
    } catch (error) {
      console.error('[ReviewsService] Error fetching provider reviews:', error);
      throw error;
    }
  }
}
