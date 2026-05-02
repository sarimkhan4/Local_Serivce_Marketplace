import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { paymentsProviders } from './payments.provider';
import { DatabaseModule } from '../database/database.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [DatabaseModule, BookingsModule],
  controllers: [PaymentsController],
  providers: [...paymentsProviders, PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
