const fs = require('fs');
let content = fs.readFileSync('../frontend/src/app/features/customer/service-detail/service-detail.ts', 'utf8');
content = content.replace(/async ngOnInit\(\) \{[\s\S]+?  openBooking\(/, `async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      if (this.dataService.catalogServices.length === 0) {
        await this.dataService.loadCatalogServices();
      }
      this.service = this.dataService.getServiceById(id);
      
      if (this.service) {
        this.titleService.setTitle('Local Service Management System | ' + this.service.title);
        try {
          const { lastValueFrom } = await import('rxjs');
          const { HttpClient } = await import('@angular/common/http');
          const { environment } = await import('../../../../environments/environment');
          const http = Reflect.get(this.dataService, 'apiService')['http'];
          const listings: any[] = await lastValueFrom(http.get(\`\${environment.apiUrl}/services/listings\`));
          
          this.service.providers = listings
            .filter(ps => ps.service?.serviceId?.toString() === id)
            .map(ps => ({
              id: ps.provider?.userId?.toString() || '0',
              name: ps.provider?.name || 'Unknown',
              companyName: ps.provider?.companyName || 'Independent',
              rating: 4.8,
              reviews: 12,
              yearsExperience: ps.provider?.experience || 0,
              price: Number(ps.price),
              bio: ps.provider?.bio || 'Local professional ready to help.'
            }));
        } catch (e) {
          console.error('Failed to load listings', e);
        }
      }
    }
  }

  openBooking(`);
fs.writeFileSync('../frontend/src/app/features/customer/service-detail/service-detail.ts', content);
