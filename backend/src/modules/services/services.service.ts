import { Injectable, Inject } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { Service } from '../../entities/service.entity';
import { ProviderService } from '../../entities/provider-service.entity';

/**
 * ServicesService
 * Manages generic services and custom ProviderService configurations.
 * Aligns with the ER diagram's M:N pricing linkage.
 */
@Injectable()
export class ServicesService {
  constructor(
    @Inject('SERVICE_REPOSITORY')
    private serviceRepository: Repository<Service>,
    @Inject('PROVIDER_SERVICE_REPOSITORY')
    private providerServiceRepository: Repository<ProviderService>,
  ) {}

  /**
   * Fetch all global services with category.
   * Supports optional pagination and search for performance.
   * When page/limit are omitted, returns all services (backward-compatible).
   */
  async findAll(
    page?: number,
    limit?: number,
    search?: string,
  ): Promise<{ data: Service[]; total: number; page: number; limit: number; totalPages: number } | Service[]> {
    // If no pagination params supplied, return plain array (backward-compatible)
    if (page == null && limit == null && !search) {
      return this.serviceRepository.find({ relations: ['category'] });
    }

    const take = limit ?? 20;
    const skip = ((page ?? 1) - 1) * take;

    const whereClause: any = {};
    if (search && search.trim()) {
      whereClause.name = Like(`%${search.trim()}%`);
    }

    const [data, total] = await this.serviceRepository.findAndCount({
      where: whereClause,
      relations: ['category'],
      order: { serviceId: 'ASC' },
      skip,
      take,
    });

    return {
      data,
      total,
      page: page ?? 1,
      limit: take,
      totalPages: Math.ceil(total / take),
    };
  }

  /**
   * Fetch specific global service
   */
  async findById(id: number): Promise<Service | null> {
    return this.serviceRepository.findOne({ 
      where: { serviceId: id },
      relations: ['category']
    });
  }

  /**
   * Admin: create a new generic service
   */
  async create(data: Partial<Service>): Promise<Service> {
    const newService = this.serviceRepository.create(data);
    return this.serviceRepository.save(newService);
  }

  /**
   * Provider: Links a provider to an existing service with a specific price,
   * or dynamically creates a new service if one is not provided.
   */
  async addProviderService(
    providerId: number, 
    data: { serviceId?: number, name?: string, description?: string, categoryId?: number, price: number }
  ): Promise<ProviderService> {
    let targetServiceId = data.serviceId;

    // Dynamically create a Service if it doesn't exist
    if (!targetServiceId && data.name && data.categoryId) {
      const newService = this.serviceRepository.create({
        name: data.name,
        description: data.description,
        category: { categoryId: data.categoryId } as any
      });
      const savedService = await this.serviceRepository.save(newService);
      targetServiceId = savedService.serviceId;
    }

    if (!targetServiceId) {
      throw new Error('You must provide either an existing serviceId or required details (name, categoryId) to create a new one.');
    }

    const newProviderService = this.providerServiceRepository.create({
      provider: { userId: providerId } as any,
      service: { serviceId: targetServiceId } as any,
      price: data.price
    });
    return this.providerServiceRepository.save(newProviderService);
  }

  /**
   * Fetch all services offered by a specific provider (with custom prices)
   */
  async getServicesByProvider(providerId: number): Promise<ProviderService[]> {
    return this.providerServiceRepository.find({
      where: { provider: { userId: providerId } },
      relations: ['service', 'service.category']
    });
  }

  /**
   * Fetch all providers that offer a specific service (with custom prices)
   */
  async getProvidersByService(serviceId: number): Promise<ProviderService[]> {
    return this.providerServiceRepository.find({
      where: { service: { serviceId } },
      relations: ['provider', 'service', 'service.category']
    });
  }

  /**
   * Fetch all provider services globally (for customer browsing)
   */
  async getAllProviderServices(): Promise<ProviderService[]> {
    return this.providerServiceRepository.find({
      relations: ['service', 'service.category', 'provider']
    });
  }

  /**
   * Bulk save provider services
   */
  async bulkSaveProviderServices(providerId: number, services: { serviceId: number, price: number }[]) {
    // Remove existing
    await this.providerServiceRepository.delete({ provider: { userId: providerId } });
    
    // Insert new
    if (services && services.length > 0) {
      const newProviderServices = services.map(s => this.providerServiceRepository.create({
        provider: { userId: providerId } as any,
        service: { serviceId: s.serviceId } as any,
        price: s.price
      }));
      return this.providerServiceRepository.save(newProviderServices);
    }
    return [];
  }
}
