import { DataSource } from 'typeorm';

// ── Import every entity explicitly so TypeORM always picks them up ──
import { User }           from '../../entities/user.entity';
import { Customer }       from '../../entities/customer.entity';
import { Provider }       from '../../entities/provider.entity';
import { Category }       from '../../entities/category.entity';
import { Service }        from '../../entities/service.entity';
import { ProviderService } from '../../entities/provider-service.entity';
import { Address }        from '../../entities/address.entity';
import { Schedule }       from '../../entities/schedule.entity';
import { Booking }        from '../../entities/booking.entity';
import { BookingService } from '../../entities/booking-service.entity';
import { Payment }        from '../../entities/payment.entity';
import { Review }         from '../../entities/review.entity';
import { Notification }   from '../../entities/notification.entity';

/**
 * DatabaseProvider
 * Creates and initialises the TypeORM DataSource using the provided credentials.
 * `synchronize: true` keeps the schema in sync with entities during development.
 */
export const databaseProviders = [
  {
    provide: 'DATABASE_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'hunain',
        password: 'mysql',
        database: 'local_service_management_system',
        entities: [
          User,
          Customer,
          Provider,
          Category,
          Service,
          ProviderService,
          Address,
          Schedule,
          Booking,
          BookingService,
          Payment,
          Review,
          Notification,
        ],
        synchronize: true,
        logging: false,
      });

      return dataSource.initialize();
    },
  },
];
