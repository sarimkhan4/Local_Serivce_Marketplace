import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Optional,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Booking } from '../../entities/booking.entity';

@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  constructor(
    @Optional()
    @Inject('BOOKING_REPOSITORY')
    private bookingRepository?: Repository<Booking>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || user.userId === undefined) {
      throw new ForbiddenException('User not authenticated');
    }

    const { bookingId, customerId, providerId } = request.params;
    
    // Check if user is an Admin, they can access anything
    if (user.role === 'Admin') {
      return true;
    }

    if (bookingId) {
      return await this.isBookingOwner(bookingId, user.userId);
    }

    if (customerId) {
        if (+customerId !== user.userId) {
            throw new ForbiddenException('Cannot access another customer resource');
        }
    }

    if (providerId) {
        if (+providerId !== user.userId) {
            throw new ForbiddenException('Cannot access another provider resource');
        }
    }

    // Default allow if no known resource param is present
    return true; 
  }

  private async isBookingOwner(bookingId: number | string, userId: number): Promise<boolean> {
    if (!this.bookingRepository) {
      throw new ForbiddenException('Booking repository not available for ownership check');
    }

    const booking = await this.bookingRepository.findOne({
      where: { bookingId: +bookingId },
      relations: ['customer', 'provider'],
    });

    if (!booking) {
      throw new ForbiddenException('Booking not found');
    }

    const isCustomer = booking.customer?.userId === userId;
    const isProvider = booking.provider?.userId === userId;

    if (!isCustomer && !isProvider) {
      throw new ForbiddenException('You do not own this resource');
    }

    return true;
  }
}
