import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';
dotenv.config();

import { User } from './src/entities/user.entity';
import { Customer } from './src/entities/customer.entity';
import { Provider } from './src/entities/provider.entity';
import { Category } from './src/entities/category.entity';
import { Service } from './src/entities/service.entity';
import { ProviderService } from './src/entities/provider-service.entity';
import { Address } from './src/entities/address.entity';
import { Schedule } from './src/entities/schedule.entity';
import { Booking } from './src/entities/booking.entity';
import { Payment } from './src/entities/payment.entity';
import { Review } from './src/entities/review.entity';
import { Notification } from './src/entities/notification.entity';
import { BookingService } from './src/entities/booking-service.entity';
import { NotificationType } from './src/common/enums/notification_type.enum';

// Pakistani Data Arrays
const pakistaniFirstNames = [
  'Muhammad', 'Ahmed', 'Ali', 'Omar', 'Abdul', 'Bilal', 'Usman', 'Hassan', 'Zain', 'Saad',
  'Hamza', 'Fahad', 'Talha', 'Zubair', 'Yasir', 'Imran', 'Kamran', 'Adnan', 'Tariq', 'Nadeem',
  'Waqar', 'Shahid', 'Faisal', 'Irfan', 'Salman', 'Noman', 'Rizwan', 'Babar', 'Haris', 'Junaid',
  'Ahsan', 'Mujtaba', 'Zohaib', 'Danish', 'Umair', 'Sami', 'Farhan', 'Kashif', 'Moeen', 'Saqib',
  'Fatima', 'Ayesha', 'Khadija', 'Aisha', 'Mariam', 'Zainab', 'Sana', 'Sadia', 'Hina', 'Kiran',
  'Nadia', 'Saima', 'Uzma', 'Rabia', 'Amina', 'Sofia', 'Iqra', 'Areeba', 'Maham', 'Zara',
  'Alina', 'Anum', 'Alishba', 'Dua', 'Eman', 'Fiza', 'Javeria', 'Kainat', 'Laiba', 'Mehak'
];

const pakistaniLastNames = [
  'Khan', 'Ahmed', 'Ali', 'Malik', 'Sheikh', 'Siddiqui', 'Hussain', 'Raza', 'Qureshi', 'Butt',
  'Chaudhary', 'Gill', 'Bhatti', 'Rajput', 'Mughal', 'Mirza', 'Dar', 'Wattoo', 'Sial', 'Langah',
  'Khokhar', 'Gujjar', 'Jutt', 'Arain', 'Memon', 'Kazmi', 'Naqvi', 'Zaidi', 'Rizvi', 'Abidi',
  'Haidri', 'Shah', 'Soomro', 'Bhutto', 'Jamot', 'Magsi', 'Rind', 'Marri', 'Bugti', 'Mengal',
  'Kakar', 'Achakzai', 'Yousafzai', 'Khattak', 'Wazir', 'Bangash', 'Orakzai', 'Afridi', 'Shinwari',
  'Mohmand', 'Ghilzai', 'Tarin', 'Tanoli', 'Swati', 'Yusufzai', 'Durrani', 'Hotak', 'Barakzai'
];

const pakistaniCities = [
  'Karachi', 'Lahore', 'Faisalabad', 'Rawalpindi', 'Gujranwala', 'Peshawar', 'Multan', 'Hyderabad',
  'Islamabad', 'Quetta', 'Sialkot', 'Bahawalpur', 'Sargodha', 'Sukkur', 'Larkana', 'Sheikhupura',
  'Jhang', 'Rahim Yar Khan', 'Gujrat', 'Mardan', 'Kasur', 'Okara', 'Mingora', 'Nawabshah',
  'Abbottabad', 'Kohat', 'Layyah', 'Vehari', 'Dera Ghazi Khan', 'Hafizabad', 'Chiniot', 'Mianwali',
  'Bhakkar', 'Kohistan', 'Haripur', 'Manshera', 'Chakwal', 'Bannu', 'Tank', 'Lakki Marwat',
  'Kohlu', 'Zhob', 'Killa Saifullah', 'Loralai', 'Ziarat', 'Pishin', 'Qila Abdullah', 'Chaman'
];

const pakistaniProvinces = [
  'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Gilgit-Baltistan', 'Azad Kashmir'
];

