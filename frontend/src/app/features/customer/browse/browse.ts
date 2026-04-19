import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { SelectItem } from 'primeng/api';
import type { SelectChangeEvent } from 'primeng/types/select';

import { DataService, Category } from '../../../core/services/data.service';

@Component({
  selector: 'app-browse-services',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule,
    ButtonModule, TagModule, DataViewModule,
    SelectButtonModule, SelectModule, InputTextModule, ChipModule,
    IconField, InputIcon,
  ],
  templateUrl: './browse.html',
  styleUrl: './browse.css'
})
export class BrowseServices {
  private dataService = inject(DataService);
  private titleService = inject(Title);

  categories = this.dataService.categories;

  sortOptions: SelectItem[] = [
    { label: 'Price: Low to High', value: 'basePrice' },
    { label: 'Price: High to Low', value: '!basePrice' }
  ];
  sortKey: string = '';
  sortField: string = '';
  sortOrder: number = 1;

  layout: 'list' | 'grid' = 'grid';
  layoutOptions = ['list', 'grid'];

  selectedCategoryId = signal<string | null>(null);
  searchQuery = signal('');

  filteredServices = computed(() => {
    const catId = this.selectedCategoryId();
    const query = this.searchQuery().toLowerCase().trim();
    let results = catId
      ? this.dataService.getServicesByCategory(catId)
      : [...this.dataService.catalogServices];
    if (query) {
      results = results.filter(s =>
        s.title.toLowerCase().includes(query) ||
        s.categoryName.toLowerCase().includes(query)
      );
    }
    return results;
  });

  constructor() {
    this.titleService.setTitle('Servicio | Browse Services');
  }

  selectCategory(catId: string | null) {
    this.selectedCategoryId.set(catId);
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onSortChange(event: SelectChangeEvent): void {
    const raw = event.value;
    const value = typeof raw === 'string' ? raw : '';
    if (value.startsWith('!')) {
      this.sortOrder = -1;
      this.sortField = value.slice(1);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  get activeCategory(): string | null {
    return this.selectedCategoryId();
  }

  get activeCategoryLabel(): string {
    const cat = this.categories.find(c => c.id === this.selectedCategoryId());
    return cat ? cat.name : 'All Services';
  }
}
