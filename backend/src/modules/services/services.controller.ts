import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { IsPublic } from '../../common/decorators/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { ServicesService } from './services.service';

/**
 * ServicesController
 * Exposes API endpoints for services and provider pricing.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @IsPublic()
  @Get()
  getAllServices(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? Math.max(1, +page) : undefined;
    const limitNum = limit ? Math.min(100, Math.max(1, +limit)) : undefined;
    return this.servicesService.findAll(pageNum, limitNum, search);
  }

  @IsPublic()
  @Get('listings')
  getAllProviderServices() {
    return this.servicesService.getAllProviderServices();
  }

  @IsPublic()
  @Get('provider/:providerId')
  getServicesByProvider(@Param('providerId') providerId: string) {
    return this.servicesService.getServicesByProvider(+providerId);
  }

  @IsPublic()
  @Get(':serviceId/providers')
  getProvidersByService(@Param('serviceId') serviceId: string) {
    if (isNaN(+serviceId)) return [];
    return this.servicesService.getProvidersByService(+serviceId);
  }

  @IsPublic()
  @Get(':id')
  getService(@Param('id') id: string) {
    if (isNaN(+id)) return null; // Simple guard
    return this.servicesService.findById(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Admin')
  @Post()
  createService(@Body() data: any) {
    return this.servicesService.create(data);
  }

  // --- ProviderService logic ---

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Provider')
  @Post('provider')
  addProviderService(
    @Request() req: any,
    @Body() body: { serviceId?: number; name?: string; description?: string; categoryId?: number; price: number }
  ) {
    const providerId = req.user.userId;
    return this.servicesService.addProviderService(+providerId, body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
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
