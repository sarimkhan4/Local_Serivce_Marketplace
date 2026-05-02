import { Component, OnInit, OnDestroy, signal, inject } from '@angular/core';
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
import { BookingService } from '../../../core/services/booking.service';
import { lastValueFrom } from 'rxjs';

function normStatus(s: unknown): string {
  return String(s ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');
}

function prettyBookingStatus(raw: unknown): string {
  const n = normStatus(raw);
  const map: Record<string, string> = {
    COMPLETED: 'Completed',
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    CANCELLED: 'Cancelled',
    IN_PROGRESS: 'In Progress',
  };
  return map[n] ?? n.charAt(0) + n.slice(1).toLowerCase().replace(/_/g, ' ');
}

function serviceRow(b: any) {
  const j = b.services?.[0];
  return j?.service ?? j;
}

function bookingServiceLabel(b: any): string {
  const svc = serviceRow(b);
  return svc?.name ?? 'Service';
}

function bookingCategoryLabel(b: any): string {
  const svc = serviceRow(b);
  const c = svc?.category;
  return c?.categoryName ?? c?.name ?? 'General Services';
}

@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, ChartModule, ProgressBarModule, MenuModule, SkeletonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class CustomerDashboard implements OnInit, OnDestroy {
  loading = signal(true);
  chartData: any;
  chartOptions: any;
  livelyChartData: any;
  livelyChartOptions: any;

  menuItems: MenuItem[] = [
    { label: 'View Details', icon: 'pi pi-search' },
    { label: 'Cancel', icon: 'pi pi-times', styleClass: 'text-red-500' },
    { label: 'Contact Provider', icon: 'pi pi-envelope' },
  ];

  stats: any[] = [];
  appointments: any[] = [];
  mostBookedCategories: any[] = [];
  notifications: any[] = [];

  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);

  async ngOnInit() {
    this.initChartOptionsOnly();
    await this.loadDashboardData();
    this.loading.set(false);
  }

  ngOnDestroy() {
    /** No synthetic chart intervals — data loads from APIs only */
  }

  async loadDashboardData() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    try {
      const [bookingsRaw, notifsRaw]: any = await Promise.all([
        lastValueFrom(this.apiService.getCustomerBookings(userId)),
        lastValueFrom(this.apiService.getUserNotifications(userId)),
      ]);
      await this.bookingService.loadPaymentsForCustomer(userId);

      const bookings = bookingsRaw || [];
      const notifs = notifsRaw || [];

      this.appointments = bookings
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3)
        .map((b: any) => ({
          id: b.bookingId,
          provider: b.provider?.name || 'Unknown Provider',
          service: bookingServiceLabel(b),
          status: prettyBookingStatus(b.status),
          amount: '$' + Number(b.totalAmount).toFixed(2),
          image:
            'https://ui-avatars.com/api/?name=' +
            encodeURIComponent(b.provider?.name || 'Unknown Provider') +
            '&background=random',
        }));

      const activeBookings = bookings.filter((b: any) =>
        ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(normStatus(b.status)),
      );
      const completedBookings = bookings.filter(
        (b: any) => normStatus(b.status) === 'COMPLETED' || normStatus(b.status) === 'COMPLETE',
      );
      const payments = this.bookingService.payments();
      const spentFromPayments = payments.filter((p) => p.status === 'Completed').reduce((s, p) => s + p.amount, 0);
      const totalSpent =
        spentFromPayments > 0
          ? spentFromPayments
          : completedBookings.reduce((sum: number, booking: unknown) => {
              const row = booking as { totalAmount?: number | string };
              return sum + Number(row.totalAmount);
            }, 0);

      const uniquePros = new Set(completedBookings.map((b: any) => b.provider?.userId)).size;

      this.stats = [
        {
          label: 'Active Bookings',
          value: activeBookings.length.toString(),
          icon: 'pi pi-calendar-plus',
          color: 'blue',
          detailValue: 'Ongoing',
          detailText: 'currently scheduled',
        },
        {
          label: 'Completed Services',
          value: completedBookings.length.toString(),
          icon: 'pi pi-check-circle',
          color: 'green',
          detailValue: 'Past',
          detailText: 'completed jobs',
        },
        {
          label: 'Total Spent',
          value: '$' + totalSpent.toFixed(0),
          icon: 'pi pi-wallet',
          color: 'orange',
          detailValue: 'Paid',
          detailText: 'revenue collected',
        },
        {
          label: 'Provider Interactions',
          value: uniquePros.toString(),
          icon: 'pi pi-users',
          color: 'cyan',
          detailValue: 'Pros',
          detailText: 'worked with',
        },
      ];

      const categoriesMap: { [key: string]: number } = {};
      completedBookings.forEach((b: any) => {
        const cat = bookingCategoryLabel(b);
        categoriesMap[cat] = (categoriesMap[cat] || 0) + 1;
      });

      const totalCats = Math.max(1, completedBookings.length);
      const sortedCats = Object.entries(categoriesMap).sort((a, b) => b[1] - a[1]).slice(0, 4);
      const colors = ['orange', 'cyan', 'pink', 'green'];
      this.mostBookedCategories = sortedCats.map((c, i) => ({
        name: c[0],
        bookings: c[1].toString(),
        revenue: '%' + Math.round((c[1] / totalCats) * 100),
        progress: Math.round((c[1] / totalCats) * 100),
        color: colors[i % colors.length],
      }));

      if (notifs.length > 0) {
        this.notifications = notifs.slice(0, 3).map((n: any) => {
          let icon = 'pi-bell';
          let color = 'blue';
          if (n.type === 'booking_created' || n.type === 'booking_update') {
            icon = 'pi-check';
            color = 'green';
          }
          if (n.type === 'payment_success') {
            icon = 'pi-credit-card';
            color = 'cyan';
          }

          return { text: n.title, amount: n.message, icon, color };
        });
      } else {
        this.notifications = [];
      }

      this.livelyChartData = this.buildWeeklyActivityChart(bookings);
      this.chartData = this.buildSpendingCategoriesDoughnut(completedBookings);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
      this.chartData = this.emptyDoughnut();
      this.livelyChartData = this.emptyWeekly();
    }
  }

  /** Last 8 weeks: completed spend vs booking volume */
  private buildWeeklyActivityChart(bookings: any[]): any {
    const n = 8;
    const labels: string[] = [];
    const anchor = new Date();
    anchor.setHours(12, 0, 0, 0);
    const oldest = new Date(anchor);
    oldest.setDate(oldest.getDate() - (n - 1) * 7);

    const spendByWeek = new Array(n).fill(0);
    const bookingsByWeek = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      const labelDate = new Date(oldest);
      labelDate.setDate(labelDate.getDate() + i * 7);
      labels.push(
        `${labelDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      );

      const weekEnd = new Date(labelDate);
      weekEnd.setDate(weekEnd.getDate() + 7);

      for (const b of bookings) {
        const d = new Date(b.date);
        if (d >= labelDate && d < weekEnd) {
          bookingsByWeek[i] += 1;
          const ns = normStatus(b.status);
          if (ns === 'COMPLETED' || ns === 'COMPLETE') {
            spendByWeek[i] += Number(b.totalAmount) || 0;
          }
        }
      }
    }

    return {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Completed spend ($)',
          data: spendByWeek.map((x) => Math.round(x * 100) / 100),
          backgroundColor: '#14b8a6',
          borderRadius: 4,
        },
        {
          type: 'bar',
          label: 'Bookings in week',
          data: bookingsByWeek,
          backgroundColor: '#c7d2fe',
          borderRadius: 4,
        },
      ],
    };
  }

  private emptyWeekly(): any {
    return {
      labels: ['—'],
      datasets: [
        { type: 'bar', label: 'Completed spend ($)', data: [0], backgroundColor: '#14b8a6' },
        { type: 'bar', label: 'Bookings in week', data: [0], backgroundColor: '#c7d2fe' },
      ],
    };
  }

  /** Doughnut from completed bookings by category */
  private buildSpendingCategoriesDoughnut(completedBookings: any[]): any {
    const byCat = new Map<string, number>();
    for (const b of completedBookings) {
      const cat = bookingCategoryLabel(b);
      byCat.set(cat, (byCat.get(cat) || 0) + Number(b.totalAmount) || 0);
    }

    const entries = [...byCat.entries()].filter(([, v]) => v > 0);
    if (!entries.length) return this.emptyDoughnut();

    const palette = ['#008FFB', '#00E396', '#FEB019', '#775DD0'];
    const labels = entries.map(([k]) => k);
    const data = entries.map(([, v]) => Math.round(v * 100) / 100);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: labels.map((_, i) => palette[i % palette.length]),
        },
      ],
    };
  }

  private emptyDoughnut(): any {
    return {
      labels: ['No spending data yet'],
      datasets: [{ data: [1], backgroundColor: ['#e2e8f0'] }],
    };
  }

  initChartOptionsOnly(): void {
    this.chartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: { mode: 'index', intersect: false },
        legend: { position: 'bottom', labels: { color: '#475569', usePointStyle: true, padding: 20 } },
      },
    };

    this.livelyChartOptions = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltip: { mode: 'index', intersect: false },
        legend: { position: 'bottom', labels: { color: '#475569', usePointStyle: true, padding: 20 } },
      },
      scales: {
        x: { stacked: false, ticks: { color: '#64748b' }, grid: { color: 'transparent', borderColor: 'transparent' } },
        y: {
          stacked: false,
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0', borderColor: 'transparent', drawTicks: false },
          beginAtZero: true,
        },
      },
    };
  }
}
