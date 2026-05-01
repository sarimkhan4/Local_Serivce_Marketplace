import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Modules
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';

// Services
import { ApiService } from '../../core/services/api.service';

interface Category {
  categoryId: string;
  categoryName: string;
  description: string;
  serviceCount?: number;
}

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    PaginatorModule,
    InputTextModule,
    SkeletonModule
  ],
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  
  // Pagination
  first = 0;
  rows = 12;
  totalRecords = 0;

  ngOnInit() {
    this.loadCategories();
  }

  async loadCategories() {
    this.loading.set(true);
    try {
      const data = await this.apiService.getCategories().toPromise();
      if (data && Array.isArray(data)) {
        this.categories.set(data as Category[]);
        this.totalRecords = data.length;
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      this.loading.set(false);
    }
  }

  get filteredCategories() {
    const term = this.searchTerm().toLowerCase();
    const filtered = term 
      ? this.categories().filter(cat => 
          cat.categoryName.toLowerCase().includes(term) ||
          cat.description.toLowerCase().includes(term)
        )
      : this.categories();
    
    this.totalRecords = filtered.length;
    return filtered;
  }

  get paginatedCategories() {
    const filtered = this.filteredCategories;
    const start = this.first;
    const end = start + this.rows;
    return filtered.slice(start, end);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onSearch(event: any) {
    this.searchTerm.set(event.target.value);
    this.first = 0; // Reset to first page when searching
  }

  viewCategory(category: Category) {
    this.router.navigate(['/services'], { 
      queryParams: { category: category.categoryName } 
    });
  }

  getCategoryIcon(categoryName: string): string {
    const icons: { [key: string]: string } = {
      'cleaning': 'pi-sparkles',
      'plumbing': 'pi-wrench',
      'electrical': 'pi-bolt',
      'painting': 'pi-palette',
      'landscaping': 'pi-leaf',
      'pest control': 'pi-shield',
      'roofing': 'pi-home',
      'hvac': 'pi-spin pi-cog',
      'moving': 'pi-truck',
      'appliance repair': 'pi-tools',
      'carpentry': 'pi-hammer',
      'masonry': 'pi-th',
      'flooring': 'pi-th-large',
      'insulation': 'pi-sun',
      'windows & doors': 'pi-clone',
      'gutter cleaning': 'pi-arrow-down',
      'pressure washing': 'pi-refresh',
      'junk removal': 'pi-trash',
      'pool maintenance': 'pi-water',
      'tree service': 'pi-tree',
      'snow removal': 'pi-cloud',
      'home security': 'pi-lock',
      'solar installation': 'pi-sun',
      'generator service': 'pi-power-off',
      'water treatment': 'pi-filter',
      'sewer cleaning': 'pi-arrow-circle-down',
      'foundation repair': 'pi-building',
      'drywall': 'pi-th',
      'tiling': 'pi-th-large',
      'countertops': 'pi-th-large',
      'cabinet installation': 'pi-box',
      'lighting': 'pi-lightbulb',
      'ceiling fans': 'pi-spin',
      'smart home': 'pi-android',
      'home theater': 'pi-play',
      'furniture assembly': 'pi-box',
      'garage door': 'pi-sort-alt',
      'fencing': 'pi-bars',
      'deck building': 'pi-th',
      'patio construction': 'pi-th-large',
      'concrete work': 'pi-th',
      'asphalt repair': 'pi-th',
      'interior design': 'pi-palette',
      'home organization': 'pi-clone',
      'event planning': 'pi-calendar',
      'catering': 'pi-utensils',
      'photography': 'pi-camera',
      'videography': 'pi-video',
      'dj services': 'pi-play',
      'live entertainment': 'pi-music',
      'party rentals': 'pi-box',
      'wedding services': 'pi-heart',
      'event security': 'pi-shield'
    };
    
    const key = categoryName.toLowerCase();
    return icons[key] || 'pi-cog';
  }

  getCategoryColor(categoryName: string): string {
    const colors: { [key: string]: string } = {
      'cleaning': 'blue',
      'plumbing': 'cyan',
      'electrical': 'yellow',
      'painting': 'orange',
      'landscaping': 'green',
      'pest control': 'red',
      'roofing': 'gray',
      'hvac': 'purple',
      'moving': 'pink',
      'appliance repair': 'teal',
      'carpentry': 'brown',
      'masonry': 'gray',
      'flooring': 'orange',
      'insulation': 'yellow',
      'windows & doors': 'blue',
      'gutter cleaning': 'cyan',
      'pressure washing': 'blue',
      'junk removal': 'gray',
      'pool maintenance': 'blue',
      'tree service': 'green',
      'snow removal': 'blue',
      'home security': 'red',
      'solar installation': 'yellow',
      'generator service': 'gray',
      'water treatment': 'blue',
      'sewer cleaning': 'gray',
      'foundation repair': 'brown',
      'drywall': 'orange',
      'tiling': 'cyan',
      'countertops': 'gray',
      'cabinet installation': 'brown',
      'lighting': 'yellow',
      'ceiling fans': 'blue',
      'smart home': 'purple',
      'home theater': 'red',
      'furniture assembly': 'brown',
      'garage door': 'gray',
      'fencing': 'brown',
      'deck building': 'orange',
      'patio construction': 'green',
      'concrete work': 'gray',
      'asphalt repair': 'gray',
      'interior design': 'purple',
      'home organization': 'pink',
      'event planning': 'purple',
      'catering': 'orange',
      'photography': 'pink',
      'videography': 'red',
      'dj services': 'purple',
      'live entertainment': 'red',
      'party rentals': 'blue',
      'wedding services': 'pink',
      'event security': 'red'
    };
    
    const key = categoryName.toLowerCase();
    return colors[key] || 'blue';
  }
}
