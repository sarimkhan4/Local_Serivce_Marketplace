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
    { label: 'Delete', icon: 'pi pi-trash' }
  ];

  stats: any[] = [];
  appointments: any[] = [];
  popularServices: any[] = [];
  notifications: any[] = [];

  private apiService = inject(ApiService);
  private authService = inject(AuthService);

  constructor() {
    this.initChart();
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
        lastValueFrom(this.apiService.getUserNotifications(userId))
      ]);
      
      const bookings = bookingsRaw || [];
      const notifs = notifsRaw || [];

      // APPOINTMENTS (Latest 5 jobs)
      this.appointments = bookings
        .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5)
        .map((b: any) => ({
          id: b.bookingId,
          client: b.customer?.name || 'Unknown Client',
          service: b.services?.length ? b.services[0].name : 'General Service',
          amount: '$' + Number(b.totalAmount).toFixed(2),
          image: ''
        }));

      // STATS
      const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING' || b.status === 'CONFIRMED');
      const completedBookings = bookings.filter((b: any) => b.status === 'COMPLETED');
      const totalRevenue = completedBookings.reduce((sum: number, b: any) => sum + Number(b.totalAmount), 0);
      const uniqueClients = new Set(bookings.map((b: any) => b.customer?.userId)).size;

      this.stats = [
        { label: 'Pending Jobs', value: pendingBookings.length.toString(), icon: 'pi pi-shopping-cart', color: 'blue', detailValue: 'Active', detailText: 'remaining' },
        { label: 'Revenue', value: '$' + totalRevenue.toFixed(0), icon: 'pi pi-dollar', color: 'orange', detailValue: 'Earned', detailText: 'past completed' },
        { label: 'Total Clients', value: uniqueClients.toString(), icon: 'pi pi-users', color: 'cyan', detailValue: 'Met', detailText: 'unique individuals' },
        { label: 'Jobs Done', value: completedBookings.length.toString(), icon: 'pi pi-check', color: 'purple', detailValue: 'Past', detailText: 'successful jobs' }
      ];

      // POPULAR SERVICES (Count frequencies)
      const serviceMap: { [key: string]: { category: string, count: number } } = {};
      completedBookings.forEach((b: any) => {
         const srv = b.services?.length ? b.services[0] : null;
         if (srv) {
           serviceMap[srv.name] = { 
             category: srv.category ? srv.category.categoryName : 'General',
             count: (serviceMap[srv.name]?.count || 0) + 1 
           };
         }
      });
      
      const totalSrvs = Math.max(1, completedBookings.length);
      const sortedSrvs = Object.entries(serviceMap).sort((a,b) => b[1].count - a[1].count).slice(0, 6);
      const colors = ['orange', 'cyan', 'pink', 'green', 'purple', 'teal'];
      
      this.popularServices = sortedSrvs.map((s, i) => ({
        name: s[0],
        category: s[1].category,
        revenue: '%' + Math.round((s[1].count/totalSrvs)*100),
        progress: Math.round((s[1].count/totalSrvs)*100),
        color: colors[i % colors.length]
      }));

      // NOTIFICATIONS
      if (notifs.length > 0) {
        this.notifications = notifs.slice(0, 4).map((n: any) => {
           let icon = 'pi-bell';
           let color = 'blue';
           if (n.type === 'booking_created') { icon = 'pi-check'; color = 'green'; }
           if (n.type === 'payment_success') { icon = 'pi-dollar'; color = 'orange'; }
           
           return { text: n.title, amount: n.message, icon, color };
        });
      } else {
        this.notifications = [];
      }

    } catch (e) {
      console.error('Failed to load dashboard data', e);
    }
  }

  initChart(): void {
    this.chartData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          type: 'line',
          label: 'Revenue',
          data: [1200, 1800, 2100, 2650, 2300, 2920],
          borderColor: '#0d9488',
          backgroundColor: 'rgba(13, 148, 136, 0.14)',
          tension: 0.35,
          fill: true,
          pointRadius: 3,
        },
        {
          type: 'bar',
          label: 'Bookings',
          data: [9, 14, 17, 21, 18, 24],
          yAxisID: 'y1',
          backgroundColor: '#cbd5e1',
          borderColor: '#cbd5e1',
          borderWidth: 1,
          barThickness: 14,
        },
      ],
    };

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
        y: { ticks: { color: '#64748b' }, grid: { color: '#e2e8f0' }, beginAtZero: true },
        y1: { ticks: { color: '#94a3b8' }, grid: { display: false }, position: 'right', beginAtZero: true },
      },
    };
  }
}
