import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { TabsModule } from 'primeng/tabs';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';

import { BookingService, Address } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth';

export interface CustomerProfileForm {
  name: string;
  email: string;
  phone: string;
  photoUrl: string | null;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AddressLabelOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-customer-settings',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, InputTextModule, AvatarModule, DividerModule,
    TabsModule, DialogModule, TagModule, SelectModule, ToggleSwitchModule, ToastModule,
    TooltipModule, FileUploadModule
  ],
  providers: [MessageService],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class CustomerSettings implements OnInit {
  private titleService = inject(Title);
  public bookingService = inject(BookingService);
  private authService   = inject(AuthService);
  private messageService = inject(MessageService);

  // ── Profile form ──
  profile = signal<CustomerProfileForm>({
    name: `${this.authService.currentUser()?.firstName || ''} ${this.authService.currentUser()?.lastName || ''}`.trim() || 'Customer Name',
    email: this.authService.currentUser()?.email || 'customer@example.com',
    phone: '',
    photoUrl: null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // ── Address state ──
  showAddressDialog = false;
  editingAddress: Address | null = null;
  addressForm: Omit<Address, 'id'> = this.emptyAddress();

  labelOptions: AddressLabelOption[] = [
    { label: 'Home', value: 'Home' },
    { label: 'Work', value: 'Work' },
    { label: 'Other', value: 'Other' },
  ];

  constructor() {
    this.titleService.setTitle('Servicio | Settings');
  }

  ngOnInit(): void {
    const id = this.authService.currentUser()?.id;
    if (id) {
      this.bookingService.loadAddresses(id);
    }
  }

  emptyAddress(): Omit<Address, 'id'> {
    return { street: '', city: '', state: '', zipCode: '', isDefault: false, label: 'Home' };
  }

  openAddAddress() {
    this.editingAddress = null;
    this.addressForm = this.emptyAddress();
    this.showAddressDialog = true;
  }

  openEditAddress(address: Address) {
    this.editingAddress = address;
    this.addressForm = { ...address };
    this.showAddressDialog = true;
  }

  saveAddress() {
    if (!this.addressForm.street || !this.addressForm.city) return;
    const userId = this.authService.currentUser()?.id ?? '1';
    if (this.editingAddress) {
      // updateAddress is a local optimistic update (no userId needed)
      this.bookingService.updateAddress({ ...this.addressForm, id: this.editingAddress.id });
      this.messageService.add({ severity: 'success', summary: 'Address Updated', life: 3000 });
    } else {
      this.bookingService.addAddress(userId, this.addressForm);
      this.messageService.add({ severity: 'success', summary: 'Address Added', life: 3000 });
    }
    this.showAddressDialog = false;
  }

  deleteAddress(id: string) {
    this.bookingService.deleteAddress(id);
    this.messageService.add({ severity: 'warn', summary: 'Address Deleted', life: 3000 });
  }

  setDefault(id: string) {
    this.bookingService.setDefault(id);
    this.messageService.add({ severity: 'success', summary: 'Default address updated', life: 3000 });
  }

  saveProfile() {
    this.messageService.add({ severity: 'success', summary: 'Profile Saved', detail: 'Your changes have been saved.', life: 3000 });
  }

  changePassword() {
    const p = this.profile();
    if (!p.newPassword || p.newPassword !== p.confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Passwords do not match', life: 3000 });
      return;
    }
    this.messageService.add({ severity: 'success', summary: 'Password Changed', life: 3000 });
    this.profile.update(v => ({ ...v, currentPassword: '', newPassword: '', confirmPassword: '' }));
  }

  profileInitials(): string {
    const n = this.profile().name.trim();
    if (!n) return '?';
    const parts = n.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  }

  onBasicUploadAuto(event: any) {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null;
        this.profile.update(v => ({ ...v, photoUrl: result }));
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded with Auto Mode' });
      };
      reader.readAsDataURL(file);
    }
  }

  onProfilePhotoChange(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    const file = target?.files?.[0];
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.messageService.add({ severity: 'warn', summary: 'Invalid file', detail: 'Please select an image file.', life: 2500 });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : null;
      this.profile.update(v => ({ ...v, photoUrl: result }));
      this.messageService.add({ severity: 'success', summary: 'Photo updated', life: 2000 });
    };
    reader.readAsDataURL(file);
  }
}
