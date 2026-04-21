import { Controller, Get, Post, Delete, Body, Param , UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { SchedulesService } from './schedules.service';

/**
 * SchedulesController
 * Exposes API endpoints for managing provider schedules.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('schedules')
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('provider/:providerId')
  addSlot(
    @Param('providerId') providerId: string,
    @Body('date') date: Date,
    @Body('timeSlot') timeSlot: string
  ) {
    return this.schedulesService.addSlot(+providerId, date, timeSlot);
  }

  @Get('provider/:providerId')
  getProviderSchedule(@Param('providerId') providerId: string) {
    return this.schedulesService.getProviderSchedule(+providerId);
  }

  @Delete(':scheduleId')
  deleteSlot(@Param('scheduleId') scheduleId: string) {
    return this.schedulesService.deleteSlot(+scheduleId);
  }
}
