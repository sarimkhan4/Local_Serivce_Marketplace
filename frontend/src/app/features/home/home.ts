import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Services
import { AuthService } from '../../core/services/auth';
import { DataService } from '../../core/services/data.service';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';

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
    CardModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  selectedCategoryId: string = 'cat-1';

  constructor(private authService: AuthService, private router: Router, private dataService: DataService) {}

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

  categories: Category[] = [
    {
      id: 'cat-1',
      name: 'Assembly',
      icon: 'pi-cog',
      services: [
        { id: 's1', name: 'IKEA Furniture Assembly', startingPrice: 45, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's2', name: 'General Furniture Assembly', startingPrice: 50, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's3', name: 'Gym Equipment Assembly', startingPrice: 85, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's4', name: 'Desk & Office Assembly', startingPrice: 40, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's5', name: 'Bed Frame Assembly', startingPrice: 55, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's6', name: 'Grill Assembly', startingPrice: 60, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's7', name: 'Patio Furniture Assembly', startingPrice: 70, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's8', name: 'Toy & Playground Assembly', startingPrice: 90, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's9', name: 'Shed Assembly', startingPrice: 150, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's10', name: 'Bookshelf Assembly', startingPrice: 35, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' }
      ]
    },
    {
      id: 'cat-2',
      name: 'Mounting',
      icon: 'pi-desktop',
      services: [
        { id: 's11', name: 'TV Mounting', startingPrice: 70, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's12', name: 'Art & Picture Hanging', startingPrice: 40, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's13', name: 'Shelving Installation', startingPrice: 65, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's14', name: 'Window Blind Installation', startingPrice: 50, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's15', name: 'Mirror Mounting', startingPrice: 55, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's16', name: 'Curtain Rod Installation', startingPrice: 45, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's17', name: 'Projector Mounting', startingPrice: 90, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's18', name: 'Whiteboard Hanging', startingPrice: 40, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' }
      ]
    },
    {
      id: 'cat-3',
      name: 'Moving',
      icon: 'pi-truck',
      services: [
        { id: 's19', name: 'General Help Moving', startingPrice: 80, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's20', name: 'Truck Assisted Moving', startingPrice: 150, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's21', name: 'Heavy Lifting', startingPrice: 65, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's22', name: 'Junk Removal', startingPrice: 90, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's23', name: 'Packing Services', startingPrice: 45, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's24', name: 'Unpacking Services', startingPrice: 40, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's25', name: 'Furniture Rearrangement', startingPrice: 55, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's26', name: 'In-Home Moves', startingPrice: 50, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' }
      ]
    },
    {
      id: 'cat-4',
      name: 'Cleaning',
      icon: 'pi-sparkles',
      services: [
        { id: 's27', name: 'Standard House Cleaning', startingPrice: 90, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's28', name: 'Deep Cleaning', startingPrice: 140, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's29', name: 'Move-In/Out Cleaning', startingPrice: 160, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's30', name: 'Office Cleaning', startingPrice: 110, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's31', name: 'Carpet Cleaning', startingPrice: 85, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's32', name: 'Window Cleaning', startingPrice: 65, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's33', name: 'Post-Construction Finish', startingPrice: 200, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's34', name: 'Fridge & Appliance Cleaning', startingPrice: 40, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' }
      ]
    },
    {
      id: 'cat-5',
      name: 'Outdoor Help',
      icon: 'pi-compass',
      services: [
        { id: 's35', name: 'Lawn Mowing & Care', startingPrice: 45, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's36', name: 'Yard Cleanup', startingPrice: 80, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's37', name: 'Snow Removal', startingPrice: 50, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's38', name: 'Gutter Cleaning', startingPrice: 95, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's39', name: 'Pressure Washing', startingPrice: 120, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's40', name: 'Pool Cleaning', startingPrice: 75, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's41', name: 'Fence Repair', startingPrice: 110, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's42', name: 'Tree Trimming', startingPrice: 150, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' }
      ]
    },
    {
      id: 'cat-6',
      name: 'Home Repairs',
      icon: 'pi-wrench',
      services: [
        { id: 's43', name: 'Drywall Repair', startingPrice: 85, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's44', name: 'Door Lock Fixing', startingPrice: 60, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's45', name: 'Basic Plumbing Repair', startingPrice: 95, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's46', name: 'Basic Electrical Repair', startingPrice: 105, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's47', name: 'Appliance Troubleshooting', startingPrice: 75, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's48', name: 'Tile & Grout Replacement', startingPrice: 130, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's49', name: 'Squeaky Floor Repair', startingPrice: 80, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's50', name: 'Caulking & Sealing', startingPrice: 50, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's51', name: 'Cabinet Repair', startingPrice: 90, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' }
      ]
    },
    {
      id: 'cat-7',
      name: 'Painting',
      icon: 'pi-palette',
      services: [
        { id: 's52', name: 'Interior Room Painting', startingPrice: 200, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's53', name: 'Exterior Painting', startingPrice: 450, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's54', name: 'Trim & Baseboard Painting', startingPrice: 85, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's55', name: 'Wallpaper Removal', startingPrice: 120, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's56', name: 'Cabinet Painting', startingPrice: 300, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's57', name: 'Deck & Fence Staining', startingPrice: 250, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' },
        { id: 's58', name: 'Ceiling Painting', startingPrice: 150, image: 'https://primefaces.org/cdn/primeng/images/card-ng.jpg' }
      ]
    }
  ];
}
