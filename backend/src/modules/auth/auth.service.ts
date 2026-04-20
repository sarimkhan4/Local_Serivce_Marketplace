import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../../entities/user.entity';

/**
 * AuthService
 * Handles user authentication.
 */
@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Dummy login validation
   */
  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findByEmailWithPassword(email);
    
    if (!user || user.password !== pass) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async signup(data: any): Promise<User> {
    const existing = await this.usersService.findByEmailWithPassword(data.email);
    if (existing) {
      throw new UnauthorizedException('Email already in use');
    }

    const baseData = {
      email: data.email,
      password: data.password || 'password123',
      name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      phone: data.phoneNumber || '0000000000',
    };

    if (data.role === 'customer' || data.role === 'Customer') {
      const customer = await this.usersService.createCustomer({
        ...baseData,
      });
      return customer;
    } else if (data.role === 'provider' || data.role === 'Provider') {
      const provider = await this.usersService.createProvider({
        ...baseData,
        experience: data.experienceYears || 0,
      });
      return provider;
    } else {
      throw new UnauthorizedException('Invalid role');
    }
  }

  /**
   * Basic auth handler
   */
  async login(user: User) {
    // Return token in a real app
    return {
      access_token: 'dummy_token',
      userId: user.userId,
      name: user.name,
      role: (user as any).role || 'Customer' // default to customer if missing
    };
  }
}
