import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { DataService } from '../../../core/services/data.service';
import { RouterModule } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    CardModule, 
    ButtonModule, 
    IconField, 
    InputIcon, 
    InputTextModule, 
    PasswordModule, 
    CheckboxModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  host: { 'class': 'auth-page' }
})
export class Login {
  email = '';
  password = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router, private dataService: DataService) {}

  async onSubmit() {
    console.log('Login attempt:', this.email);
    await this.authService.login(this.email, this.password);
    
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
  }
}
