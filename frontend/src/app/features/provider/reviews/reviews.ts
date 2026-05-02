import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth';
import { MessageService } from 'primeng/api';

export interface RatingBreakdownRow {
  stars: number;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-provider-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, AvatarModule, ProgressBarModule, ProgressSpinnerModule, MessageModule, ButtonModule, ToastModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
  providers: [MessageService]
})
export class Reviews implements OnInit {
  private titleService = inject(Title);
  public bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  loading = false;
  error: string | null = null;

  // Get current provider ID from auth
  currentProviderId = computed(() => this.authService.currentUser()?.id);

  myReviews = computed(() => this.bookingService.providerReviews());

  averageRating = computed(() => {
    const list = this.myReviews();
    if (list.length === 0) return 0;
    const sum = list.reduce((s, r) => s + r.rating, 0);
    return sum / list.length;
  });

  ratingBreakdown = computed((): RatingBreakdownRow[] => {
    const list = this.myReviews();
    const total = list.length || 1;
    const counts = [0, 0, 0, 0, 0];
    list.forEach(r => counts[5 - r.rating]++);
    return counts.map((count, index) => ({
      stars: 5 - index,
      count,
      percentage: (count / total) * 100,
    }));
  });

  constructor() {
    this.titleService.setTitle('Servicio PRO | Reviews');
  }

  async ngOnInit() {
    const providerId = this.currentProviderId();
    if (providerId) {
      await this.loadReviews();
    } else {
      this.error = 'Unable to determine provider ID. Please log in again.';
    }
  }

  async loadReviews() {
    const providerId = this.currentProviderId();
    if (!providerId) return;

    this.loading = true;
    this.error = null;
    
    try {
      console.log(`[Reviews] Loading reviews for provider: ${providerId}`);
      await this.bookingService.loadProviderReviews(providerId);
      console.log(`[Reviews] Reviews loaded successfully, count: ${this.myReviews().length}`);
    } catch (e) {
      console.error('[Reviews] Failed to load reviews:', e);
      this.error = 'Failed to load reviews. Please try again.';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load reviews. Please try again.',
        life: 5000
      });
    } finally {
      this.loading = false;
    }
  }

  async refreshReviews() {
    await this.loadReviews();
  }
}
