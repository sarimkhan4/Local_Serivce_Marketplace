import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../core/services/auth';
import { BookingService } from '../../../core/services/booking.service';
import { RouterModule } from '@angular/router';
import { lastValueFrom } from 'rxjs';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { describeHttpApiError } from '../../../core/utils/validation.utils';

function phoneFlexibleValidator(): ValidatorFn {
  return (ctrl: AbstractControl): ValidationErrors | null => {
    const raw = ctrl.value;
    if (raw === null || raw === undefined || String(raw).trim() === '') return null;
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) return { phoneLength: true };
    return null;
  };
}

/** US ZIP/ZIP+4 style or alphanumeric international postal codes */
const POSTAL_REGEX = /^(\d{5}(-\d{4})?|[A-Za-z\d][A-Za-z\d\s\-]{2,14})$/;

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    RouterModule,
    CardModule, 
    ButtonModule, 
    IconField, 
    InputIcon, 
    InputTextModule, 
    PasswordModule, 
    SelectButtonModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
  host: { 'class': 'auth-page' }
})
export class Signup implements OnInit {
  selectedRole: string = 'customer';
  roleOptions: any[] = [
    { label: 'Customer', value: 'customer' },
    { label: 'Service Provider', value: 'provider' }
  ];

  signupForm!: FormGroup;
  isLoading = false;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private dataService: DataService, 
    private bookingService: BookingService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      phoneNumber: ['', [Validators.required, phoneFlexibleValidator()]],
      
      // Customer-specific fields
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(POSTAL_REGEX)]],

      // Provider-specific fields
      companyName: ['', Validators.required],
      bio: ['', [Validators.required, Validators.minLength(20)]],
      experienceYears: [null, [Validators.required, Validators.min(0)]]
    });

    this.updateValidators();
  }

  onRoleChange() {
    this.updateValidators();
  }

  private updateValidators() {
    const customerFields = ['street', 'city', 'state', 'zipCode'];
    const providerFields = ['companyName', 'bio', 'experienceYears'];

    if (this.selectedRole === 'customer') {
      customerFields.forEach(field => {
        this.signupForm.get(field)?.setValidators([Validators.required]);
        if (field === 'zipCode') {
           this.signupForm.get(field)?.setValidators([Validators.required, Validators.pattern(POSTAL_REGEX)]);
        }
      });
      providerFields.forEach(field => this.signupForm.get(field)?.clearValidators());
    } else {
      customerFields.forEach(field => this.signupForm.get(field)?.clearValidators());
      providerFields.forEach(field => {
        this.signupForm.get(field)?.setValidators([Validators.required]);
        if (field === 'bio') {
          this.signupForm.get(field)?.setValidators([Validators.required, Validators.minLength(20)]);
        }
        if (field === 'experienceYears') {
          this.signupForm.get(field)?.setValidators([Validators.required, Validators.min(0)]);
        }
      });
    }

    customerFields.forEach(field => this.signupForm.get(field)?.updateValueAndValidity());
    providerFields.forEach(field => this.signupForm.get(field)?.updateValueAndValidity());
  }

  async onSubmit() {
    this.signupForm.markAllAsTouched();

    if (this.signupForm.invalid) {
      this.showSignupValidationSummary();
      return;
    }

    this.isLoading = true;
    const formValues = this.signupForm.value;
    const normalizedPhoneDigits = String(formValues.phoneNumber ?? '').replace(/\D/g, '').slice(0, 15);
    
    const signupData = {
      role: this.selectedRole === 'customer' ? 'Customer' : 'Provider',
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email.trim(),
      password: formValues.password,
      phoneNumber: normalizedPhoneDigits.length >= 10 ? normalizedPhoneDigits : formValues.phoneNumber,
      street: formValues.street,
      city: formValues.city,
      state: formValues.state,
      zipCode: formValues.zipCode,
      companyName: formValues.companyName,
      bio: formValues.bio,
      experienceYears: formValues.experienceYears
    };
    
    try {
      await this.authService.signup(signupData);

      const newUserId = this.authService.currentUser()?.id;

      this.messageService.add({
        severity: 'success',
        summary: 'Registration Successful',
        detail: 'Account created successfully! Redirecting...',
        life: 3000
      });

      if (this.selectedRole === 'customer' && newUserId && formValues.street && formValues.city) {
        try {
          await this.bookingService.addAddress(newUserId, {
            street: formValues.street,
            city: formValues.city,
            state: formValues.state,
            zipCode: formValues.zipCode,
            isDefault: true,
            label: 'Home'
          });
        } catch (error) {
          console.error('Failed to save address:', error);
        }
      }
      
      // Check pending actions only if customer
      if (this.selectedRole === 'customer') {
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
         this.router.navigate(['/app/customer/dashboard']);
      } else {
         this.router.navigate(['/app/provider/dashboard']);
      }
    } catch (error: unknown) {
      console.error('Signup failed:', error);

      const err = error as { status?: number };
      let detail = describeHttpApiError(error, 'Registration could not be completed. Please try again.');

      if (err.status === 409 || /already\s+(in\s+)?use|duplicate|exists/i.test(detail)) {
        detail = 'This email is already registered. Please sign in or use a different email address.';
      }

      if (err.status === 400 && detail.length < 3) {
        detail = describeHttpApiError(error, 'Please check your information and try again.');
      }

      this.messageService.add({
        severity: 'error',
        summary: 'Registration Failed',
        detail,
        life: 6000,
      });
    } finally {
      this.isLoading = false;
    }
  }

  private showSignupValidationSummary(): void {
    const f = this.signupForm;
    const msgs: string[] = [];

    if (f.get('email')?.errors?.['required']) msgs.push('Email is required.');
    if (f.get('email')?.errors?.['email']) msgs.push('Email format is invalid.');

    if (f.get('phoneNumber')?.errors?.['required']) msgs.push('Phone number is required.');
    if (f.get('phoneNumber')?.errors?.['phoneLength']) msgs.push('Phone number needs 10–15 digits.');

    const zipErr = f.get('zipCode')?.errors;
    if (this.selectedRole === 'customer' && (zipErr?.['required'] || zipErr?.['pattern'])) {
      msgs.push('Postal / ZIP code is invalid (e.g. 12345 or 12345-6789, or an international postal code).');
    }

    if (f.get('password')?.errors?.['pattern']) {
      msgs.push('Password needs upper & lower case, a number, and a special character (@$!%*?&).');
    }

    if (msgs.length === 0) {
      msgs.push('Please fix the highlighted fields and try again.');
    }

    this.messageService.add({
      severity: 'warn',
      summary: 'Check your information',
      detail: msgs.join(' '),
      life: 8000,
    });
  }
}

