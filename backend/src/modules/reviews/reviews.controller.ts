import { Controller, Get, Post, Body, Param, BadRequestException , UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ReviewsService } from './reviews.service';

/**
 * ReviewsController
 * API endpoints for managing booking reviews.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('booking/:bookingId')
  async leaveReview(
    @Param('bookingId') bookingId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string
  ) {
    try {
      const id = +bookingId;
      if (isNaN(id)) {
        throw new BadRequestException('bookingId must be a valid number');
      }
      
      if (!rating || rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }
      
      return await this.reviewsService.leaveReview(id, rating, comment);
    } catch (error) {
      console.error('Error in leaveReview controller:', error);
      throw error;
    }
  }

  @Get('booking/:bookingId')
  getReview(@Param('bookingId') bookingId: string) {
    const id = +bookingId;
    if (isNaN(id)) {
      throw new BadRequestException('bookingId must be a valid number');
    }
    return this.reviewsService.getReviewByBooking(id);
  }

  @Get('provider/:providerId')
  getProviderReviews(@Param('providerId') providerId: string) {
    const id = +providerId;
    if (isNaN(id)) {
      throw new BadRequestException('providerId must be a valid number');
    }
    return this.reviewsService.getProviderReviews(id);
  }
}
