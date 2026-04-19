import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';

import { DataService, CatalogService, CatalogProvider } from '../../../core/services/data.service';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    ButtonModule, DialogModule, TagModule,
    InputTextModule, ChipModule, AvatarModule, DividerModule
  ],
  templateUrl: './service-detail.html',
  styleUrl: './service-detail.css'
})
export class ServiceDetail implements OnInit {
  private dataService = inject(DataService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private titleService = inject(Title);

  service: CatalogService | undefined;

  // ── Booking dialog state ──
  bookingVisible = false;
  selectedProvider: CatalogProvider | null = null;
  bookingDate = '';
  bookingTime = '';
  bookingNotes = '';
  bookingSuccess = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.service = this.dataService.getServiceById(id);
      if (this.service) {
        this.titleService.setTitle('Local Service Management System | ' + this.service.title);
      }
    }
  }

  openBooking(provider: CatalogProvider) {
    this.selectedProvider = provider;
    this.bookingDate = '';
    this.bookingTime = '';
    this.bookingNotes = '';
    this.bookingSuccess.set(false);
    this.bookingVisible = true;
  }

  confirmBooking() {
    if (this.selectedProvider && this.bookingDate && this.bookingTime && this.service) {
      const dateStr = `${this.bookingDate}T${this.bookingTime}:00Z`;
      this.dataService.addToCart({
        service: this.service,
        provider: this.selectedProvider,
        date: dateStr
      });
      this.bookingSuccess.set(true);
    }
  }

  goToCheckout() {
    this.bookingVisible = false;
    this.router.navigate(['/app/customer/checkout']);
  }

  goToBookings() {
    this.bookingVisible = false;
    this.router.navigate(['/app/customer/bookings']);
  }

  goBack() {
    this.router.navigate(['/app/customer/services']);
  }

  get canConfirm(): boolean {
    return !!(this.bookingDate && this.bookingTime);
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  getRatingStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }
}
