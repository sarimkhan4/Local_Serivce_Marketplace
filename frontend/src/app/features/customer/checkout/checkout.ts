import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { lastValueFrom } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';

import { DataService } from '../../../core/services/data.service';
import { BookingService } from '../../../core/services/booking.service';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule,
    ButtonModule, SelectModule, CardModule, InputTextModule, DividerModule, TagModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  public dataService = inject(DataService);
  public bookingService = inject(BookingService);
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private titleService = inject(Title);

  paymentMethods = [
    { label: 'Credit Card', value: 'Credit Card', icon: 'pi pi-credit-card' },
    { label: 'PayPal', value: 'PayPal', icon: 'pi pi-paypal' },
    { label: 'Cash on Delivery', value: 'Cash', icon: 'pi pi-money-bill' }
  ];

  selectedPaymentMethod = signal<string | null>(null);
  selectedAddressId = signal<string | null>(null);
  processing = signal<boolean>(false);
  success = signal<boolean>(false);

  cardNumber = signal<string>('');
  expiryDate = signal<string>('');
  cvv = signal<string>('');

  cartItems = computed(() => this.dataService.cart());
  addresses = computed(() => this.bookingService.addresses());
  
  subtotal = computed(() => {
    return this.cartItems().reduce((sum, item) => sum + item.provider.price, 0);
  });

  tax = computed(() => this.subtotal() * 0.08); // 8% tax
  
  total = computed(() => this.subtotal() + this.tax());

  constructor() {
    this.titleService.setTitle('Servicio | Checkout');
  }

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user && user.id) {
      this.bookingService.loadAddresses(String(user.id));
    }
  }

  removeItem(index: number) {
    this.dataService.removeFromCart(index);
  }

  async processPayment() {
    if (!this.selectedPaymentMethod() || !this.selectedAddressId() || this.cartItems().length === 0) return;

    this.processing.set(true);
    
    try {
      const user = this.authService.currentUser();
      const customerId = user ? parseInt(user.id, 10) : 1; // Fallback to 1 if not logged in
      const addressId = parseInt(this.selectedAddressId() as string, 10);

      // Group cart items by provider and date
      const groups = new Map<string, any[]>();
      this.cartItems().forEach(item => {
        const key = `${item.provider.id}_${item.date}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(item);
      });

      const sub = this.subtotal();
      const taxTotal = this.tax();

      for (const [, items] of groups.entries()) {
        const providerId = parseInt(items[0].provider.id, 10) || 1;
        const date = items[0].date;
        const combinedPrice = items.reduce((sum, i) => sum + i.provider.price, 0);
        const groupTax = sub > 0 ? (combinedPrice / sub) * taxTotal : taxTotal;
        const bookingTotal = combinedPrice + groupTax;

        const bookingPayload = {
          customerId,
          providerId,
          addressId,
          date,
          totalAmount: bookingTotal,
        };

        const bookingRes: any = await lastValueFrom(this.apiService.createBooking(bookingPayload));
        const bookingId = bookingRes.bookingId;

        for (const item of items) {
          const serviceId = parseInt(item.service.id, 10) || 1;
          await lastValueFrom(this.apiService.addServiceToBooking(bookingId, serviceId));
        }

        const method = this.selectedPaymentMethod() ?? 'Cash';
        await lastValueFrom(
          this.apiService.createPayment(String(bookingId), { method, amount: bookingTotal })
        );
      }

      this.dataService.clearCart();
      this.success.set(true);
    } catch (err) {
      console.error('Failed to process payment', err);
    } finally {
      this.processing.set(false);
    }
  }

  goToBookings() {
    this.router.navigate(['/app/customer/bookings']);
  }

  getInitials(name: string): string {
    if(!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }
}
