import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  // -- USERS --
  getProviders() {
    return this.http.get(`${this.baseUrl}/users/providers`);
  }

  // -- CATEGORIES --
  getCategories() {
    return this.http.get(`${this.baseUrl}/categories`);
  }

  // -- SERVICES --
  getServices() {
    return this.http.get(`${this.baseUrl}/services`);
  }

  getServicesPaginated(page: number, limit: number, search?: string) {
    let params = `?page=${page}&limit=${limit}`;
    if (search && search.trim()) {
      params += `&search=${encodeURIComponent(search.trim())}`;
    }
    return this.http.get(`${this.baseUrl}/services${params}`);
  }
  
  getProviderServices(providerId: string) {
    return this.http.get(`${this.baseUrl}/services/provider/${providerId}`);
  }

  getServiceProviders(serviceId: string) {
    return this.http.get(`${this.baseUrl}/services/${serviceId}/providers`);
  }

  // -- BOOKINGS --
  createBooking(data: any) {
    return this.http.post(`${this.baseUrl}/bookings`, data);
  }

  addServiceToBooking(bookingId: string, serviceId: string | number) {
    return this.http.post(`${this.baseUrl}/bookings/${bookingId}/services`, { serviceId });
  }

  getBookingDetails(bookingId: string) {
    return this.http.get(`${this.baseUrl}/bookings/${bookingId}`);
  }

  getProviderBookings(providerId: string) {
    return this.http.get(`${this.baseUrl}/bookings/provider/${providerId}`);
  }

  getCustomerBookings(customerId: string) {
    return this.http.get(`${this.baseUrl}/bookings/customer/${customerId}`);
  }

  updateBookingStatus(bookingId: string, status: string) {
    return this.http.patch(`${this.baseUrl}/bookings/${bookingId}/status`, { status });
  }

  // -- ADDRESSES --
  getUserAddresses(userId: string) {
    return this.http.get(`${this.baseUrl}/addresses/user/${userId}`);
  }

  createAddress(userId: string, data: { street: string; city: string; state: string; zipCode: string }) {
    return this.http.post(`${this.baseUrl}/addresses/user/${userId}`, data);
  }

  // -- SCHEDULES --
  getProviderSchedule(providerId: string) {
    return this.http.get(`${this.baseUrl}/schedules/provider/${providerId}`);
  }

  createSchedule(providerId: string, data: any) {
    return this.http.post(`${this.baseUrl}/schedules/provider/${providerId}`, data);
  }

  // -- REVIEWS --
  getBookingReview(bookingId: string) {
    return this.http.get(`${this.baseUrl}/reviews/booking/${bookingId}`);
  }

  getProviderReviews(providerId: string) {
    return this.http.get(`${this.baseUrl}/reviews/provider/${providerId}`);
  }

  createReview(bookingId: string, rating: number, comment: string) {
    return this.http.post(`${this.baseUrl}/reviews/booking/${bookingId}`, { rating, comment });
  }

  // -- PAYMENTS --
  getBookingPayment(bookingId: string) {
    return this.http.get(`${this.baseUrl}/payments/booking/${bookingId}`);
  }

  getCustomerPayments(customerId: string) {
    return this.http.get(`${this.baseUrl}/payments/customer/${customerId}`);
  }

  getProviderPaymentsList(providerId: string) {
    return this.http.get(`${this.baseUrl}/payments/provider/${providerId}`);
  }
  
  createPayment(bookingId: string, data: any) {
    return this.http.post(`${this.baseUrl}/payments/booking/${bookingId}`, data);
  }

  // -- NOTIFICATIONS --
  getUserNotifications(userId: string) {
    return this.http.get(`${this.baseUrl}/notifications/user/${userId}`);
  }

  // -- SAVED SERVICES --
  getCustomerSavedServices(customerId: string) {
    return this.http.get(`${this.baseUrl}/saved-services/customer/${customerId}`);
  }

  saveService(customerId: string, serviceId?: number, providerId?: number, notes?: string) {
    return this.http.post(`${this.baseUrl}/saved-services`, {
      customerId: +customerId,
      serviceId,
      providerId,
      notes
    });
  }

  removeSavedService(customerId: string, savedServiceId: string) {
    return this.http.delete(`${this.baseUrl}/saved-services/${savedServiceId}/customer/${customerId}`);
  }

  checkIfSaved(customerId: string, serviceId?: number, providerId?: number) {
    return this.http.post(`${this.baseUrl}/saved-services/customer/${customerId}/check`, {
      serviceId,
      providerId
    });
  }
}
