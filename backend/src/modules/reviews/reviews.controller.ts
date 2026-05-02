import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  ConflictException,
  UseGuards,
  Req,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ResourceOwnerGuard } from '../../common/guards/resource-owner.guard';
import { IsPublic } from '../../common/decorators/public.decorator';
import { ReviewsService } from './reviews.service';

/**
 * ReviewsController
 * API endpoints for managing booking reviews.
 */
@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('booking/:bookingId')
  @Roles('Customer')
  @UseGuards(ResourceOwnerGuard)
  async leaveReview(
    @Req() req: { user: { userId: number } },
    @Param('bookingId') bookingId: string,
    @Body('rating') rating: number,
    @Body('comment') comment: string,
  ) {
    try {
      const id = +bookingId;
      if (isNaN(id)) {
        throw new BadRequestException('bookingId must be a valid number');
      }

      if (!rating || rating < 1 || rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      return await this.reviewsService.leaveReview(id, rating, comment ?? '', req.user.userId);
    } catch (error) {
      console.error('Error in leaveReview controller:', error);

      if (
        error instanceof BadRequestException ||
        error instanceof ConflictException ||
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new BadRequestException('Failed to submit review. Please try again.');
    }
  }

  @Get('booking/:bookingId')
  @Roles('Customer', 'Provider')
  @UseGuards(ResourceOwnerGuard)
  async getReview(@Param('bookingId') bookingId: string) {
    const id = +bookingId;
    if (isNaN(id)) {
      throw new BadRequestException('bookingId must be a valid number');
    }
    return this.reviewsService.getReviewByBooking(id);
  }

  /** Public aggregate ratings for marketplace / service detail (no auth). */
  @Get('provider/:providerId')
  @IsPublic()
  async getProviderReviews(@Param('providerId') providerId: string) {
    const id = +providerId;
    if (isNaN(id)) {
      throw new BadRequestException('providerId must be a valid number');
    }
    return this.reviewsService.getProviderReviews(id);
  }
}
