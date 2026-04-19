import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart'; 
@Component({
  selector: 'app-customer-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, ChartModule, ProgressBarModule, MenuModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class CustomerDashboard implements OnInit{
  chartData: any;
  chartOptions: any;
  menuItems: MenuItem[] = [
    { label: 'View Details', icon: 'pi pi-search' },
    { label: 'Cancel', icon: 'pi pi-times', styleClass: 'text-red-500' },
    { label: 'Contact Provider', icon: 'pi pi-envelope' }
  ];

  ngOnInit() {
    this.initChart();
  }

  initChart() {
    // 1. Define the Data & Colors matching your SVG perfectly
    this.chartData = {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        datasets: [
            {
                type: 'bar',
                label: 'Subscriptions',
                backgroundColor: '#4f83cc', // Dark blue
                data: [9000, 15000, 20000, 9000],
                barThickness: 32,
                borderRadius: 2
            },
            {
                type: 'bar',
                label: 'Advertising',
                backgroundColor: '#7aabdd', // Mid blue
                data: [2100, 8400, 2400, 7500],
                barThickness: 32
            },
            {
                type: 'bar',
                label: 'Affiliate',
                backgroundColor: '#a9c8ed', // Light blue
                data: [4100, 2600, 3400, 7400],
                borderRadius: { topLeft: 4, topRight: 4, bottomLeft: 0, bottomRight: 0 },
                borderSkipped: false,
                barThickness: 32
            }
        ]
    };

    // 2. Configure the styling, grid lines, and interactive tooltips
    this.chartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltip: {
                mode: 'index',      // Hovering over a column shows all 3 data points
                intersect: false    // Triggers tooltip even if not hovering directly on the color
            },
            legend: {
                position: 'bottom', // Moves legend to bottom like your design
                labels: {
                    color: '#475569',
                    usePointStyle: true,
                    padding: 20
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: { color: '#64748b' },
                grid: { color: 'transparent', borderColor: 'transparent' }
            },
            y: {
                stacked: true,
                ticks: { color: '#64748b' },
                grid: { 
                  color: '#e2e8f0', 
                  borderColor: 'transparent', 
                  drawTicks: false 
                }
            }
        }
    };
  }

  stats = [
    { label: 'Active Bookings', value: '3', icon: 'pi pi-calendar-plus', color: 'blue', detailValue: '1 new', detailText: 'upcoming today' },
    { label: 'Completed Services', value: '28', icon: 'pi pi-check-circle', color: 'green', detailValue: '%15+', detailText: 'since last month' },
    { label: 'Total Spent', value: '$1,850', icon: 'pi pi-wallet', color: 'orange', detailValue: '$320', detailText: 'this month' },
    { label: 'Saved Pros', value: '4', icon: 'pi pi-heart-fill', color: 'pink', detailValue: '1', detailText: 'newly saved' }
  ];

  appointments = [
    { id: '1', provider: 'FixIt Pro Group', service: 'TV Mounting', status: 'Pending', amount: '$65.00', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png' },
    { id: '2', provider: 'Ace Handyman', service: 'Home Theater Setup', status: 'Confirmed', amount: '$72.00', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png' },
    { id: '3', provider: 'Star Assembly', service: 'Shelf Installation', status: 'Completed', amount: '$79.00', image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png' }
  ];

  mostBookedCategories = [
    { name: 'Home Maintenance', bookings: '12', revenue: '%50', progress: 50, color: 'orange' },
    { name: 'Appliance Repair', bookings: '8', revenue: '%30', progress: 30, color: 'cyan' },
    { name: 'Outdoor & Yard', bookings: '5', revenue: '%15', progress: 15, color: 'pink' },
    { name: 'Cleaning Services', bookings: '3', revenue: '%5', progress: 5, color: 'green' }
  ];
  
  notifications = [
    { text: 'Your booking for TV Mounting was confirmed by', amount: 'FixIt Pro Group.', icon: 'pi-check', color: 'green' },
    { text: 'A payment of', amount: '$79.00', suffix: 'has been processed successfully.', icon: 'pi-credit-card', color: 'blue' },
    { text: 'Please leave a review for your recent service with', amount: 'Star Assembly.', icon: 'pi-star', color: 'orange' }
  ]
}
