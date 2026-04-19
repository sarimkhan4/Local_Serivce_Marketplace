import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-provider-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, ProgressBarModule, MenuModule, ChartModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class ProviderDashboard {
  chartData: object = {};
  chartOptions: object = {};

  constructor() {
    this.initChart();
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
          labels: {
            color: '#64748b',
            boxWidth: 12,
            boxHeight: 12,
            padding: 16,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: '#64748b' },
          grid: { display: false },
        },
        y: {
          ticks: { color: '#64748b' },
          grid: { color: '#e2e8f0' },
          beginAtZero: true,
        },
        y1: {
          ticks: { color: '#94a3b8' },
          grid: { display: false },
          position: 'right',
          beginAtZero: true,
        },
      },
    };
  }

  menuItems: MenuItem[] = [
    { label: 'View Details', icon: 'pi pi-search' },
    { label: 'Update', icon: 'pi pi-refresh' },
    { label: 'Delete', icon: 'pi pi-trash' }
  ];

  stats = [
    { label: 'Pending Jobs', value: '152', icon: 'pi pi-shopping-cart', color: 'blue', detailValue: '24 new', detailText: 'since last visit' },
    { label: 'Revenue', value: '$2,100', icon: 'pi pi-dollar', color: 'orange', detailValue: '%52+', detailText: 'since last week' },
    { label: 'Total Clients', value: '28441', icon: 'pi pi-users', color: 'cyan', detailValue: '520', detailText: 'newly registered' },
    { label: 'Reviews', value: '152 Unread', icon: 'pi pi-comment', color: 'purple', detailValue: '85', detailText: 'responded' }
  ];

  appointments = [
    { id: '1', client: 'Michael R.', service: 'TV Mounting', amount: '$65.00', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png' },
    { id: '2', client: 'Sarah Jenkins', service: 'Home Theater Setup', amount: '$72.00', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png' },
    { id: '3', client: 'David Chen', service: 'Shelf Installation', amount: '$79.00', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png' },
    { id: '4', client: 'Emma Croft', service: 'Desk Assembly', amount: '$29.00', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png' },
    { id: '5', client: 'Olivia Harper', service: 'Mirror Mounting', amount: '$15.00', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/xuxuefeng.png' }
  ];

  popularServices = [
    { name: 'TV Mounting', category: 'Accessories', revenue: '%50', progress: 50, color: 'orange' },
    { name: 'Shelf Installation', category: 'Accessories', revenue: '%16', progress: 16, color: 'cyan' },
    { name: 'Home Theater Setup', category: 'Accessories', revenue: '%67', progress: 67, color: 'pink' },
    { name: 'Yard Cleanup', category: 'Office', revenue: '%35', progress: 35, color: 'green' },
    { name: 'Drywall Repair', category: 'Accessories', revenue: '%75', progress: 75, color: 'purple' },
    { name: 'Basic Plumbing', category: 'Clothing', revenue: '%40', progress: 40, color: 'teal' }
  ];
  
  notifications = [
    { text: 'Richard Jones has purchased a TV Mounting for', amount: '$79.00', icon: 'pi-dollar', color: 'blue' },
    { text: 'Your request for withdrawal of', amount: '$2500.00', suffix: 'has been initiated.', icon: 'pi-download', color: 'orange' },
    { text: 'Keyser Wick has purchased a Shelf Installation for', amount: '$59.00', icon: 'pi-dollar', color: 'blue' },
    { text: 'Jane Davis has posted a new review about your service.', amount: '', icon: 'pi-question', color: 'pink' }
  ]
}
