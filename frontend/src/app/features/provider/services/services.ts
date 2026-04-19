import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { DataService, ServiceOffered } from '../../../core/services/data.service';

export interface ProviderServiceViewModel {
  catalogServiceId: string;
  title: string;
  description: string;
  categoryName: string;
  basePrice: number;
  isOffered: boolean;
  providerPrice: number;
  isActive: boolean;
}

@Component({
  selector: 'app-provider-services',
  standalone: true,
  imports: [
    CommonModule, FormsModule, TableModule, ButtonModule, 
    InputNumberModule, CheckboxModule, ToggleSwitchModule, 
    TagModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './services.html',
  styleUrl: './services.css',
})
export class Services implements OnInit {
  private dataService = inject(DataService);
  private titleService = inject(Title);
  private messageService = inject(MessageService);

  allViewModels: ProviderServiceViewModel[] = [];

  constructor() {
    this.titleService.setTitle('Servicio PRO | Service Configuration');
  }

  ngOnInit() {
    this.buildViewModels();
  }

  buildViewModels() {
    const catalog = this.dataService.catalogServices;
    const currentMyServices = this.dataService.myServices();

    this.allViewModels = catalog.map(catSvc => {
      // Find if we already offer it
      const existing = currentMyServices.find(s => s.id === catSvc.id || s.title === catSvc.title);
      
      return {
        catalogServiceId: catSvc.id,
        title: catSvc.title,
        description: catSvc.description,
        categoryName: catSvc.categoryName,
        basePrice: catSvc.basePrice,
        isOffered: !!existing,
        providerPrice: existing ? existing.price : catSvc.basePrice,
        isActive: existing ? existing.isActive : true
      };
    });
  }

  saveConfiguration() {
    const newMyServices: ServiceOffered[] = this.allViewModels
      .filter(vm => vm.isOffered)
      .map(vm => ({
        id: vm.catalogServiceId,
        providerId: 'me',
        title: vm.title,
        description: vm.description,
        price: vm.providerPrice || vm.basePrice,
        category: vm.categoryName,
        isActive: vm.isActive
      }));

    this.dataService.myServices.set(newMyServices);
    this.messageService.add({ severity: 'success', summary: 'Configuration Saved', detail: 'Your service catalog offerings and customized pricing have been updated.', life: 3000 });
  }

  get activeCount() {
    return this.allViewModels.filter(v => v.isOffered).length;
  }
}
