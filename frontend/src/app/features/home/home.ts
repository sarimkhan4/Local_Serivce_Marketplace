import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { AuthService } from '../../core/services/auth';
import { DataService } from '../../core/services/data.service';
import { ApiService } from '../../core/services/api.service';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

interface ServiceItem {
  id: string;
  name: string;
  startingPrice: number;
  image: string
}

interface Category {
  id: string;
  name: string;
  icon: string;
  services: ServiceItem[];
}

interface Testimonial {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  serviceReceived: string;
  avatarInitials: string;
}

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    ButtonModule,
    CarouselModule,
    IconField,
    InputIcon,
    InputTextModule,
    TabsModule,
    CardModule,
    SkeletonModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  selectedCategoryId: string = '';
  loadingCategories = signal(true);
  categories: any[] = [];

  apiService = inject(ApiService);

  constructor(private authService: AuthService, private router: Router, private dataService: DataService) {}
  
  ngOnInit() {
    this.apiService.getCategories().subscribe((cats: any) => {
      this.apiService.getServices().subscribe((srvs: any) => {
        const dynamicCategories = cats.map((cat: any) => {
           return {
             id: cat.categoryId,
             name: cat.categoryName,
             icon: 'pi-cog',
             services: srvs.filter((s:any) => s.category.categoryId === cat.categoryId).map((s:any) => ({
               id: s.serviceId,
               name: s.name,
               startingPrice: 50,
               image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg'
             }))
           }
        });
        this.categories = dynamicCategories;
        if(this.categories.length > 0) {
          this.selectedCategoryId = this.categories[0].id;
        }
        this.loadingCategories.set(false);
      });
    });
  }

  onSaveService(service: any, categoryName: string) {
    if (this.authService.isAuthenticated()) {
      this.dataService.savePro({
        id: service.id,
        firstName: service.name,
        lastName: '',
        companyName: 'LSM Local Provider',
        category: categoryName,
        rating: 4.5,
        reviews: 10,
        bio: 'Saved from Home page.'
      });
      this.router.navigate(['/app/customer/saved']);
    } else {
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'save', service, categoryName }));
      this.router.navigate(['/login']);
    }
  }

  onBookService(service: any) {
    if (this.authService.isAuthenticated()) {
      this.dataService.createBooking(service.name, 'LSM Local Provider', new Date().toISOString(), service.startingPrice);
      this.router.navigate(['/app/customer/bookings']);
    } else {
      localStorage.setItem('pendingAction', JSON.stringify({ type: 'book', service }));
      this.router.navigate(['/login']);
    }
  }

  trustedBrands = [
    { name: 'LocalBuilders', icon: 'pi-building' },
    { name: 'UrbanCare', icon: 'pi-heart' },
    { name: 'ProFix', icon: 'pi-wrench' },
    { name: 'CleanSweep', icon: 'pi-sparkles' },
    { name: 'EliteTutors', icon: 'pi-book' },
    { name: 'AutoMobileCare', icon: 'pi-car' },
    { name: 'GreenThumb', icon: 'pi-chart-line' }
  ];

  testimonials: Testimonial[] = [
    {
      id: 'rev-1',
      customerName: 'Sarah Jenkins',
      rating: 5,
      comment: 'Found an incredible plumber within minutes. They arrived the same day and fixed the leak perfectly. The whole ecosystem is seamless.',
      serviceReceived: 'Basic Plumbing Repair',
      avatarInitials: 'SJ'
    },
    {
      id: 'rev-2',
      customerName: 'Marcus T.',
      rating: 5,
      comment: 'I use this platform for all my cleaning requirements. The providers are vetted, and the payment and booking interface is incredibly easy.',
      serviceReceived: 'Deep Cleaning',
      avatarInitials: 'MT'
    },
    {
      id: 'rev-3',
      customerName: 'Elena Rostova',
      rating: 4,
      comment: 'Excellent TV Mounting! Fast, efficient, and exactly what I needed. Will definitely rebook for my next assembly project.',
      serviceReceived: 'TV Mounting',
      avatarInitials: 'ER'
    },
    {
      id: 'rev-4',
      customerName: 'David Chen',
      rating: 5,
      comment: 'Moved my entire 3-bedroom house in a single day. The truck assisted moving team was absolutely phenomenal.',
      serviceReceived: 'Truck Assisted Moving',
      avatarInitials: 'DC'
    }
  ];

}
