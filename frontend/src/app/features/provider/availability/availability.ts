import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-availability',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    ButtonModule, DatePickerModule, DividerModule,
    ToastModule, ChipModule, TagModule
  ],
  providers: [MessageService],
  templateUrl: './availability.html',
  styleUrl: './availability.css'
})
export class Availability {
  private titleService    = inject(Title);
  private bookingService  = inject(BookingService);
  private authService     = inject(AuthService);
  private messageService  = inject(MessageService);

  selectedDate: Date | null = new Date();
  
  // ER Diagram allows specific Time Slots per Date (PROVIDER 1:M SCHEDULE)
  allTimeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
  ];

  constructor() {
    this.titleService.setTitle('Local Service Management System | Schedule Management');
  }

  get selectedDateStr(): string {
    return this.formatSystemDate(this.selectedDate);
  }

  formatSystemDate(d: Date | null): string {
    if (!d) return '';
    // Format safely to YYYY-MM-DD
    const offset = d.getTimezoneOffset();
    const localD = new Date(d.getTime() - (offset * 60 * 1000));
    return localD.toISOString().split('T')[0];
  }

  isSlotActive(slot: string): boolean {
    const list = this.bookingService.schedules();
    return list.some(s => s.date === this.selectedDateStr && s.timeSlot === slot);
  }

  toggleSlot(slot: string) {
    if (!this.selectedDate) return;
    const providerId = this.authService.currentUser()?.id ?? '1';
    this.bookingService.toggleScheduleBlock(providerId, this.selectedDateStr, slot);
  }

  selectAll() {
    if (!this.selectedDate) return;
    const providerId = this.authService.currentUser()?.id ?? '1';
    this.allTimeSlots.forEach(s => {
      if (!this.isSlotActive(s)) {
        this.bookingService.toggleScheduleBlock(providerId, this.selectedDateStr, s);
      }
    });
    this.messageService.add({ severity: 'success', summary: 'All Slots Added', life: 2000 });
  }

  clearAll() {
    if (!this.selectedDate) return;
    this.bookingService.deleteSchedulesByDate(this.selectedDateStr);
    this.messageService.add({ severity: 'warn', summary: 'All Slots Cleared', detail: 'Schedules removed for ' + this.selectedDateStr, life: 2000 });
  }

  // To highlight calendar dates that have configured schedules
  hasSlotsForDate(year: number, month: number, day: number): boolean {
    const paddedM = String(month + 1).padStart(2, '0');
    const paddedD = String(day).padStart(2, '0');
    const dateStr = `${year}-${paddedM}-${paddedD}`;
    const list = this.bookingService.schedules();
    return list.some(s => s.date === dateStr);
  }

  get configuredDatesCount(): number {
    const uniqueDates = new Set(this.bookingService.schedules().map(s => s.date));
    return uniqueDates.size;
  }
}
