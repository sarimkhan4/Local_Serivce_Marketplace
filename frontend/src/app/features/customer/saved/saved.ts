import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

import { DataService, Provider } from '../../../core/services/data.service';

@Component({
  selector: 'app-saved-pros',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  templateUrl: './saved.html',
  styleUrl: './saved.css',
})
export class SavedPros {
  private dataService = inject(DataService);
  private titleService = inject(Title);

  // Access explicitly tracking computed Signal array for DOM reflow
  savedProviders = computed(() => this.dataService.savedPros());

  constructor() {
    this.titleService.setTitle('Servicio | Saved Pros');
  }

  unsave(pro: Provider) {
    this.dataService.unsavePro(pro.id);
  }
}
