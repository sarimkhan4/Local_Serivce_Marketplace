import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { DataService } from '../../../core/services/data.service';
import { RouterModule } from '@angular/router';
import { describeHttpApiError } from '../../../core/utils/validation.utils';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrl: './login.css',
  host: { 'class': 'auth-page' }
})
export class Login {
  loginForm: FormGroup;
  isLoading = false;

  private authService = inject(AuthService);
  private router = inject(Router);
  private dataService = inject(DataService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  async onSubmit() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      const e = this.loginForm.get('email')?.errors;
      const p = this.loginForm.get('password')?.errors;
      const parts: string[] = [];
      if (e?.['required']) parts.push('Email is required.');
      if (e?.['email']) parts.push('Enter a valid email address.');
      if (p?.['required']) parts.push('Password is required.');
      if (p?.['minlength']) parts.push('Password must be at least 6 characters.');
      this.messageService.add({
        severity: 'warn',
        summary: 'Cannot sign in yet',
        detail: parts.length ? parts.join(' ') : 'Please fix the highlighted fields.',
        life: 5000,
      });
      return;
    }

    this.isLoading = true;
    try {
      await this.authService.login(
        this.loginForm.value.email, 
        this.loginForm.value.password
      );
      
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Welcome back! You have successfully logged in.',
        life: 3000
      });

      // Check for pending actions
      const pending = localStorage.getItem('pendingAction');
      if (pending) {
         const action = JSON.parse(pending);
         if (action.type === 'save') {
             this.dataService.savePro({
                 id: action.service.id,
                 firstName: action.service.name,
                 lastName: '',
                 companyName: 'LSM Local Provider',
                 category: action.categoryName,
                 rating: 4.5,
                 reviews: 10,
                 bio: 'Saved from Home page.'
             });
             localStorage.removeItem('pendingAction');
             this.router.navigate(['/app/customer/saved']);
             return;
         } else if (action.type === 'book') {
             this.dataService.createBooking(action.service.name, 'LSM Local Provider', new Date().toISOString(), action.service.startingPrice);
             localStorage.removeItem('pendingAction');
             this.router.navigate(['/app/customer/bookings']);
             return;
         }
      }

      const userRole = this.authService.currentUser()?.role;
      if (userRole === 'Provider') {
        this.router.navigate(['/app/provider/dashboard']);
      } else {
        this.router.navigate(['/app/customer/dashboard']);
      }
    } catch (error: unknown) {
      console.error('Login failed:', error);
      const err = error as { status?: number };
      let errorMessage =
        err.status === 401
          ? 'Invalid email or password. Please try again or reset your password.'
          : describeHttpApiError(error, 'Unable to reach the server. Check your connection and try again.');
      const raw = describeHttpApiError(error, '');
      if (/locked|suspend|disabled/i.test(raw)) {
        errorMessage = raw;
      }
      
      this.messageService.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: errorMessage,
        life: 6500,
      });
    } finally {
      this.isLoading = false;
    }
  }
}
