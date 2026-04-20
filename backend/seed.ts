import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';

import { User } from './src/entities/user.entity';
import { Customer } from './src/entities/customer.entity';
import { Provider } from './src/entities/provider.entity';
import { Category } from './src/entities/category.entity';
import { Service } from './src/entities/service.entity';
import { ProviderService } from './src/entities/provider-service.entity';
import { Address } from './src/entities/address.entity';
import { Schedule } from './src/entities/schedule.entity';
import { Booking } from './src/entities/booking.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'hunain',
    password: 'mysql',
    database: 'local_service_management_system',
    entities: [User, Customer, Provider, Category, Service, ProviderService, Address, Schedule, Booking],
  });

  await dataSource.initialize();
  console.log('Connected.');
  
  // 1. Categories
  const categories: Category[] = [];
  const catNames = ['Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Landscaping', 'Pest Control', 'Roofing', 'HVAC', 'Moving', 'Appliance Repair'];
  for (const name of catNames) {
    let cat = await dataSource.manager.findOne(Category, { where: { categoryName: name } });
    if (!cat) {
      cat = dataSource.manager.create(Category, { categoryName: name, description: faker.lorem.sentence() });
      await dataSource.manager.save(cat);
    }
    categories.push(cat);
  }

  // 2. Services
  const services: Service[] = [];
  for (let i = 0; i < 20; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const s = dataSource.manager.create(Service, {
      name: faker.commerce.productName(),
      description: faker.lorem.sentences(2),
      category: category,
    });
    await dataSource.manager.save(s);
    services.push(s);
  }

  // 3. Customers
  const customers: Customer[] = [];
  for (let i = 0; i < 10; i++) {
    const c = dataSource.manager.create(Customer, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: '0000000000',
      password: 'password123',
    });
    await dataSource.manager.save(c);
    customers.push(c);
  }

  // 4. Providers
  const providers: Provider[] = [];
  for (let i = 0; i < 10; i++) {
    const p = dataSource.manager.create(Provider, {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: '0000000000',
      password: 'password123',
      experience: faker.number.int({ min: 1, max: 20 }),
    });
    await dataSource.manager.save(p);
    providers.push(p);
  }

  // 5. Provider Services
  for (let i = 0; i < 20; i++) {
    const p = providers[Math.floor(Math.random() * providers.length)];
    const s = services[Math.floor(Math.random() * services.length)];
    
    // Check if combo exists
    const exists = await dataSource.manager.findOne(ProviderService, { where: { provider: { userId: p.userId }, service: { serviceId: s.serviceId } } });
    if (!exists) {
       const ps = dataSource.manager.create(ProviderService, {
         provider: p,
         service: s,
         price: faker.number.int({ min: 50, max: 500 })
       });
       await dataSource.manager.save(ps);
    }
  }

  // 6. Addresses
  for(const user of [...customers, ...providers]) {
     const addr = dataSource.manager.create(Address, {
         user: user,
         street: faker.location.streetAddress(),
         city: faker.location.city(),
         state: faker.location.state(),
         zipCode: faker.location.zipCode()
     });
     await dataSource.manager.save(addr);
  }

  console.log('Seeded successfully!');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