const pakistaniAreas = [
  'DHA', 'Clifton', 'Gulshan', 'Johar', 'Nazimabad', 'North Nazimabad', 'PECHS', 'Gulistan-e-Jauhar',
  'Bahria Town', 'Model Town', 'Gulberg', 'Iqbal Town', 'Samnabad', 'Shadman', 'Muslim Town',
  'Cantonment', 'Defence', 'Askari', 'Wapda Town', 'Valencia', 'Lake City', 'Bahria Orchard',
  'Green Town', 'Madina Town', 'Jinnah Colony', 'Satellite Town', 'Civil Lines', 'Garden Town',
  'Faisal Town', 'Muslim Town', 'Shah Jamal', 'Afghan Colony', 'Bilal Town', 'Karwan Bazar'
];

// Helper functions
function getRandomPakistaniName(): string {
  const firstName = pakistaniFirstNames[Math.floor(Math.random() * pakistaniFirstNames.length)];
  const lastName = pakistaniLastNames[Math.floor(Math.random() * pakistaniLastNames.length)];
  return `${firstName} ${lastName}`;
}

function getRandomPakistaniPhone(): string {
  const prefixes = ['0300', '0301', '0302', '0303', '0304', '0305', '0306', '0307', '0308', '0309',
                    '0310', '0311', '0312', '0313', '0314', '0315', '0316', '0317', '0318', '0319',
                    '0320', '0321', '0322', '0323', '0324', '0325', '0326', '0327', '0328', '0329',
                    '0330', '0331', '0332', '0333', '0334', '0335', '0336', '0337', '0338', '0339',
                    '0340', '0341', '0342', '0343', '0344', '0345', '0346', '0347', '0348', '0349'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, '0');
  return prefix + suffix;
}

function getRandomPakistaniEmail(name: string): string {
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com'];
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  const randomNum = Math.floor(Math.random() * 999);
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${cleanName}${randomNum}@${domain}`;
}

function getRandomPakistaniAddress(): {street: string, city: string, state: string, zipCode: string} {
  const area = pakistaniAreas[Math.floor(Math.random() * pakistaniAreas.length)];
  const houseNo = Math.floor(Math.random() * 9999) + 1;
  const block = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const city = pakistaniCities[Math.floor(Math.random() * pakistaniCities.length)];
  const province = pakistaniProvinces[Math.floor(Math.random() * pakistaniProvinces.length)];
  const zipCode = Math.floor(Math.random() * 90000) + 10000;
  
  return {
    street: `House #${houseNo}, Block ${block}, ${area}`,
    city: city,
    state: province,
    zipCode: zipCode.toString()
  };
}

// Realistic Review Comments
const realisticReviewComments = [
  "Excellent service! Very professional and punctual.",
  "Great work quality. Will definitely hire again.",
  "Very satisfied with the service. Highly recommended!",
  "Professional and efficient. Got the job done perfectly.",
  "Outstanding service provider. Very skilled and reliable.",
  "Good value for money. Work completed on time.",
  "Very polite and professional. Great attention to detail.",
  "Exceeded my expectations. Will use their services again.",
  "Reliable and trustworthy. Excellent communication throughout.",
  "Highly professional service. Very pleased with the results.",
  "Great experience from start to finish. Thank you!",
  "Prompt service and great work ethics. Very impressed.",
  "Skilled professional who knows their job well.",
  "Excellent workmanship and very reasonable prices.",
  "Very happy with the service quality. Highly recommend!",
  "Professional approach and great customer service.",
  "Delivered exactly what was promised. Very satisfied.",
  "Great attention to detail and very punctual.",
  "Exceptional service! Will definitely recommend to others.",
  "Very professional and courteous. Excellent work!",
  "Reliable service provider with great skills.",
  "Outstanding quality and very reasonable rates.",
  "Very pleased with the entire experience.",
  "Professional and efficient. Great value for money.",
  "Excellent communication and service delivery.",
  "Highly skilled and very professional.",
  "Great work! Exceeded all my expectations.",
  "Very satisfied with the quality and service.",
  "Professional, punctual, and reasonably priced.",
  "Excellent service provider. Will hire again!",
  "Great work ethics and amazing results.",
  "Very professional and knowledgeable.",
  "Outstanding service quality. Highly recommended!",
  "Pleased with the work and professional attitude.",
  "Great experience. Reliable and skilled professional.",
  "Excellent service from start to finish.",
  "Very professional and reasonably priced.",
  "Great work quality and excellent customer service.",
  "Highly recommend their services. Very satisfied!",
  "Professional, efficient, and great results.",
  "Excellent workmanship and very professional.",
  "Very happy with the service. Will use again!",
  "Great service provider. Punctual and skilled.",
  "Outstanding work! Very pleased with the results.",
  "Professional service with great attention to detail.",
  "Excellent value and high quality work.",
  "Very professional and reliable service.",
  "Great experience! Highly recommend to everyone.",
  "Skilled professional with excellent work ethics.",
  "Outstanding service quality. Very satisfied!"
];

