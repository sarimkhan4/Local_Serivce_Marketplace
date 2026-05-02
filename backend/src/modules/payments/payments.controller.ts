import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ResourceOwnerGuard } from '../../common/guards/resource-owner.guard';
import { PaymentsService } from './payments.service';

/**
 * PaymentsController
 * API endpoints for managing payments.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('booking/:bookingId')
  processPayment(
    @Param('bookingId') bookingId: string,
    @Body('method') method: string,
    @Body('amount') amount: number,
  ) {
    const id = +bookingId;
    if (isNaN(id)) {
      throw new BadRequestException('bookingId must be a valid number');
    }
    return this.paymentsService.processPayment(id, method, amount);
  }

  @Get('booking/:bookingId')
  getPayment(@Param('bookingId') bookingId: string) {
    const id = +bookingId;
    if (isNaN(id)) {
      throw new BadRequestException('bookingId must be a valid number');
    }
    return this.paymentsService.getPaymentByBooking(id);
  }

  @Get('customer/:customerId')
  @Roles('Customer')
  @UseGuards(ResourceOwnerGuard)
  getPaymentsByCustomer(@Param('customerId') customerId: string) {
    const id = +customerId;
    if (isNaN(id)) {
      throw new BadRequestException('customerId must be a valid number');
    }
    return this.paymentsService.getPaymentsByCustomer(id);
  }

  @Get('provider/:providerId')
  @Roles('Provider')
  @UseGuards(ResourceOwnerGuard)
  getPaymentsByProvider(@Param('providerId') providerId: string) {
    const id = +providerId;
    if (isNaN(id)) {
      throw new BadRequestException('providerId must be a valid number');
    }
    return this.paymentsService.getPaymentsByProvider(id);
  }
}
