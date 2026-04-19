import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-provider-settings',
  standalone: true,
  imports: [CommonModule, InputTextModule, TextareaModule, ButtonModule, AvatarModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class ProviderSettings {
  private titleService = inject(Title);

  constructor() {
    this.titleService.setTitle('Local Service Management System | Edit Provider Profile');
  }
}
