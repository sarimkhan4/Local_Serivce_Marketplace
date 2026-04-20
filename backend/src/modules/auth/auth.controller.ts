import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * AuthController
 * API endpoints for authentication.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() req: any) {
    const user = await this.authService.validateUser(req.email, req.password);
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() req: any) {
    const user = await this.authService.signup(req);
    return this.authService.login(user);
  }
}
