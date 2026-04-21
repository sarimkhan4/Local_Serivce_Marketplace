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
  createBooking(
    @Body('customerId') customerId: number,
    @Body('providerId') providerId: number,
    @Body('addressId') addressId: number,
    @Body('date') date: Date,
    @Body('totalAmount') totalAmount: number
  ) {
    return this.bookingsService.createBooking(customerId, providerId, addressId, date, totalAmount);
  }

  @Post(':bookingId/services')
  addServiceToBooking(
    @Param('bookingId') bookingId: string,
    @Body('serviceId') serviceId: number
  ) {
    return this.bookingsService.addServiceToBooking(+bookingId, serviceId);
  }

  @Get(':bookingId')
  getBookingDetails(@Param('bookingId') bookingId: string) {
    return this.bookingsService.getBookingDetails(+bookingId);
  }

  @Get('provider/:providerId')
  getBookingsByProvider(@Param('providerId') providerId: string) {
    return this.bookingsService.getBookingsByProvider(+providerId);
  }

  @Get('customer/:customerId')
  getBookingsByCustomer(@Param('customerId') customerId: string) {
    return this.bookingsService.getBookingsByCustomer(+customerId);
  }

  @Patch(':bookingId/status')
  updateStatus(
    @Param('bookingId') bookingId: string,
    @Body('status') status: string
  ) {
    return this.bookingsService.updateStatus(+bookingId, status);
  }
}
