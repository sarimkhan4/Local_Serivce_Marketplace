import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart'; 
import { SkeletonModule } from 'primeng/skeleton';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, ChartModule, ProgressBarModule, MenuModule, SkeletonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class CustomerDashboard implements OnInit {
  loading = signal(true);
  chartData: any;
  chartOptions: any;
  menuItems: MenuItem[] = [
    { label: 'View Details', icon: 'pi pi-search' },
    { label: 'Cancel', icon: 'pi pi-times', styleClass: 'text-red-500' },
    { label: 'Contact Provider', icon: 'pi pi-envelope' }
  ];

  stats: any[] = [];
  appointments: any[] = [];
  mostBookedCategories: any[] = [];
  notifications: any[] = [];

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  async ngOnInit() {
    this.initChart();
    await this.loadDashboardData();
    this.loading.set(false);
  }

  async loadDashboardData() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    try {
      const [bookingsRaw, notifsRaw]: any = await Promise.all([
        lastValueFrom(this.apiService.getCustomerBookings(userId)),
        lastValueFrom(this.apiService.getUserNotifications(userId))
      ]);
      
      const bookings = bookingsRaw || [];
      const notifs = notifsRaw || [];

      // APPOINTMENTS (Latest 3)
      this.appointments = bookings
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
        .map((b: any) => ({
          id: b.bookingId,
          provider: b.provider?.name || 'Unknown Provider',
          service: b.services?.length ? b.services[0].name : 'Service',
          status: b.status.charAt(0).toUpperCase() + b.status.slice(1).toLowerCase(),
          amount: '$' + Number(b.totalAmount).toFixed(2),
          image: ''
        }));

      // STATS
      const activeBookings = bookings.filter((b: any) => ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(b.status));
      const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');
      const totalSpent = completedBookings.reduce((sum: number, b: any) => sum + Number(b.totalAmount), 0);
      const uniquePros = new Set(completedBookings.map((b: any) => b.provider?.userId)).size;

      this.stats = [
        { label: 'Active Bookings', value: activeBookings.length.toString(), icon: 'pi pi-calendar-plus', color: 'blue', detailValue: 'Ongoing', detailText: 'currently scheduled' },
        { label: 'Completed Services', value: completedBookings.length.toString(), icon: 'pi pi-check-circle', color: 'green', detailValue: 'Past', detailText: 'completed jobs' },
        { label: 'Total Spent', value: '$' + totalSpent.toFixed(0), icon: 'pi pi-wallet', color: 'orange', detailValue: 'Paid', detailText: 'revenue collected' },
        { label: 'Provider Interactions', value: uniquePros.toString(), icon: 'pi pi-users', color: 'cyan', detailValue: 'Pros', detailText: 'worked with' }
      ];

      // MOST BOOKED CATEGORIES (Approximation out of completed)
      const categoriesMap: { [key: string]: number } = {};
      completedBookings.forEach((b: any) => {
         const cat = b.services?.length && b.services[0].category ? b.services[0].category.categoryName : 'General Services';
         categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
      });

      const totalCats = Math.max(1, completedBookings.length);
      const sortedCats = Object.entries(categoriesMap).sort((a,b) => b[1]-a[1]).slice(0, 4);
      const colors = ['orange', 'cyan', 'pink', 'green'];
      this.mostBookedCategories = sortedCats.map((c, i) => ({
        name: c[0],
        bookings: c[1].toString(),
        revenue: '%' + Math.round((c[1]/totalCats)*100),
        progress: Math.round((c[1]/totalCats)*100),
        color: colors[i % colors.length]
      }));

      // NOTIFICATIONS 
      if (notifs.length > 0) {
        this.notifications = notifs.slice(0, 3).map((n: any) => {
           let icon = 'pi-bell';
           let color = 'blue';
           if (n.type === 'booking_created' || n.type === 'booking_update') { icon = 'pi-check'; color = 'green'; }
           if (n.type === 'payment_success') { icon = 'pi-credit-card'; color = 'cyan'; }
           
           return { text: n.title, amount: n.message, icon, color };
        });
      } else {
        this.notifications = [];
      }

    } catch (e) {
      console.error('Failed to load dashboard data', e);
    }
  }

  initChart() {
    this.chartData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                type: 'bar',
                label: 'Subscriptions',
                backgroundColor: '#4f83cc', 
                data: [9000, 15000, 20000, 9000],
                barThickness: 32,
                borderRadius: 2
            },
            {
                type: 'bar',
                label: 'Advertising',
                backgroundColor: '#7aabdd', 
                data: [2100, 8400, 2400, 7500],
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Affiliate',
                backgroundColor: '#a9c8ed', 
                data: [4100, 2600, 3400, 7400],
                borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
                borderSkipped: false,
                barThickness: 32
            }
        ]
    };

    this.chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltip: { mode: 'index', intersect: false },
            legend: { position: 'bottom', labels: { color: '#475569', usePointStyle: true, padding: 20 } }
        },
        scales: {
            x: { stacked: true, ticks: { color: '#64748b' }, grid: { color: 'transparent', borderColor: 'transparent' } },
            y: { stacked: true, ticks: { color: '#64748b' }, grid: { color: '#e2e8f0', borderColor: 'transparent', drawTicks: false } }
        }
    };
  }
}
