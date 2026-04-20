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
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth';

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
    DialogModule, SelectModule, InputTextModule, TextareaModule
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

  allViewModels: ProviderServiceViewModel[] = [];
  categories: any[] = [];

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
    this.loadData();
  }

  async loadData() {
    try {
      const user = this.authService.currentUser();
      if (!user) return;

      const [catalogServices, myServices, categories] = await Promise.all([
        lastValueFrom(this.http.get<any[]>(`${environment.apiUrl}/services`)),
        lastValueFrom(this.http.get<any[]>(`${environment.apiUrl}/services/provider/${user.id}`)),
        lastValueFrom(this.http.get<any[]>(`${environment.apiUrl}/categories`))
      ]);

      this.categories = categories;

      this.allViewModels = catalogServices.map(catSvc => {
        const existing = myServices.find(s => s.service.serviceId === catSvc.serviceId);
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
      console.error('Error loading services', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not load services.' });
    }
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
      this.loadData();
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
    } catch (err) {
      console.error('Save failed', err);
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Could not save services.' });
    }
  }

  get activeCount() {
    return this.allViewModels.filter(v => v.isOffered).length;
  }
}

