import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-provider-settings',
  standalone: true,
  imports: [CommonModule, InputTextModule, TextareaModule, ButtonModule, AvatarModule, FileUploadModule, ToastModule],
  providers: [MessageService],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class ProviderSettings {
  private titleService = inject(Title);
  public authService = inject(AuthService);
  private messageService = inject(MessageService);

  providerName = `${this.authService.currentUser()?.firstName || ''} ${this.authService.currentUser()?.lastName || ''}`.trim() || 'Provider Name';
  providerEmail = this.authService.currentUser()?.email || 'provider@example.com';
  photoUrl: string | null = null;
  companyName = "My Business";
  experience = 1;
  description = "A reliable local service provider.";

  constructor() {
    this.titleService.setTitle('Local Service Management System | Edit Provider Profile');
    
    // Load existing config if applicable, but for now we set default DB fallbacks
    // If backend profile APIs exist, you would query them here
  }

  onBasicUploadAuto(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null;
        this.photoUrl = result;
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
      };
      reader.readAsDataURL(file);
    }
  }
}
