import { Controller, Get, Post, Body, Param, Patch , UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ResourceOwnerGuard } from '../../common/guards/resource-owner.guard';
import { BookingsService } from './bookings.service';

/**
 * BookingsController
 * API endpoints for managing the lifecycle of a booking.
 */
@UseGuards(JwtAuthGuard, RolesGuard, ResourceOwnerGuard)
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  async createBooking(
    @Body('customerId') customerId: number,
    @Body('providerId') providerId: number,
    @Body('date') date: Date,
    @Body('totalAmount') totalAmount: number,
    @Body('addressId') addressId?: number,
    @Body('serviceId') serviceId?: number,
  ) {
    // For now, if no addressId provided, use a default value or skip
    if (!addressId) {
      addressId = 1; // Use a default address ID for now
    }
    
    return this.bookingsService.createBooking(customerId, providerId, addressId, date, totalAmount);
  }

  /** Static path segments must be registered before the generic `:bookingId` route. */
  @Get('customer/:customerId')
  getBookingsByCustomer(@Param('customerId') customerId: string) {
    return this.bookingsService.getBookingsByCustomer(+customerId);
  }

  @Get('provider/:providerId')
  getBookingsByProvider(@Param('providerId') providerId: string) {
    return this.bookingsService.getBookingsByProvider(+providerId);
  }

  @Post(':bookingId/services')
  addServiceToBooking(
    @Param('bookingId') bookingId: string,
    @Body('serviceId') serviceId: number
  ) {
    return this.bookingsService.addServiceToBooking(+bookingId, serviceId);
  }

  @Patch(':bookingId/status')
  updateStatus(
    @Param('bookingId') bookingId: string,
    @Body('status') status: string
  ) {
    return this.bookingsService.updateStatus(+bookingId, status);
  }

  @Get(':bookingId')
  getBookingDetails(@Param('bookingId') bookingId: string) {
    return this.bookingsService.getBookingDetails(+bookingId);
  }
}
