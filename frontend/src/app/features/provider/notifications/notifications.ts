import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { SelectButtonModule } from 'primeng/selectbutton';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';

import { NotificationService, NotificationType } from '../../../core/services/notification.service';
import type { TagSeverity } from '../../../core/types/ui.types';

@Component({
  selector: 'app-provider-notifications',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, TagModule, AvatarModule,
    DividerModule, SelectButtonModule, BadgeModule, TooltipModule
  ],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class ProviderNotifications {
  public notifService = inject(NotificationService);
  private titleService = inject(Title);

  filterMode = signal<'all' | 'unread'>('all');
  filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' }
  ];

  filteredNotifications = computed(() => {
    const list = this.notifService.providerNotifications();
    return this.filterMode() === 'unread' ? list.filter(n => !n.isRead) : list;
  });

  newBookingCount = computed(() =>
    this.notifService.providerNotifications().filter(n => n.type === 'booking_new').length
  );

  paymentCount = computed(() =>
    this.notifService.providerNotifications().filter(n => n.type === 'payment_received').length
  );

  constructor() {
    this.titleService.setTitle('Servicio PRO | Notifications');
  }

  getTypeSeverity(type: NotificationType): TagSeverity {
    const map: Record<NotificationType, TagSeverity> = {
      booking_new: 'info',
      booking_confirmed: 'success',
      booking_cancelled: 'danger',
      booking_completed: 'success',
      schedule_reminder: 'warn',
      review_received: 'success',
      payment_received: 'success',
      message_received: 'info',
      system: 'secondary',
    };
    return map[type] ?? 'secondary';
  }

  getTypeLabel(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      booking_new: 'New Booking', booking_confirmed: 'Confirmed',
      booking_cancelled: 'Cancelled', booking_completed: 'Completed',
      schedule_reminder: 'Reminder', review_received: 'Review',
      payment_received: 'Payment', message_received: 'Message', system: 'System'
    };
    return map[type] ?? type;
  }
}