function getRandomReviewComment(): string {
  return realisticReviewComments[Math.floor(Math.random() * realisticReviewComments.length)];
}

async function seed() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test_db',
    entities: [User, Customer, Provider, Category, Service, ProviderService, Address, Schedule, Booking, Payment, Review, Notification, BookingService],
  });

  await dataSource.initialize();
  console.log('Connected. Ready to seed data without affecting existing data...');
  
  // 1. Categories
  const categories: Category[] = [];
  const catNames = [
    'Cleaning', 'Plumbing', 'Electrical', 'Painting', 'Landscaping', 'Pest Control', 
    'Roofing', 'HVAC', 'Moving', 'Appliance Repair', 'Carpentry', 'Masonry', 'Flooring',
    'Insulation', 'Windows & Doors', 'Gutter Cleaning', 'Pressure Washing', 'Junk Removal',
    'Pool Maintenance', 'Tree Service', 'Snow Removal', 'Home Security', 'Solar Installation',
    'Generator Service', 'Water Treatment', 'Sewer Cleaning', 'Foundation Repair', 'Drywall',
    'Tiling', 'Countertops', 'Cabinet Installation', 'Lighting', 'Ceiling Fans', 'Smart Home',
    'Home Theater', 'Furniture Assembly', 'Garage Door', 'Fencing', 'Deck Building',
    'Patio Construction', 'Concrete Work', 'Asphalt Repair', 'Interior Design', 'Home Organization',
    'Event Planning', 'Catering', 'Photography', 'Videography', 'DJ Services', 'Live Entertainment',
    'Party Rentals', 'Wedding Services', 'Event Security'
  ];
  for (const name of catNames) {
    let cat = await dataSource.manager.findOne(Category, { where: { categoryName: name } });
    if (!cat) {
      cat = dataSource.manager.create(Category, { categoryName: name, description: `Professional ${name.toLowerCase()} services for homes and offices` });
      await dataSource.manager.save(cat);
    }
    categories.push(cat);
  }

  // 2. Services
  const services: Service[] = [];
  const serviceNames = [
    'Home Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Carpet Cleaning',
    'Pipe Repair', 'Drain Cleaning', 'Water Tank Installation', 'Bathroom Fixtures',
    'Wiring Installation', 'Circuit Repair', 'Generator Service', 'Electrical Panel',
    'House Painting', 'Wall Painting', 'Exterior Painting', 'Polish Work',
    'Garden Maintenance', 'Lawn Care', 'Tree Cutting', 'Landscaping Design',
    'Termite Control', 'Cockroach Control', 'Mosquito Control', 'General Fumigation',
    'Roof Repair', 'Roof Installation', 'Waterproofing', 'Leak Repair',
    'AC Installation', 'AC Repair', 'AC Service', 'Ventilation',
    'Home Shifting', 'Office Relocation', 'Vehicle Transport', 'Packing Services',
    'Washing Machine Repair', 'Refrigerator Repair', 'Microwave Repair', 'AC Installation'
  ];
  
  for (let i = 0; i < serviceNames.length; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    let s = await dataSource.manager.findOne(Service, { where: { name: serviceNames[i] } });
    if (!s) {
      s = dataSource.manager.create(Service, {
        name: serviceNames[i],
        description: `Professional ${serviceNames[i].toLowerCase()} service with quality assurance`,
        category: category,
      });
      await dataSource.manager.save(s);
    }
    services.push(s);
  }

  // 3. Customers (Pakistani Data)
  const customers: Customer[] = [];
  for (let i = 0; i < 350; i++) {
    const name = getRandomPakistaniName();
    const email = getRandomPakistaniEmail(name);
    let existingCustomer = await dataSource.manager.findOne(Customer, { where: { email: email } });
    if (!existingCustomer) {
      const c = dataSource.manager.create(Customer, {
        name: name,
        email: email,
        phone: getRandomPakistaniPhone(),
        password: 'password123',
        role: 'customer'
      });
      await dataSource.manager.save(c);
      customers.push(c);
    }
  }

  // 4. Providers (Pakistani Data)
  const providers: Provider[] = [];
  for (let i = 0; i < 50; i++) {
    const name = getRandomPakistaniName();
    const email = getRandomPakistaniEmail(name);
    let existingProvider = await dataSource.manager.findOne(Provider, { where: { email: email } });
    if (!existingProvider) {
      const p = dataSource.manager.create(Provider, {
        name: name,
        email: email,
        phone: getRandomPakistaniPhone(),
        password: 'password123',
        role: 'provider',
        experience: faker.number.int({ min: 1, max: 20 }),
      });
      await dataSource.manager.save(p);
      providers.push(p);
    }
  }

  // 5. Provider Services
  for (let i = 0; i < 150; i++) {
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

  // 6. Addresses (Pakistani Data)
  const addresses: Address[] = [];
  for(const user of [...customers, ...providers]) {
     const address = getRandomPakistaniAddress();
     const addr = dataSource.manager.create(Address, {
         user: user,
         street: address.street,
         city: address.city,
         state: address.state,
         zipCode: address.zipCode
     });
     await dataSource.manager.save(addr);
     addresses.push(addr);
  }

  // 7. Schedules for Providers
  for(const provider of providers) {
    for (let i = 0; i < 3; i++) {
      const schedule = dataSource.manager.create(Schedule, {
        provider: provider,
        date: faker.date.future(),
        timeSlot: `${faker.number.int({ min: 8, max: 12 })}:00 - ${faker.number.int({ min: 13, max: 17 })}:00`,
      });
      await dataSource.manager.save(schedule);
    }
  }

  // 8. Notifications
  for(const user of [...customers, ...providers]) {
     const notif = dataSource.manager.create(Notification, {
        user: user,
        title: 'Welcome to LSM',
        message: 'Thank you for joining our platform.',
        type: NotificationType.SYSTEM_ALERT,
        isRead: false,
        isSent: true,
     });
     await dataSource.manager.save(notif);
  }

  // 9. Bookings
  const statuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  for (let i = 0; i < 200; i++) {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const provider = providers[Math.floor(Math.random() * providers.length)];
    const address = addresses.find(a => a.user.userId === customer.userId) || addresses[0];
    
    const bookingStatus = statuses[Math.floor(Math.random() * statuses.length)];

    const b = dataSource.manager.create(Booking, {
      customer: customer,
      provider: provider,
      address: address,
      status: bookingStatus,
      date: faker.date.recent(),
      totalAmount: faker.number.int({ min: 100, max: 1000 }),
    });
    await dataSource.manager.save(b);

    // 10. Booking Services
    const numServices = faker.number.int({ min: 1, max: 3 });
    for (let j = 0; j < numServices; j++) {
      const s = services[Math.floor(Math.random() * services.length)];
      const bs = dataSource.manager.create(BookingService, {
        booking: b,
        service: s,
        serviceStatus: bookingStatus === 'COMPLETED' ? 'COMPLETED' : 'PENDING'
      });
      await dataSource.manager.save(bs);
    }

    // 11. Payments for Bookings
    const payment = dataSource.manager.create(Payment, {
      booking: b,
      paymentStatus: bookingStatus === 'COMPLETED' ? 'PAID' : 'UNPAID',
      method: 'CREDIT_CARD',
      amount: b.totalAmount,
      date: b.date,
    });
    await dataSource.manager.save(payment);

    // 12. Reviews for completed Bookings
    if (bookingStatus === 'COMPLETED') {
       const review = dataSource.manager.create(Review, {
         booking: b,
         rating: faker.number.int({ min: 3, max: 5 }),
         comment: getRandomReviewComment()
       });
       await dataSource.manager.save(review);
    }
    
    // Notification for booking
    const notif = dataSource.manager.create(Notification, {
      user: customer,
      title: `Booking ${bookingStatus}`,
      message: `Your booking status is now ${bookingStatus}`,
      type: NotificationType.BOOKING_CREATED,
      isRead: false,
    });
    await dataSource.manager.save(notif);
  }

  console.log('Seeded successfully!');
  await dataSource.destroy();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
