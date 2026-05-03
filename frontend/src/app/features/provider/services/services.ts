import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth';
import { ApiService } from '../../../core/services/api.service';

export interface ProviderServiceViewModel {
  catalogServiceId?: number;
  title: string;
  description: string;
  categoryName: string;
  isOffered: boolean;
  providerPrice: number;
}

@Component({
  selector: 'app-provider-services',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, 
    InputNumberModule, CheckboxModule, TagModule, ToastModule,
    DialogModule, SelectModule, InputTextModule, TextareaModule,
    PaginatorModule, ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  private http = inject(HttpClient);
  private titleService = inject(Title);
  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private apiService = inject(ApiService);

  // Paginated data for the current page
  allViewModels: ProviderServiceViewModel[] = [];
  categories: any[] = [];

  // Pagination state
  currentPage = 1;
  pageSize = 15;
  totalRecords = 0;
  totalPages = 0;
  loading = false;

  // Search
  searchTerm = '';
  private searchTimeout: any = null;

  // Provider's existing services (loaded once for matching)
  private myServicesMap = new Map<number, any>();

  // Modal State
  displayNewServiceDialog = false;
  newServiceForm = {
    name: '',
    description: '',
    categoryId: null as number | null,
    price: 0
  };

  constructor() {
    this.titleService.setTitle('Servicio PRO | Service Configuration');
  }

  ngOnInit() {
    this.loadInitialData();
  }

  /**
   * Load provider services (once) and categories (once), then load paginated catalog
   */
  async loadInitialData() {
    try {
      const user = this.authService.currentUser();
      if (!user) return;

      this.loading = true;

      // Load provider's existing services and categories in parallel
      const [myServices, categories] = await Promise.all([
        lastValueFrom(this.http.get<any[]>(`${environment.apiUrl}/services/provider/${user.id}`)),
        lastValueFrom(this.http.get<any[]>(`${environment.apiUrl}/categories`))
      ]);

      this.categories = categories;

      // Build a map for quick lookup of offered services
      this.myServicesMap.clear();
      for (const s of myServices) {
        if (s.service?.serviceId != null) {
          this.myServicesMap.set(s.service.serviceId, s);
        }
      }

      // Load first page of catalog services
      await this.loadCatalogPage();
    } catch (err) {
      console.error('Error loading initial data', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load services.' });
      this.loading = false;
    }
  }

  /**
   * Load a specific page of catalog services from the backend
   */
  async loadCatalogPage() {
    try {
      this.loading = true;

      const response: any = await lastValueFrom(
        this.apiService.getServicesPaginated(this.currentPage, this.pageSize, this.searchTerm)
      );

      // Handle paginated response
      const catalogServices = response.data || [];
      this.totalRecords = response.total || 0;
      this.totalPages = response.totalPages || 0;

      this.allViewModels = catalogServices.map((catSvc: any) => {
        const existing = this.myServicesMap.get(catSvc.serviceId);
        return {
          catalogServiceId: catSvc.serviceId,
          title: catSvc.name,
          description: catSvc.description || '',
          categoryName: catSvc.category ? catSvc.category.categoryName : 'Uncategorized',
          isOffered: !!existing,
          providerPrice: existing ? Number(existing.price) : 0,
        };
      });
    } catch (err) {
      console.error('Error loading catalog page', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load services.' });
    } finally {
      this.loading = false;
    }
  }

  /**
   * Handle paginator page change
   */
  onPageChange(event: any) {
    this.currentPage = Math.floor(event.first / event.rows) + 1;
    this.pageSize = event.rows;
    this.loadCatalogPage();
  }

  /**
   * Debounced search handler
   */
  onSearchChange() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadCatalogPage();
    }, 400);
  }

  showNewServiceDialog() {
    this.displayNewServiceDialog = true;
    this.newServiceForm = { name: '', description: '', categoryId: null, price: 0 };
  }

  async saveNewService() {
    try {
      if (!this.newServiceForm.name || !this.newServiceForm.categoryId) {
        this.messageService.add({ severity: 'warn', summary: 'Missing Data', detail: 'Please fill name and category.' });
        return;
      }
      await lastValueFrom(this.http.post(`${environment.apiUrl}/services/provider`, {
        name: this.newServiceForm.name,
        description: this.newServiceForm.description,
        categoryId: this.newServiceForm.categoryId,
        price: this.newServiceForm.price
      }));
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Custom service added to catalog.' });
      this.displayNewServiceDialog = false;
      // Reload initial data to refresh the myServicesMap and catalog page
      this.loadInitialData();
    } catch (err) {
      console.error('Save failed', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not create new service.' });
    }
  }

  async saveConfiguration() {
    try {
      const payload = this.allViewModels
        .filter(vm => vm.isOffered)
        .map(vm => ({
          serviceId: vm.catalogServiceId,
          price: vm.providerPrice || 0
        }));

      await lastValueFrom(this.http.post(`${environment.apiUrl}/services/provider/bulk`, payload));
      
      this.messageService.add({ severity: 'success', summary: 'Configuration Saved', detail: 'Your service catalog offerings and customized pricing have been updated.', life: 3000 });

      // Refresh the provider services map after saving
      const user = this.authService.currentUser();
      if (user) {
        const myServices: any = await lastValueFrom(this.http.get<any[]>(`${environment.apiUrl}/services/provider/${user.id}`));
        this.myServicesMap.clear();
        for (const s of myServices) {
          if (s.service?.serviceId != null) {
            this.myServicesMap.set(s.service.serviceId, s);
          }
        }
      }
    } catch (err) {
      console.error('Save failed', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save services.' });
    }
  }

  get activeCount() {
    return this.allViewModels.filter(v => v.isOffered).length;
  }
}
