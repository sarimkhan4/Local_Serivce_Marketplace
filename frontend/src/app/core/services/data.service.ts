import { Injectable, signal, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { ApiService } from './api.service';

export interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  companyName: string;
  category: string;
  rating: number;
  reviews: number;
  bio: string;
}

export interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  price: number;
}

export interface ServiceOffered {
  id: string;
  providerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface CatalogService {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  providers: CatalogProvider[];
}

export interface CatalogProvider {
  id: string;
  name: string;
  companyName: string;
  rating: number;
  reviews: number;
  yearsExperience: number;
  price: number;
  bio: string;
}

export interface CartItem {
  service: CatalogService;
  provider: CatalogProvider;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiService = inject(ApiService);

  cart         = signal<CartItem[]>([]);
  savedPros    = signal<Provider[]>([]);
  myBookings   = signal<Booking[]>([]);
  myServices   = signal<ServiceOffered[]>([]);

  categories: Category[]         = [];
  catalogServices: CatalogService[] = [];

  constructor() {
    this.loadCategories();
    this.loadCatalogServices();
  }

  async loadCategories() {
    try {
      const data: any = await lastValueFrom(this.apiService.getCategories());
      this.categories = data.map((c: any) => ({
        id:          c.categoryId.toString(),
        name:        c.categoryName ?? c.name,
        icon:        'pi pi-folder',
        description: c.description ?? ''
      }));
    } catch (err) {
      console.error('[DataService] Failed to load categories', err);
    }
  }

  async loadCatalogServices() {
    try {
      const data: any = await lastValueFrom(this.apiService.getServices());
      this.catalogServices = data.map((s: any) => ({
        id:           s.serviceId.toString(),
        title:        s.name,
        description:  s.description,
        categoryId:   s.category?.categoryId?.toString() || '0',
        categoryName: s.category?.categoryName ?? s.category?.name ?? 'General',
        basePrice:    s.basePrice || 0,
        providers:    []   // populate via getProviders() if backend supports eager join
      }));
    } catch (err) {
      console.error('[DataService] Failed to load services', err);
    }
  }

  addToCart(item: CartItem)       { this.cart.update(c => [...c, item]); }
  removeFromCart(index: number)   {
    this.cart.update(c => {
      const copy = [...c];
      copy.splice(index, 1);
      return copy;
    });
  }
  clearCart() { this.cart.set([]); }

  savePro(pro: Provider) {
    if (!this.savedPros().find(p => p.id === pro.id)) {
      this.savedPros.update(pros => [...pros, pro]);
    }
  }
  unsavePro(proId: string)           { this.savedPros.update(pros => pros.filter(p => p.id !== proId)); }
  addService(s: ServiceOffered)      { this.myServices.update(list => [...list, s]); }
  updateService(s: ServiceOffered)   { this.myServices.update(list => list.map(x => x.id === s.id ? s : x)); }
  getServicesByCategory(id: string)  { return this.catalogServices.filter(s => s.categoryId === id); }
  getServiceById(id: string)         { return this.catalogServices.find(s => s.id === id); }

  async createBooking(_serviceName: string, _providerName: string, _date: string, _price: number) {
    /* Real bookings use checkout: customer, provider, address, services, payment. */
  }
}
