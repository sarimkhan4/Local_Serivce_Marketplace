import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';

export type NotificationType =
  | 'booking_new'
  | 'booking_confirmed'
  | 'booking_cancelled'
  | 'booking_completed'
  | 'review_received'
  | 'payment_received'
  | 'schedule_reminder'
  | 'message_received'
  | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedEntityId?: string;
  avatarLabel?: string;
  avatarColor?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private apiService = inject(ApiService);

  private _customerNotifications = signal<AppNotification[]>([]);

  private _providerNotifications = signal<AppNotification[]>([]);

  customerUnreadCount = computed(() => this._customerNotifications().filter(n => !n.isRead).length);
  providerUnreadCount = computed(() => this._providerNotifications().filter(n => !n.isRead).length);

  get customerNotifications() { return this._customerNotifications; }
  get providerNotifications() { return this._providerNotifications; }

  async loadNotifications(userId: string, role: 'Customer' | 'Provider') {
    this.apiService.getUserNotifications(userId).subscribe((data: any) => {
      const formatted = data.map((n: any) => ({
        id: n.notificationId.toString(),
        type: n.type || 'system',
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        createdAt: new Date(n.createdAt),
        avatarLabel: 'Sys',
        avatarColor: '#14b8a6'
      }));

      if (role === 'Customer') {
        this._customerNotifications.set(formatted);
      } else {
        this._providerNotifications.set(formatted);
      }
    });
  }

  markCustomerRead(id: string) {
    this._customerNotifications.update(list => list.map(n => n.id === id ? { ...n, isRead: true } : n));
  }
  markProviderRead(id: string) {
    this._providerNotifications.update(list => list.map(n => n.id === id ? { ...n, isRead: true } : n));
  }
  markAllCustomerRead() {
    this._customerNotifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }
  markAllProviderRead() {
    this._providerNotifications.update(list => list.map(n => ({ ...n, isRead: true })));
  }
  deleteCustomerNotification(id: string) {
    this._customerNotifications.update(list => list.filter(n => n.id !== id));
  }
  deleteProviderNotification(id: string) {
    this._providerNotifications.update(list => list.filter(n => n.id !== id));
  }

  getIconForType(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      booking_new: 'pi pi-calendar-plus',
      booking_confirmed: 'pi pi-check-circle',
      booking_cancelled: 'pi pi-times-circle',
      booking_completed: 'pi pi-verified',
      review_received: 'pi pi-star-fill',
      payment_received: 'pi pi-dollar',
      schedule_reminder: 'pi pi-clock',
      message_received: 'pi pi-envelope',
      system: 'pi pi-info-circle',
    };
    return map[type] ?? 'pi pi-bell';
  }

  getTimeAgo(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
  }
}
