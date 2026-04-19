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
import { AuthService } from '../../core/services/auth';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-provider-layout',
  imports: [
    CommonModule, RouterOutlet, RouterModule,
    MenuModule, AvatarModule, ButtonModule, BadgeModule,
    PopoverModule, TagModule, DividerModule, TooltipModule
  ],
  templateUrl: './provider-layout.html',
  styleUrl: '../app-shell-layout.css',
})
export class ProviderLayout implements OnInit {
  menuItems: MenuItem[] = [];
  profileMenuItems: MenuItem[] = [];
  sidebarVisible = true;

  constructor(
    public notifService: NotificationService,
    private authService: AuthService,
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
          { label: 'Settings', icon: 'pi pi-cog', shortcut: '⌘+O', routerLink: '/app/provider/settings' },
          { label: 'Logout', icon: 'pi pi-sign-out', shortcut: '⌘+Q', routerLink: '/login' }
        ]
      }
    ];

    const u = this.authService.currentUser();
    if (u?.id) {
      void this.notifService.loadNotifications(u.id, 'Provider');
    }

    this.menuItems = [
      {
        label: 'HOME',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: '/app/provider/dashboard' }
        ]
      },
      {
        label: 'BUSINESS MANAGEMENT',
        items: [
          { label: 'Schedule', icon: 'pi pi-fw pi-calendar', routerLink: '/app/provider/schedule' },
          { label: 'Availability', icon: 'pi pi-fw pi-clock', routerLink: '/app/provider/availability' },
          { label: 'Notifications', icon: 'pi pi-fw pi-bell', routerLink: '/app/provider/notifications',
            badge: this.notifService.providerUnreadCount() > 0 ? this.notifService.providerUnreadCount().toString() : undefined,
            badgeStyleClass: 'p-badge-danger' },
          { label: 'My Services', icon: 'pi pi-fw pi-briefcase', routerLink: '/app/provider/services' },
          { label: 'Customer Reviews', icon: 'pi pi-fw pi-star', routerLink: '/app/provider/reviews' },
          { label: 'Earnings', icon: 'pi pi-fw pi-chart-line', routerLink: '/app/provider/earnings' }
        ]
      }
    ];
  }
}
