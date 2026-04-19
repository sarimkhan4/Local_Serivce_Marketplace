import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Customer' | 'Provider' | 'Admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  
  // Global Signal for authentication state
  readonly currentUser = signal<User | null>(null);
  readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const user = JSON.parse(raw) as User;
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      } catch {
        /* ignore invalid cache */
      }
    }
  }

  async login(email: string, role: 'Customer' | 'Provider'): Promise<void> {
    try {
      // In reality, password should be prompted. Using default for dev bridging.
      const response = await lastValueFrom(
        this.http.post<{access_token: string, userId: string, name: string, role: string}>(
          `${environment.apiUrl}/auth/login`, 
          { email, password: 'password123' } // using hardcoded pass for dev tests
        )
      );

      const [firstName, ...lastNames] = (response.name || '').split(' ');
      
      const user: User = {
        id: response.userId.toString(),
        email,
        firstName: firstName || 'User',
        lastName: lastNames.join(' ') || '',
        role: response.role as any
      };
      
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      
      // Store token (in a real app we would use localStorage/sessionStorage)
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  }

  logout(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}
