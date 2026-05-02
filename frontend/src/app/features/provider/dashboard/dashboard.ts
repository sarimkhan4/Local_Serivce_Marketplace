import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth';
import { lastValueFrom } from 'rxjs';

function normStatus(s: unknown): string {
  return String(s ?? '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_');
}

function serviceLabelFromBooking(b: any): string {
  const j = b.services?.[0];
  const svc = j?.service ?? j;
  return svc?.name ?? 'General Service';
}

function categoryLabelFromBooking(b: any): string {
  const j = b.services?.[0];
  const svc = j?.service ?? j;
  const cat = svc?.category;
  return cat?.categoryName ?? cat?.name ?? 'General';
}

@Component({
  selector: 'app-provider-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, ProgressBarModule, MenuModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class ProviderDashboard implements OnInit {
  chartData: object = {};
  chartOptions: object = {};

  menuItems: MenuItem[] = [
    { label: 'View Details', icon: 'pi pi-search' },
    { label: 'Update', icon: 'pi pi-refresh' },
    { label: 'Delete', icon: 'pi pi-trash' },
  ];

  stats: any[] = [];
  appointments: any[] = [];
  popularServices: any[] = [];
  notifications: any[] = [];

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  constructor() {
    this.initChartOptions();
  }

  async ngOnInit() {
    await this.loadDashboardData();
  }

  async loadDashboardData() {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    try {
      const [bookingsRaw, notifsRaw]: any = await Promise.all([
        lastValueFrom(this.apiService.getProviderBookings(userId)),
        lastValueFrom(this.apiService.getUserNotifications(userId)),
      ]);

      const bookings = bookingsRaw || [];
      const notifs = notifsRaw || [];

      this.appointments = bookings
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map((b: any) => ({
          id: b.bookingId,
          client: b.customer?.name || 'Unknown Client',
          service: serviceLabelFromBooking(b),
          amount: '$' + Number(b.totalAmount).toFixed(2),
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(b.customer?.name || 'C')}&background=random`,
        }));

      const pendingBookings = bookings.filter((b: any) =>
        ['PENDING', 'CONFIRMED', 'IN_PROGRESS'].includes(normStatus(b.status)),
      );
      const completedBookings = bookings.filter(
        (b: any) => normStatus(b.status) === 'COMPLETED' || normStatus(b.status) === 'COMPLETE',
      );
      const totalRevenue = completedBookings.reduce((sum: number, b: any) => sum + Number(b.totalAmount), 0);
      const uniqueClients = new Set(bookings.map((b: any) => b.customer?.userId)).size;

      this.stats = [
        {
          label: 'Pending Jobs',
          value: pendingBookings.length.toString(),
          icon: 'pi pi-shopping-cart',
          color: 'blue',
          detailValue: 'Active',
          detailText: 'remaining',
        },
        {
          label: 'Revenue',
          value: '$' + totalRevenue.toFixed(0),
          icon: 'pi pi-dollar',
          color: 'orange',
          detailValue: 'Earned',
          detailText: 'past completed',
        },
        {
          label: 'Total Clients',
          value: uniqueClients.toString(),
          icon: 'pi pi-users',
          color: 'cyan',
          detailValue: 'Met',
          detailText: 'unique individuals',
        },
        {
          label: 'Jobs Done',
          value: completedBookings.length.toString(),
          icon: 'pi pi-check',
          color: 'purple',
          detailValue: 'Past',
          detailText: 'successful jobs',
        },
      ];

      const serviceMap: { [key: string]: { category: string; count: number } } = {};
      completedBookings.forEach((b: any) => {
        const name = serviceLabelFromBooking(b);
        if (name && name !== 'General Service') {
          serviceMap[name] = {
            category: categoryLabelFromBooking(b),
            count: (serviceMap[name]?.count || 0) + 1,
          };
        }
      });

      const totalSrvs = Math.max(1, completedBookings.length);
      const sortedSrvs = Object.entries(serviceMap).sort((a, b) => b[1].count - a[1].count).slice(0, 6);
      const colors = ['orange', 'cyan', 'pink', 'green', 'purple', 'teal'];

      this.popularServices = sortedSrvs.map((s, i) => ({
        name: s[0],
        category: s[1].category,
        revenue: '%' + Math.round((s[1].count / totalSrvs) * 100),
        progress: Math.round((s[1].count / totalSrvs) * 100),
        color: colors[i % colors.length],
      }));

      if (notifs.length > 0) {
        this.notifications = notifs.slice(0, 4).map((n: any) => {
          let icon = 'pi-bell';
          let color = 'blue';
          if (n.type === 'booking_created') {
            icon = 'pi-check';
            color = 'green';
          }
          if (n.type === 'payment_success') {
            icon = 'pi-dollar';
            color = 'orange';
          }

          return { text: n.title, amount: n.message, icon, color };
        });
      } else {
        this.notifications = [];
      }

      this.chartData = this.buildRevenueBookingChart(bookings);
    } catch (e) {
      console.error('Failed to load dashboard data', e);
      this.chartData = this.emptyChart();
    }
  }

  /** Last 6 months: completed revenue + booking counts per month */
  private buildRevenueBookingChart(bookings: any[]): object {
    const keys: string[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    }
    const labels = keys.map((k) => {
      const [y, m] = k.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[Number(m) - 1]} ${y}`;
    });

    const revenue = keys.map(() => 0);
    const counts = keys.map(() => 0);

    for (const b of bookings) {
      const ns = normStatus(b.status);
      if (ns !== 'COMPLETED' && ns !== 'COMPLETE') continue;
      const d = new Date(b.date);
      const mk = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const idx = keys.indexOf(mk);
      if (idx < 0) continue;
      revenue[idx] += Number(b.totalAmount) || 0;
      counts[idx] += 1;
    }

    return {
      labels,
      datasets: [
        {
          label: 'Revenue ($)',
          data: revenue.map((x) => Math.round(x * 100) / 100),
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.12)',
          tension: 0.35,
          fill: true,
          pointRadius: 3,
          yAxisID: 'y',
        },
        {
          label: 'Completed bookings (count)',
          data: counts,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.08)',
          tension: 0.25,
          fill: false,
          pointRadius: 2,
          yAxisID: 'y1',
        },
      ],
    };
  }

  private emptyChart(): object {
    return {
      labels: ['—'],
      datasets: [
        {
          label: 'Revenue ($)',
          data: [0],
          borderColor: '#0d9488',
          yAxisID: 'y',
        },
        {
          label: 'Completed bookings (count)',
          data: [0],
          borderColor: '#6366f1',
          yAxisID: 'y1',
        },
      ],
    };
  }

  initChartOptions(): void {
    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#64748b', boxWidth: 12, boxHeight: 12, padding: 16 },
        },
      },
      scales: {
        x: { ticks: { color: '#64748b' }, grid: { display: false } },
        y: {
          type: 'linear',
          position: 'left',
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0' },
          beginAtZero: true,
        },
        y1: {
          type: 'linear',
          position: 'right',
          ticks: { color: '#94a3b8' },
          grid: { drawOnChartArea: false },
          beginAtZero: true,
        },
      },
    };
  }
}
