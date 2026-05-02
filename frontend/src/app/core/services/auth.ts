import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
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
  private router = inject(Router);
  
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

  async login(email: string, password: string): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.post<{access_token: string, userId: string, name: string, role: string}>(
          `${environment.apiUrl}/auth/login`, 
          { email, password }
        )
      );

      const [firstName, ...lastNames] = (response.name || '').split(' ');
      
      const formattedRole = response.role ? (response.role.charAt(0).toUpperCase() + response.role.slice(1).toLowerCase()) : 'Customer';
      
      const user: User = {
        id: response.userId.toString(),
        email,
        firstName: firstName || 'User',
        lastName: lastNames.join(' ') || '',
        role: formattedRole as any
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

  async signup(data: any): Promise<void> {
    try {
      const response = await lastValueFrom(
        this.http.post<{access_token: string, userId: string, name: string, role: string}>(
          `${environment.apiUrl}/auth/signup`,
          data
        )
      );

      const [firstName, ...lastNames] = (response.name || '').split(' ');
      
      const formattedRole = response.role ? (response.role.charAt(0).toUpperCase() + response.role.slice(1).toLowerCase()) : 'Customer';
      
      const user: User = {
        id: response.userId.toString(),
        email: data.email,
        firstName: firstName || 'User',
        lastName: lastNames.join(' ') || '',
        role: formattedRole as any
      };
      
      this.currentUser.set(user);
      this.isAuthenticated.set(true);
      
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
    } catch (error) {
      console.error('Signup failed', error);
      throw error;
    }
  }

  /** Clear auth everywhere (signals + storage). Caller may navigate. */
  clearSession(): void {
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }

  logout(): void {
    this.clearSession();
    void this.router.navigate(['/login'], { replaceUrl: true });
  }
}
