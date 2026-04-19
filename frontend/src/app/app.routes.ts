import { Routes } from '@angular/router';
import { PublicLayout } from './layout/public-layout/public-layout';
import { CustomerLayout } from './layout/customer-layout/customer-layout';
import { ProviderLayout } from './layout/provider-layout/provider-layout';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', loadComponent: () => import('./features/home/home').then(m => m.Home) },
      { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.Login) },
      { path: 'signup', loadComponent: () => import('./features/auth/signup/signup').then(m => m.Signup) }
    ]
  },
  {
    path: 'app/customer',
    component: CustomerLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/customer/dashboard/dashboard').then(m => m.CustomerDashboard) },
      { path: 'services', loadComponent: () => import('./features/customer/browse/browse').then(m => m.BrowseServices) },
      { path: 'services/:id', loadComponent: () => import('./features/customer/service-detail/service-detail').then(m => m.ServiceDetail) },
      { path: 'checkout', loadComponent: () => import('./features/customer/checkout/checkout').then(m => m.Checkout) },
      { path: 'bookings', loadComponent: () => import('./features/customer/bookings/bookings').then(m => m.Bookings) },
      { path: 'saved', loadComponent: () => import('./features/customer/saved/saved').then(m => m.SavedPros) },
      { path: 'notifications', loadComponent: () => import('./features/customer/notifications/notifications').then(m => m.CustomerNotifications) },
      { path: 'settings', loadComponent: () => import('./features/customer/settings/settings').then(m => m.CustomerSettings) }
    ]
  },
  {
    path: 'app/provider',
    component: ProviderLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/provider/dashboard/dashboard').then(m => m.ProviderDashboard) },
      { path: 'services', loadComponent: () => import('./features/provider/services/services').then(m => m.Services) },
      { path: 'schedule', loadComponent: () => import('./features/provider/schedule/schedule').then(m => m.Schedule) },
      { path: 'earnings', loadComponent: () => import('./features/provider/earnings/earnings').then(m => m.Earnings) },
      { path: 'availability', loadComponent: () => import('./features/provider/availability/availability').then(m => m.Availability) },
      { path: 'reviews', loadComponent: () => import('./features/provider/reviews/reviews').then(m => m.Reviews) },
      { path: 'notifications', loadComponent: () => import('./features/provider/notifications/notifications').then(m => m.ProviderNotifications) },
      { path: 'settings', loadComponent: () => import('./features/provider/settings/settings').then(m => m.ProviderSettings) }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./layout/notfound/notfound').then(m => m.Notfound),
    title: 'Page Not Found'
  }
];
