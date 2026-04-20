import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ServicesService } from './services.service';

/**
 * ServicesController
 * Exposes API endpoints for services and provider pricing.
 */
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  getAllServices() {
    return this.servicesService.findAll();
  }

  @Get('listings')
  getAllProviderServices() {
    return this.servicesService.getAllProviderServices();
  }

  @Get('provider/:providerId')
  getServicesByProvider(@Param('providerId') providerId: string) {
    return this.servicesService.getServicesByProvider(+providerId);
  }

  @Get(':id')
  getService(@Param('id') id: string) {
    if (isNaN(+id)) return null; // Simple guard
    return this.servicesService.findById(+id);
  }

  @Roles('Admin')
  @Post()
  createService(@Body() data: any) {
    return this.servicesService.create(data);
  }

  // --- ProviderService logic ---

  @Roles('Provider')
  @Post('provider')
  addProviderService(
    @Request() req: any,
    @Body() body: { serviceId?: number; name?: string; description?: string; categoryId?: number; price: number }
  ) {
    const providerId = req.user.userId;
    return this.servicesService.addProviderService(+providerId, body);
  }

  @Roles('Provider')
  @Post('provider/bulk')
  bulkSaveProviderServices(
    @Request() req: any,
    @Body() services: { serviceId: number, price: number }[]
  ) {
    const providerId = req.user.userId;
    return this.servicesService.bulkSaveProviderServices(+providerId, services);
  }
}
