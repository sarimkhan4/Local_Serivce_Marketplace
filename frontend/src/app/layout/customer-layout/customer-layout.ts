import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { PopoverModule } from 'primeng/popover';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

import { NotificationService } from '../../core/services/notification.service';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth';
import { BookingService } from '../../core/services/booking.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-customer-layout',
  imports: [
    CommonModule, RouterOutlet, RouterModule,
    MenuModule, AvatarModule, ButtonModule, BadgeModule,
    PopoverModule, TagModule, DividerModule, TooltipModule
  ],
  templateUrl: './customer-layout.html',
  styleUrl: '../app-shell-layout.css',
})
export class CustomerLayout implements OnInit {
  menuItems: MenuItem[] = [];
  profileMenuItems: MenuItem[] = [];
  sidebarVisible = true;

  constructor(
    public notifService: NotificationService,
    public dataService: DataService,
    private authService: AuthService,
    private bookingService: BookingService,
    private themeService: ThemeService,
  ) {}

  toggleSidebar() { this.sidebarVisible = !this.sidebarVisible; }

  toggleTheme(): void {
    this.themeService.toggleMode();
  }

  topbarThemeIcon(): string {
    return this.themeService.isDarkMode() ? 'pi pi-moon' : 'pi pi-sun';
  }

  ngOnInit() {
    this.profileMenuItems = [
      {
        label: 'Profile',
        items: [
          { label: 'Settings', icon: 'pi pi-cog', shortcut: '⌘+O', routerLink: '/app/customer/settings' },
          { label: 'Logout', icon: 'pi pi-sign-out', shortcut: '⌘+Q', routerLink: '/login' }
        ]
      }
    ];

    const u = this.authService.currentUser();
    if (u?.id) {
      void this.notifService.loadNotifications(u.id, 'Customer');
      this.bookingService.loadAddresses(u.id);
    }

    this.menuItems = [
      {
        label: 'HOME',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/app/customer/dashboard' },
          { label: 'Browse Services', icon: 'pi pi-fw pi-search', routerLink: '/app/customer/services' },
          { label: 'Checkout / Cart', icon: 'pi pi-fw pi-shopping-cart', routerLink: '/app/customer/checkout',
            badge: this.dataService.cart().length > 0 ? this.dataService.cart().length.toString() : undefined,
            badgeStyleClass: 'p-badge-info' }
        ]
      },
      {
        label: 'ACTIVITY',
        items: [
          { label: 'My Bookings', icon: 'pi pi-fw pi-calendar', routerLink: '/app/customer/bookings' },
          { label: 'Notifications', icon: 'pi pi-fw pi-bell', routerLink: '/app/customer/notifications',
            badge: this.notifService.customerUnreadCount() > 0 ? this.notifService.customerUnreadCount().toString() : undefined,
            badgeStyleClass: 'p-badge-danger' },
          { label: 'Saved Pros', icon: 'pi pi-fw pi-heart', routerLink: '/app/customer/saved' }
        ]
      }
    ];
  }
}
