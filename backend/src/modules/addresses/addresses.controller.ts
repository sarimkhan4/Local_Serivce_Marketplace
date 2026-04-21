import { Controller, Get, Post, Put, Delete, Body, Param , UseGuards} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { AddressesService } from './addresses.service';

/**
 * AddressesController
 * API endpoints for managing user addresses.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post('user/:userId')
  addAddress(
    @Param('userId') userId: string,
    @Body() data: any
  ) {
    return this.addressesService.addAddress(+userId, data);
  }

  @Get('user/:userId')
  getUserAddresses(@Param('userId') userId: string) {
    return this.addressesService.getUserAddresses(+userId);
  }

  @Put(':addressId')
  updateAddress(
    @Param('addressId') addressId: string,
    @Body() data: any
  ) {
    return this.addressesService.updateAddress(+addressId, data);
  }

  @Delete(':addressId')
  deleteAddress(@Param('addressId') addressId: string) {
    return this.addressesService.deleteAddress(+addressId);
  }
}
