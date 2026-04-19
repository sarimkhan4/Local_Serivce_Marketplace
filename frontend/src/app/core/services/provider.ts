import { Injectable, signal } from '@angular/core';

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName?: string;
  bio?: string;
  rating: number;
}

export interface Service {
  id: string;
  categoryId: string;
  name: string;
  defaultPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  readonly currentProfile = signal<ProviderProfile | null>(null);
  readonly providerServices = signal<Service[]>([]);

  constructor() {}

  async getServicesByProvider(providerId: string): Promise<Service[]> {
    return [];
  }
}
