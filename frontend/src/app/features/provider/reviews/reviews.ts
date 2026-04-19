import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { RatingModule } from 'primeng/rating';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';

import { BookingService } from '../../../core/services/booking.service';

export interface RatingBreakdownRow {
  stars: number;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-provider-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule, AvatarModule, ProgressBarModule],
  templateUrl: './reviews.html',
  styleUrl: './reviews.css',
})
export class Reviews {
  private titleService = inject(Title);
  public bookingService = inject(BookingService);

  // Filter reviews where providerId is 'me' (representing the logged-in provider)
  myReviews = computed(() => this.bookingService.reviews().filter(r => r.providerId === 'me'));

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
}
