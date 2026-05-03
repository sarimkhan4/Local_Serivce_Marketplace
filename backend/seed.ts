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

  // 2. Services - 50+ services per category
  const services: Service[] = [];
  
  // Define services for each category
  const categoryServices: { [key: string]: string[] } = {
    'Cleaning': [
      'Home Deep Cleaning', 'Office Deep Cleaning', 'Carpet Steam Cleaning', 'Upholstery Cleaning',
      'Window Cleaning', 'Floor Polishing', 'Kitchen Cleaning', 'Bathroom Deep Cleaning',
      'Post-Construction Cleaning', 'Move-In/Move-Out Cleaning', 'Disinfection Service', 'Pressure Washing',
      'Garage Cleaning', 'Basement Cleaning', 'Attic Cleaning', 'Deck Cleaning',
      'Patio Cleaning', 'Driveway Cleaning', 'Gutter Cleaning', 'Chandelier Cleaning',
      'Air Duct Cleaning', 'Dryer Vent Cleaning', 'Blind Cleaning', 'Rug Cleaning',
      'Mattress Cleaning', 'Tile & Grout Cleaning', 'Wood Floor Refinishing', 'Marble Polishing',
      'Stain Removal', 'Odor Removal', 'Sanitization Service', 'Green Cleaning',
      'Commercial Kitchen Cleaning', 'Restaurant Cleaning', 'Retail Store Cleaning', 'Warehouse Cleaning',
      'Medical Facility Cleaning', 'School Cleaning', 'Gym Cleaning', 'Hotel Cleaning',
      'Event Cleanup', 'Party Cleanup', 'Construction Debris Removal', 'Waste Disposal',
      'Recycling Service', 'Hazardous Waste Removal', 'Biohazard Cleaning', 'Crime Scene Cleaning',
      'Fire Damage Cleaning', 'Water Damage Restoration', 'Mold Remediation', 'Asbestos Removal'
    ],
    'Plumbing': [
      'Pipe Installation', 'Pipe Repair', 'Drain Cleaning', 'Water Heater Installation',
      'Water Heater Repair', 'Toilet Installation', 'Toilet Repair', 'Faucet Installation',
      'Faucet Repair', 'Shower Installation', 'Shower Repair', 'Bathtub Installation',
      'Bathtub Repair', 'Sink Installation', 'Sink Repair', 'Garbage Disposal Installation',
      'Garbage Disposal Repair', 'Sump Pump Installation', 'Sump Pump Repair', 'Sewer Line Cleaning',
      'Sewer Line Repair', 'Water Line Installation', 'Water Line Repair', 'Gas Line Installation',
      'Gas Line Repair', 'Backflow Prevention', 'Hydro Jetting', 'Camera Inspection',
      'Leak Detection', 'Pipe Insulation', 'Pipe Relining', 'Trenchless Pipe Repair',
      'Emergency Plumbing', '24/7 Plumbing Service', 'Commercial Plumbing', 'Residential Plumbing',
      'Plumbing Inspection', 'Plumbing Maintenance', 'Water Treatment', 'Water Softener Installation',
      'Water Filter Installation', 'Reverse Osmosis', 'UV Water Purification', 'Well Pump Service',
      'Septic Tank Service', 'Grease Trap Cleaning', 'Boiler Installation', 'Boiler Repair',
      'Radiant Heating', 'Radiant Floor Heating', 'Hydronic Heating', 'Steam Heating',
      'Hot Water Recirculation', 'Pressure Regulator', 'Expansion Tank', 'Water Pressure Test'
    ],
    'Electrical': [
      'Electrical Panel Installation', 'Electrical Panel Upgrade', 'Circuit Breaker Replacement', 'Fuse Box Replacement',
      'Wiring Installation', 'Rewiring', 'Outlet Installation', 'Outlet Repair',
      'Switch Installation', 'Switch Repair', 'Light Fixture Installation', 'Light Fixture Repair',
      'Ceiling Fan Installation', 'Ceiling Fan Repair', 'Generator Installation', 'Generator Repair',
      'Generator Maintenance', 'Transfer Switch Installation', 'Surge Protector Installation', 'Whole House Surge Protection',
      'Electrical Inspection', 'Electrical Troubleshooting', 'Code Compliance', 'Electrical Permit Service',
      'Security Wiring', 'Camera Installation', 'Intercom Installation', 'Doorbell Installation',
      'Smoke Detector Installation', 'Carbon Monoxide Detector Installation', 'Emergency Lighting', 'Exit Sign Installation',
      'LED Lighting Installation', 'Landscape Lighting', 'Pathway Lighting', 'Deck Lighting',
      'Pool Lighting', 'Hot Tub Wiring', 'Sauna Wiring', 'Home Theater Wiring',
      'Network Wiring', 'Data Cable Installation', 'Phone Line Installation', 'Cable TV Wiring',
      'Solar Panel Installation', 'Solar Panel Maintenance', 'Wind Turbine Installation', 'Battery Backup System',
      'EV Charger Installation', 'Tesla Charger Installation', 'Level 2 Charger', 'Charging Station Installation',
      'Electrical Vehicle Outlet', 'Smart Home Wiring', 'Automation System', 'Home Automation',
      'Commercial Electrical', 'Industrial Electrical', 'Motor Installation', 'Motor Repair',
      'Control Panel Wiring', 'PLC Programming', 'Machine Wiring', 'Equipment Installation'
    ],
    'Painting': [
      'Interior Painting', 'Exterior Painting', 'Wall Painting', 'Ceiling Painting',
      'Trim Painting', 'Door Painting', 'Window Painting', 'Cabinet Painting',
      'Fence Painting', 'Deck Staining', 'Deck Painting', 'Siding Painting',
      'Garage Door Painting', 'Shutter Painting', 'Gutter Painting', 'Metal Painting',
      'Wood Staining', 'Wood Finishing', 'Varnishing', 'Lacquer Application',
      'Wallpaper Installation', 'Wallpaper Removal', 'Texture Application', 'Popcorn Ceiling Removal',
      'Drywall Repair', 'Plaster Repair', 'Wall Preparation', 'Surface Preparation',
      'Pressure Washing', 'Sandblasting', 'Lead Paint Removal', 'Asbestos Paint Removal',
      'Color Consultation', 'Paint Selection', 'Custom Painting', 'Faux Painting',
      'Mural Painting', 'Decorative Painting', 'Stencil Painting', 'Concrete Painting',
      'Epoxy Floor Coating', 'Garage Floor Coating', 'Concrete Staining', 'Concrete Sealing',
      'Commercial Painting', 'Industrial Painting', 'Warehouse Painting', 'Office Painting',
      'Retail Painting', 'Restaurant Painting', 'Hotel Painting', 'Hospital Painting',
      'School Painting', 'Church Painting', 'Government Building Painting', 'Multi-Family Painting',
      'Historic Building Painting', 'Restoration Painting', 'Antique Painting', 'Art Conservation',
      'Spray Painting', 'Roller Painting', 'Brush Painting', 'Airless Spraying',
      'HVLP Spraying', 'Electrostatic Painting', 'Powder Coating', 'Automotive Painting'
    ],
    'Landscaping': [
      'Lawn Mowing', 'Lawn Edging', 'Lawn Fertilizing', 'Lawn Aeration',
      'Lawn Seeding', 'Sod Installation', 'Weed Control', 'Mulch Installation',
      'Garden Design', 'Garden Installation', 'Garden Maintenance', 'Flower Bed Installation',
      'Tree Planting', 'Tree Removal', 'Tree Trimming', 'Tree Pruning',
      'Shrub Planting', 'Shrub Trimming', 'Shrub Pruning', 'Hedge Trimming',
      'Landscape Design', 'Landscape Installation', 'Landscape Maintenance', 'Xeriscaping',
      'Irrigation Installation', 'Irrigation Repair', 'Sprinkler System', 'Drip Irrigation',
      'Drainage Installation', 'French Drain', 'Grading', 'Erosion Control',
      'Patio Installation', 'Walkway Installation', 'Driveway Installation', 'Retaining Wall',
      'Fire Pit Installation', 'Outdoor Kitchen', 'Water Feature Installation', 'Pond Installation',
      'Fence Installation', 'Gate Installation', 'Deck Installation', 'Pergola Installation',
      'Gazebo Installation', 'Shed Installation', 'Greenhouse Installation', 'Playground Installation',
      'Lighting Installation', 'Pathway Lighting', 'Uplighting', 'Downlighting',
      'Commercial Landscaping', 'Industrial Landscaping', 'HOA Landscaping', 'Apartment Landscaping',
      'Office Landscaping', 'Retail Landscaping', 'Restaurant Landscaping', 'Hotel Landscaping',
      'Park Maintenance', 'Sports Field Maintenance', 'Golf Course Maintenance', 'Cemetery Maintenance',
      'Snow Removal', 'Ice Management', 'Debris Removal', 'Storm Cleanup',
      'Soil Testing', 'Soil Amendment', 'Composting', 'Organic Gardening',
      'Pest Control', 'Disease Control', 'Weed Management', 'Integrated Pest Management'
    ],
    'Pest Control': [
      'Termite Inspection', 'Termite Treatment', 'Termite Prevention', 'Termite Baiting',
      'Termite Fumigation', 'Bed Bug Treatment', 'Bed Bug Heat Treatment', 'Bed Bug Chemical Treatment',
      'Bed Bug Inspection', 'Bed Bug Prevention', 'Cockroach Control', 'Roach Baiting',
      'Roach Fumigation', 'Ant Control', 'Fire Ant Treatment', 'Carpenter Ant Treatment',
      'Spider Control', 'Black Widow Control', 'Brown Recluse Control', 'Wasp Removal',
      'Bee Removal', 'Hornet Removal', 'Yellow Jacket Removal', 'Mosquito Control',
      'Mosquito Fogging', 'Mosquito Larvicide', 'Mosquito Misting System', 'Fly Control',
      'Flea Treatment', 'Flea Prevention', 'Tick Control', 'Tick Prevention',
      'Rodent Control', 'Mouse Control', 'Rat Control', 'Rat Exclusion',
      'Squirrel Removal', 'Raccoon Removal', 'Bat Removal', 'Bird Control',
      'Pigeon Control', 'Sparrow Control', 'Starling Control', 'Wildlife Removal',
      'Wildlife Exclusion', 'Animal Damage Repair', 'Dead Animal Removal', 'Odor Removal',
      'General Pest Control', 'Quarterly Pest Control', 'Monthly Pest Control', 'One-Time Pest Control',
      'Emergency Pest Control', '24/7 Pest Control', 'Commercial Pest Control', 'Industrial Pest Control',
      'Restaurant Pest Control', 'Food Service Pest Control', 'Healthcare Pest Control', 'School Pest Control',
      'Hotel Pest Control', 'Multi-Family Pest Control', 'Warehouse Pest Control', 'Retail Pest Control',
      'Office Pest Control', 'Government Building Pest Control', 'Airport Pest Control', 'Port Pest Control',
      'Organic Pest Control', 'Green Pest Control', 'Eco-Friendly Pest Control', 'Non-Toxic Pest Control',
      'IPM Program', 'Pest Inspection', 'Pest Identification', 'Pest Monitoring',
      'Structural Repair', 'Caulking', 'Sealing', 'Exclusion Work',
      'Lawn Pest Control', 'Garden Pest Control', 'Tree Pest Control', 'Shrub Pest Control',
      'Stored Product Pest Control', 'Grain Pest Control', 'Food Storage Pest Control', 'Pantry Pest Control'
    ],
    'Roofing': [
      'Roof Inspection', 'Roof Repair', 'Roof Replacement', 'New Roof Installation',
      'Roof Maintenance', 'Roof Cleaning', 'Gutter Installation', 'Gutter Repair',
      'Gutter Cleaning', 'Downspout Installation', 'Downspout Repair', 'Roof Coating',
      'Roof Sealant', 'Roof Waterproofing', 'Leak Detection', 'Leak Repair',
      'Shingle Installation', 'Shingle Repair', 'Shingle Replacement', 'Metal Roof Installation',
      'Metal Roof Repair', 'Tile Roof Installation', 'Tile Roof Repair', 'Flat Roof Installation',
      'Flat Roof Repair', 'Rubber Roof Installation', 'Rubber Roof Repair', 'TPO Roof Installation',
      'TPO Roof Repair', 'EPDM Roof Installation', 'EPDM Roof Repair', 'Modified Bitumen Installation',
      'Modified Bitumen Repair', 'Built-Up Roof Installation', 'Built-Up Roof Repair', 'Foam Roof Installation',
      'Foam Roof Repair', 'Roof Ventilation', 'Ridge Vent Installation', 'Soffit Installation',
      'Fascia Installation', 'Rafter Installation', 'Truss Installation', 'Decking Installation',
      'Underlayment Installation', 'Ice Dam Protection', 'Snow Guard Installation', 'Roof Snow Removal',
      'Roof Deicing', 'Heat Cable Installation', 'Solar Roof Installation', 'Green Roof Installation',
      'Living Roof Installation', 'Cool Roof Installation', 'Energy Efficient Roof', 'Roof Insulation',
      'Attic Insulation', 'Attic Ventilation', 'Radiant Barrier Installation', 'Roof Deck Coating',
      'Commercial Roofing', 'Industrial Roofing', 'Residential Roofing', 'Multi-Family Roofing',
      'Historic Roof Restoration', 'Church Roof Repair', 'School Roof Repair', 'Hospital Roof Repair',
      'Warehouse Roof Repair', 'Office Roof Repair', 'Retail Roof Repair', 'Restaurant Roof Repair',
      'Hotel Roof Repair', 'Government Building Roof', 'Airport Roof', 'Stadium Roof',
      'Emergency Roof Repair', 'Storm Damage Repair', 'Hail Damage Repair', 'Wind Damage Repair',
      'Fire Damage Repair', 'Water Damage Repair', 'Insurance Claim Assistance', 'Roof Certification',
      'Roof Warranty Service', 'Roof Maintenance Program', 'Annual Roof Inspection', 'Roof Cleaning Service'
    ],
    'HVAC': [
      'AC Installation', 'AC Repair', 'AC Maintenance', 'AC Replacement',
      'Heating Installation', 'Heating Repair', 'Heating Maintenance', 'Heating Replacement',
      'Furnace Installation', 'Furnace Repair', 'Furnace Maintenance', 'Boiler Installation',
      'Boiler Repair', 'Boiler Maintenance', 'Heat Pump Installation', 'Heat Pump Repair',
      'Heat Pump Maintenance', 'Ductless Mini Split Installation', 'Ductless Mini Split Repair', 'Central Air Installation',
      'Central Air Repair', 'Central Air Maintenance', 'Window AC Installation', 'Window AC Repair',
      'Portable AC Service', 'Thermostat Installation', 'Thermostat Repair', 'Smart Thermostat Installation',
      'Programmable Thermostat', 'WiFi Thermostat', 'Zoning System Installation', 'Zoning System Repair',
      'Duct Work Installation', 'Duct Work Repair', 'Duct Cleaning', 'Duct Sealing',
      'Duct Insulation', 'Air Handler Installation', 'Air Handler Repair', 'Air Handler Maintenance',
      'Condenser Installation', 'Condenser Repair', 'Condenser Maintenance', 'Evaporator Coil Installation',
      'Evaporator Coil Repair', 'Evaporator Coil Maintenance', 'Compressor Installation', 'Compressor Repair',
      'Compressor Replacement', 'Refrigerant Recharge', 'Refrigerant Leak Detection', 'Refrigerant Leak Repair',
      'Air Filter Installation', 'Air Filter Replacement', 'Electronic Air Cleaner', 'UV Light Installation',
      'Humidifier Installation', 'Humidifier Repair', 'Dehumidifier Installation', 'Dehumidifier Repair',
      'Air Purifier Installation', 'Air Purifier Repair', 'Heat Recovery Ventilator', 'Energy Recovery Ventilator',
      'ERV Installation', 'HRV Installation', 'Ventilation System Installation', 'Ventilation System Repair',
      'Exhaust Fan Installation', 'Exhaust Fan Repair', 'Attic Fan Installation', 'Attic Fan Repair',
      'Whole House Fan Installation', 'Whole House Fan Repair', 'Solar Air Conditioning', 'Geothermal Heating',
      'Geothermal Cooling', 'Radiant Heating Installation', 'Radiant Heating Repair', 'Hydronic Heating',
      'Steam Heating Installation', 'Steam Heating Repair', 'Infrared Heating', 'Electric Heating',
      'Gas Heating Installation', 'Gas Heating Repair', 'Oil Heating Installation', 'Oil Heating Repair',
      'Propane Heating Installation', 'Propane Heating Repair', 'Commercial HVAC', 'Industrial HVAC',
      'Restaurant HVAC', 'Hospital HVAC', 'School HVAC', 'Office HVAC',
      'Retail HVAC', 'Warehouse HVAC', 'Multi-Family HVAC', 'Hotel HVAC',
      'Emergency HVAC Service', '24/7 HVAC Service', 'HVAC Inspection', 'HVAC Energy Audit',
      'HVAC Design', 'HVAC Consulting', 'HVAC Testing', 'HVAC Balancing'
    ],
    'Moving': [
      'Local Moving', 'Long Distance Moving', 'International Moving', 'Corporate Relocation',
      'Office Moving', 'Commercial Moving', 'Industrial Moving', 'Residential Moving',
      'Apartment Moving', 'Condo Moving', 'House Moving', 'Townhouse Moving',
      'Studio Moving', 'One Bedroom Moving', 'Two Bedroom Moving', 'Three Bedroom Moving',
      'Four Bedroom Moving', 'Five+ Bedroom Moving', 'Packing Services', 'Unpacking Services',
      'Full Service Moving', 'Self Service Moving', 'Labor Only Moving', 'Truck Rental',
      'Portable Storage', 'Moving Container', 'Climate Controlled Moving', 'White Glove Moving',
      'Art Moving', 'Antique Moving', 'Piano Moving', 'Safe Moving',
      'Hot Tub Moving', 'Pool Table Moving', 'Furniture Moving', 'Appliance Moving',
      'Electronics Moving', 'IT Equipment Moving', 'Medical Equipment Moving', 'Industrial Equipment Moving',
      'Vehicle Transport', 'Car Shipping', 'Motorcycle Transport', 'Boat Transport',
      'RV Transport', 'Trailer Transport', 'Heavy Equipment Transport', 'Machinery Transport',
      'Storage Services', 'Short Term Storage', 'Long Term Storage', 'Climate Controlled Storage',
      'Moving Supplies', 'Boxes', 'Packing Paper', 'Bubble Wrap',
      'Packing Tape', 'Moving Blankets', 'Dollies', 'Hand Trucks',
      'Furniture Pads', 'Stretch Wrap', 'Mattress Bags', 'Wardrobe Boxes',
      'Crating Services', 'Custom Crating', 'Art Crating', 'Electronics Crating',
      'Furniture Disassembly', 'Furniture Assembly', 'Installation Services', 'Setup Services',
      'Debris Removal', 'Junk Removal', 'Clean Out Services', 'Estate Clean Out',
      'Foreclosure Clean Out', 'Eviction Clean Out', 'Hoarding Clean Out', 'Disaster Recovery',
      'Emergency Moving', 'Last Minute Moving', 'Weekend Moving', 'Holiday Moving',
      'Night Moving', 'Early Morning Moving', 'Flexible Scheduling', 'Same Day Moving',
      'Express Moving', ' expedited Moving', 'Priority Moving', 'VIP Moving',
      'Military Moving', 'Government Moving', 'Senior Moving', 'Student Moving',
      'Corporate Housing', 'Temporary Housing', 'Relocation Services', 'Destination Services'
    ],
    'Appliance Repair': [
      'Refrigerator Repair', 'Freezer Repair', 'Ice Maker Repair', 'Water Dispenser Repair',
      'Oven Repair', 'Stove Repair', 'Cooktop Repair', 'Range Repair',
      'Microwave Repair', 'Dishwasher Repair', 'Garbage Disposal Repair', 'Compactor Repair',
      'Washing Machine Repair', 'Dryer Repair', 'Washer Dryer Combo Repair', 'Stackable Washer Dryer Repair',
      'Front Load Washer Repair', 'Top Load Washer Repair', 'Gas Dryer Repair', 'Electric Dryer Repair',
      'Air Conditioner Repair', 'Window AC Repair', 'Portable AC Repair', 'Dehumidifier Repair',
      'Humidifier Repair', 'Air Purifier Repair', 'Fan Repair', 'Heater Repair',
      'Space Heater Repair', 'Baseboard Heater Repair', 'Wall Heater Repair', 'Central Heating Repair',
      'Water Heater Repair', 'Tankless Water Heater Repair', 'Electric Water Heater Repair', 'Gas Water Heater Repair',
      'Solar Water Heater Repair', 'Boiler Repair', 'Furnace Repair', 'Heat Pump Repair',
      'Freezer Repair', 'Ice Machine Repair', 'Wine Cooler Repair', 'Beverage Cooler Repair',
      'Trash Compactor Repair', 'Garbage Disposal Installation', 'Garbage Disposal Replacement', 'Dishwasher Installation',
      'Dishwasher Replacement', 'Microwave Installation', 'Microwave Replacement', 'Oven Installation',
      'Oven Replacement', 'Stove Installation', 'Stove Replacement', 'Cooktop Installation',
      'Cooktop Replacement', 'Range Installation', 'Range Replacement', 'Refrigerator Installation',
      'Refrigerator Replacement', 'Freezer Installation', 'Freezer Replacement', 'Ice Maker Installation',
      'Ice Maker Replacement', 'Washing Machine Installation', 'Washing Machine Replacement', 'Dryer Installation',
      'Dryer Replacement', 'AC Installation', 'AC Replacement', 'Water Heater Installation',
      'Water Heater Replacement', 'Appliance Maintenance', 'Appliance Inspection', 'Appliance Cleaning',
      'Vent Hood Cleaning', 'Dryer Vent Cleaning', 'Coil Cleaning', 'Condenser Cleaning',
      'Filter Replacement', 'Door Seal Replacement', 'Gasket Replacement', 'Hinge Replacement',
      'Timer Replacement', 'Thermostat Replacement', 'Heating Element Replacement', 'Motor Replacement',
      'Pump Replacement', 'Valve Replacement', 'Switch Replacement', 'Cord Replacement',
      'Control Board Replacement', 'Sensor Replacement', 'Light Bulb Replacement', 'Glass Replacement',
      'Shelf Replacement', 'Drawer Replacement', 'Rack Replacement', 'Basket Replacement',
      'Commercial Appliance Repair', 'Restaurant Equipment Repair', 'Industrial Appliance Repair', 'Medical Equipment Repair',
      'Laundry Equipment Repair', 'Kitchen Equipment Repair', 'HVAC Repair', 'Refrigeration Repair'
    ],
    'Carpentry': [
      'Custom Cabinet Installation', 'Kitchen Cabinet Installation', 'Bathroom Cabinet Installation', 'Closet Installation',
      'Bookshelf Installation', 'Entertainment Center Installation', 'Storage Solutions', 'Custom Shelving',
      'Wood Floor Installation', 'Hardwood Floor Refinishing', 'Laminate Floor Installation', 'Vinyl Floor Installation',
      'Trim Installation', 'Baseboard Installation', 'Crown Molding Installation', 'Chair Rail Installation',
      'Door Installation', 'Door Repair', 'Window Installation', 'Window Repair',
      'Deck Building', 'Patio Building', 'Porch Building', 'Gazebo Building',
      'Fence Installation', 'Fence Repair', 'Gate Installation', 'Gate Repair',
      'Stair Installation', 'Stair Repair', 'Railing Installation', 'Railing Repair',
      'Built-in Furniture', 'Custom Furniture', 'Furniture Repair', 'Furniture Restoration',
      'Woodworking', 'Custom Woodwork', 'Finish Carpentry', 'Rough Carpentry',
      'Framing', 'Wall Framing', 'Floor Framing', 'Roof Framing',
      'Siding Installation', 'Siding Repair', 'Soffit Installation', 'Fascia Installation',
      'Drywall Installation', 'Drywall Repair', 'Texture Application', 'Painting Preparation',
      'Bathroom Remodeling', 'Kitchen Remodeling', 'Basement Finishing', 'Attic Finishing',
      'Home Additions', 'Room Additions', 'Garage Conversion', 'Basement Conversion',
      'Custom Built-ins', 'Window Seats', 'Benches', 'Storage Benches',
      'Murphy Beds', 'Loft Beds', 'Bunk Beds', 'Platform Beds',
      'Desks', 'Tables', 'Chairs', 'Custom Tables',
      'Wood Staining', 'Wood Sealing', 'Wood Polishing', 'Wood Restoration',
      'Antique Furniture Repair', 'Furniture Refinishing', 'Upholstery Work', 'Fabric Installation',
      'Commercial Carpentry', 'Office Fit-out', 'Retail Fixtures', 'Display Cases',
      'Counter Installation', 'Butcher Block Installation', 'Concrete Countertops', 'Solid Surface Countertops',
      'Backsplash Installation', 'Tile Backsplash', 'Glass Backsplash', 'Metal Backsplash',
      'Custom Millwork', 'Molding Installation', 'Paneling Installation', 'Wainscoting',
      'Beadboard Installation', 'Shiplap Installation', 'Plank Wall Installation', 'Accent Wall',
      'Exterior Carpentry', 'Outdoor Structures', 'Pergola Building', 'Arbor Building',
      'Trellis Building', 'Planter Box Building', 'Raised Garden Beds', 'Outdoor Kitchen',
      'Fire Pit Building', 'Outdoor Seating', 'Deck Railing', 'Stair Railing',
      'Balcony Repair', 'Porch Repair', 'Screened Porch', 'Sunroom Addition'
    ],
    'Masonry': [
      'Bricklaying', 'Block laying', 'Stone Masonry', 'Concrete Work',
      'Foundation Repair', 'Foundation Installation', 'Basement Waterproofing', 'Crack Repair',
      'Chimney Repair', 'Chimney Installation', 'Fireplace Construction', 'Fireplace Repair',
      'Retaining Wall Construction', 'Garden Wall Building', 'Stone Wall Building', 'Block Wall Building',
      'Patio Installation', 'Walkway Installation', 'Driveway Installation', 'Sidewalk Installation',
      'Stair Installation', 'Concrete Stairs', 'Stone Steps', 'Brick Steps',
      'Tuckpointing', 'Mortar Repair', 'Brick Repair', 'Stone Repair',
      'Concrete Resurfacing', 'Concrete Staining', 'Concrete Stamping', 'Concrete Polishing',
      'Epoxy Flooring', 'Polished Concrete', 'Decorative Concrete', 'Stamped Concrete',
      'Masonry Restoration', 'Historic Masonry', 'Brick Restoration', 'Stone Restoration',
      'Waterproofing', 'Sealant Application', 'Joint Sealing', 'Crack Injection',
      'Demolition', 'Concrete Removal', 'Brick Removal', 'Block Removal',
      'Site Preparation', 'Excavation', 'Grading', 'Compaction',
      'Formwork', 'Concrete Forming', 'Reinforcement', 'Rebar Installation',
      'Concrete Pumping', 'Concrete Delivery', 'Ready Mix Concrete', 'Concrete Testing',
      'Masonry Cleaning', 'Pressure Washing', 'Chemical Cleaning', 'Sandblasting',
      'Masonry Sealing', 'Water Repellent', 'Penetrating Sealer', 'Coating Application',
      'Masonry Inspection', 'Structural Assessment', 'Safety Inspection', 'Code Compliance',
      'Commercial Masonry', 'Industrial Masonry', 'Residential Masonry', 'Institutional Masonry',
      'Masonry Design', 'Custom Masonry', 'Architectural Masonry', 'Decorative Masonry',
      'Masonry Consulting', 'Masonry Engineering', 'Structural Engineering', 'Building Inspection',
      'Masonry Repair', 'Tuckpointing Repair', 'Mortar Matching', 'Color Matching',
      'Historic Preservation', 'Landmark Restoration', 'Antique Masonry', 'Period Restoration',
      'Masonry Maintenance', 'Preventive Maintenance', 'Routine Inspection', 'Annual Service',
      'Emergency Masonry', 'Storm Damage Repair', 'Water Damage Repair', 'Fire Damage Repair',
      'Masonry Restoration', 'Facade Restoration', 'Building Envelope', 'Exterior Restoration',
      'Masonry Cleaning', 'Gentle Cleaning', 'Low Pressure Washing', 'Chemical-Free Cleaning',
      'Masonry Protection', 'Waterproofing Systems', 'Drainage Systems', 'Moisture Control',
      'Masonry Reinforcement', 'Helical Tie Installation', 'Carbon Fiber Installation', 'Steel Reinforcement'
    ],
    'Flooring': [
      'Hardwood Floor Installation', 'Laminate Floor Installation', 'Vinyl Floor Installation', 'Tile Floor Installation',
      'Carpet Installation', 'Bamboo Floor Installation', 'Cork Floor Installation', 'Linoleum Installation',
      'Engineered Wood Installation', 'Solid Wood Installation', 'Parquet Floor Installation', 'Herringbone Installation',
      'Floor Refinishing', 'Hardwood Refinishing', 'Floor Sanding', 'Floor Polishing',
      'Floor Staining', 'Floor Sealing', 'Floor Waxing', 'Floor Cleaning',
      'Tile Installation', 'Ceramic Tile', 'Porcelain Tile', 'Natural Stone Tile',
      'Marble Installation', 'Granite Installation', 'Travertine Installation', 'Slate Installation',
      'Mosaic Installation', 'Glass Tile Installation', 'Metal Tile Installation', 'Custom Tile Work',
      'Floor Repair', 'Scratch Repair', 'Dent Repair', 'Water Damage Repair',
      'Subfloor Installation', 'Subfloor Repair', 'Floor Leveling', 'Self-Leveling',
      'Underlayment Installation', 'Moisture Barrier', 'Soundproofing', 'Insulation',
      'Floor Preparation', 'Surface Preparation', 'Adhesive Application', 'Grout Installation',
      'Transition Installation', 'Baseboard Installation', 'Quarter Round', 'Threshold Installation',
      'Heated Floor Installation', 'Radiant Floor Heating', 'Floor Warming Systems', 'Underfloor Heating',
      'Sports Flooring', 'Gym Flooring', 'Basketball Court', 'Volleyball Court',
      'Commercial Flooring', 'Office Flooring', 'Retail Flooring', 'Restaurant Flooring',
      'Industrial Flooring', 'Warehouse Flooring', 'Factory Flooring', 'Garage Flooring',
      'Healthcare Flooring', 'Hospital Flooring', 'Clinic Flooring', 'Lab Flooring',
      'Educational Flooring', 'School Flooring', 'University Flooring', 'Library Flooring',
      'Hospitality Flooring', 'Hotel Flooring', 'Resort Flooring', 'Conference Room Flooring',
      'Residential Flooring', 'Home Flooring', 'Apartment Flooring', 'Condo Flooring',
      'Floor Restoration', 'Historic Floor Restoration', 'Antique Floor Restoration', 'Period Floor Restoration',
      'Floor Maintenance', 'Floor Cleaning', 'Floor Stripping', 'Floor Waxing',
      'Floor Protection', 'Floor Coating', 'Floor Sealing', 'Floor Finishing',
      'Custom Flooring', 'Designer Flooring', 'Luxury Flooring', 'High-End Flooring',
      'Eco-Friendly Flooring', 'Sustainable Flooring', 'Green Flooring', 'Recycled Flooring',
      'Waterproof Flooring', 'Water-Resistant Flooring', 'Moisture-Resistant Flooring', 'Basement Flooring',
      'Allergy-Friendly Flooring', 'Hypoallergenic Flooring', 'Low-VOC Flooring', 'Non-Toxic Flooring',
      'Pet-Friendly Flooring', 'Scratch-Resistant Flooring', 'Durable Flooring', 'Heavy-Duty Flooring',
      'Floor Design', 'Floor Planning', 'Floor Layout', 'Pattern Installation'
    ],
    'Insulation': [
      'Attic Insulation', 'Wall Insulation', 'Crawl Space Insulation', 'Basement Insulation',
      'Fiberglass Insulation', 'Cellulose Insulation', 'Spray Foam Insulation', 'Rigid Foam Insulation',
      'Blown-In Insulation', 'Batt Insulation', 'Roll Insulation', 'Loose-Fill Insulation',
      'Insulation Removal', 'Insulation Replacement', 'Insulation Upgrade', 'Insulation Addition',
      'Energy Audit', 'Insulation Inspection', 'Insulation Assessment', 'Insulation Consulting',
      'Air Sealing', 'Weatherization', 'Draft Stopping', 'Thermal Barrier',
      'Vapor Barrier Installation', 'Moisture Barrier', 'Radiant Barrier', 'Reflective Insulation',
      'Sound Insulation', 'Acoustic Insulation', 'Noise Reduction', 'Soundproofing',
      'Fireproofing', 'Fire-Rated Insulation', 'Fire Barrier', 'Intumescent Coating',
      'Pipe Insulation', 'Duct Insulation', 'HVAC Insulation', 'Mechanical Insulation',
      'Tank Insulation', 'Equipment Insulation', 'Vessel Insulation', 'Industrial Insulation',
      'Refrigeration Insulation', 'Cold Storage', 'Freezer Insulation', 'Cooler Insulation',
      'Commercial Insulation', 'Industrial Insulation', 'Residential Insulation', 'Multi-Family Insulation',
      'New Construction Insulation', 'Retrofit Insulation', 'Renovation Insulation', 'Addition Insulation',
      'Green Insulation', 'Sustainable Insulation', 'Eco-Friendly Insulation', 'Recycled Insulation',
      'High-Performance Insulation', 'Energy-Efficient Insulation', 'Premium Insulation', 'Advanced Insulation',
      'Insulation Removal', 'Old Insulation Disposal', 'Insulation Cleanup', 'Insulation Remediation',
      'Insulation Testing', 'R-Value Testing', 'Thermal Imaging', 'Energy Analysis',
      'Insulation Repair', 'Insulation Patching', 'Insulation Restoration', 'Insulation Maintenance',
      'Insulation Installation', 'Professional Installation', 'Certified Installation', 'Quality Installation',
      'Insulation Products', 'Insulation Materials', 'Insulation Supplies', 'Insulation Equipment',
      'Insulation Services', 'Complete Insulation', 'Full-Service Insulation', 'Insulation Solutions',
      'Weatherization Services', 'Energy Efficiency', 'Energy Conservation', 'Energy Savings',
      'Home Performance', 'Building Performance', 'Envelope Improvement', 'Building Science',
      'Thermal Comfort', 'Indoor Air Quality', 'Moisture Control', 'Condensation Control',
      'Mold Prevention', 'Mildew Prevention', 'Pest Control', 'Rodent Protection',
      'Insulation Barriers', 'Thermal Barriers', 'Air Barriers', 'Moisture Barriers',
      'Insulation Systems', 'Integrated Systems', 'Complete Systems', 'Custom Systems',
      'Insulation Technology', 'Modern Insulation', 'Advanced Materials', 'Innovative Solutions',
      'Insulation Expertise', 'Professional Service', 'Expert Installation', 'Quality Workmanship'
    ],
    'Windows & Doors': [
      'Window Installation', 'Door Installation', 'Window Replacement', 'Door Replacement',
      'Window Repair', 'Door Repair', 'Window Maintenance', 'Door Maintenance',
      'Energy Efficient Windows', 'Energy Efficient Doors', 'High-Performance Windows', 'High-Performance Doors',
      'Double Pane Windows', 'Triple Pane Windows', 'Low-E Windows', 'Impact Windows',
      'Bay Windows', 'Bow Windows', 'Casement Windows', 'Double Hung Windows',
      'Sliding Windows', 'Picture Windows', 'Awning Windows', 'Hopper Windows',
      'Storm Windows', 'Storm Doors', 'Security Doors', 'Security Windows',
      'French Doors', 'Patio Doors', 'Sliding Glass Doors', 'Folding Doors',
      'Entry Doors', 'Front Doors', 'Back Doors', 'Side Doors',
      'Garage Doors', 'Overhead Doors', 'Roll-up Doors', 'Sectional Doors',
      'Window Frames', 'Door Frames', 'Frame Repair', 'Frame Replacement',
      'Window Glass', 'Door Glass', 'Glass Replacement', 'Glass Repair',
      'Window Screens', 'Door Screens', 'Screen Repair', 'Screen Replacement',
      'Window Hardware', 'Door Hardware', 'Hardware Installation', 'Hardware Repair',
      'Window Sealing', 'Door Sealing', 'Weather Stripping', 'Draft Proofing',
      'Window Insulation', 'Door Insulation', 'Thermal Windows', 'Insulated Doors',
      'Custom Windows', 'Custom Doors', 'Specialty Windows', 'Specialty Doors',
      'Historic Windows', 'Historic Doors', 'Restoration Windows', 'Restoration Doors',
      'Commercial Windows', 'Commercial Doors', 'Storefront Windows', 'Storefront Doors',
      'Automatic Doors', 'Revolving Doors', 'Sliding Doors', 'Folding Doors',
      'Access Control', 'Security Systems', 'Door Locks', 'Window Locks',
      'Window Treatments', 'Blinds Installation', 'Shades Installation', 'Shutter Installation',
      'Window Cleaning', 'Door Cleaning', 'Glass Cleaning', 'Exterior Cleaning',
      'Window Restoration', 'Door Restoration', 'Refinishing', 'Repainting',
      'Window Upgrades', 'Door Upgrades', 'Modernization', 'Retrofitting',
      'Window Consulting', 'Door Consulting', 'Design Services', 'Planning Services',
      'Window Measurement', 'Door Measurement', 'Custom Sizing', 'Precision Fitting',
      'Window Installation', 'Professional Installation', 'Certified Installation', 'Quality Installation',
      'Window Warranty', 'Door Warranty', 'Service Plans', 'Maintenance Plans',
      'Emergency Window Repair', 'Emergency Door Repair', '24/7 Service', 'Storm Damage Repair',
      'Window Glass Types', 'Door Glass Types', 'Tempered Glass', 'Laminated Glass',
      'Obscure Glass', 'Frosted Glass', 'Tinted Glass', 'Reflective Glass',
      'Decorative Glass', 'Stained Glass', 'Leaded Glass', 'Beveled Glass',
      'Window Grilles', 'Door Grilles', 'Decorative Elements', 'Architectural Details'
    ],
    'Gutter Cleaning': [
      'Gutter Cleaning', 'Gutter Inspection', 'Gutter Repair', 'Gutter Replacement',
      'Gutter Installation', 'Gutter Maintenance', 'Gutter Protection', 'Gutter Guards',
      'Downspout Cleaning', 'Downspout Repair', 'Downspout Installation', 'Downspout Replacement',
      'Gutter Sealing', 'Gutter Waterproofing', 'Gutter Coating', 'Gutter Painting',
      'Seamless Gutters', 'Sectional Gutters', 'Aluminum Gutters', 'Vinyl Gutters',
      'Steel Gutters', 'Copper Gutters', 'Zinc Gutters', 'Galvanized Gutters',
      'Commercial Gutter Cleaning', 'Industrial Gutter Cleaning', 'Residential Gutter Cleaning', 'Multi-Family Gutter Cleaning',
      'Gutter Debris Removal', 'Leaf Removal', 'Stick Removal', 'Roof Debris Cleaning',
      'Gutter Flushing', 'High-Pressure Cleaning', 'Low-Pressure Cleaning', 'Hand Cleaning',
      'Gutter Inspection', 'Structural Inspection', 'Leak Detection', 'Damage Assessment',
      'Gutter Repair', 'Leak Repair', 'Hole Repair', 'Crack Repair',
      'Gutter Replacement', 'Partial Replacement', 'Full Replacement', 'Section Replacement',
      'Gutter Installation', 'New Installation', 'Replacement Installation', 'Upgrade Installation',
      'Gutter Maintenance', 'Preventive Maintenance', 'Seasonal Cleaning', 'Annual Service',
      'Gutter Protection', 'Gutter Covers', 'Gutter Screens', 'Gutter Filters',
      'Gutter Guards', 'Leaf Guards', 'Debris Guards', 'Pest Guards',
      'Gutter Heating', 'Heat Tape Installation', 'Ice Dam Prevention', 'Snow Melting Systems',
      'Gutter Waterproofing', 'Sealant Application', 'Waterproof Coating', 'Protective Coating',
      'Gutter Restoration', 'Historic Gutter Repair', 'Antique Gutter Restoration', 'Period Restoration',
      'Gutter Cleaning Equipment', 'Professional Tools', 'Specialized Equipment', 'Safety Equipment',
      'Gutter Safety', 'Fall Protection', 'Safety Harness', 'Safety Training',
      'Gutter Access', 'Ladder Work', 'Scaffolding', 'Lift Equipment',
      'Gutter Services', 'Complete Service', 'Full-Service', 'Comprehensive Service',
      'Gutter Solutions', 'Custom Solutions', 'Tailored Solutions', 'Personalized Service',
      'Gutter Expertise', 'Professional Service', 'Expert Cleaning', 'Quality Workmanship',
      'Gutter Technology', 'Modern Equipment', 'Advanced Techniques', 'Innovative Methods',
      'Gutter Products', 'Gutter Materials', 'Gutter Supplies', 'Gutter Accessories',
      'Gutter Systems', 'Integrated Systems', 'Complete Systems', 'Custom Systems',
      'Gutter Consulting', 'Gutter Advice', 'Technical Support', 'Expert Guidance',
      'Gutter Planning', 'Service Planning', 'Maintenance Planning', 'Budget Planning',
      'Gutter Scheduling', 'Appointment Scheduling', 'Flexible Scheduling', 'Emergency Service',
      'Gutter Communication', 'Customer Service', 'Professional Communication', 'Clear Explanation',
      'Gutter Documentation', 'Service Reports', 'Inspection Reports', 'Photo Documentation',
      'Gutter Warranty', 'Service Guarantee', 'Quality Assurance', 'Customer Satisfaction'
    ],
    'Pressure Washing': [
      'House Washing', 'Building Washing', 'Exterior Cleaning', 'Facade Cleaning',
      'Driveway Cleaning', 'Sidewalk Cleaning', 'Patio Cleaning', 'Deck Cleaning',
      'Fence Cleaning', 'Wall Cleaning', 'Roof Cleaning', 'Gutter Cleaning',
      'Concrete Cleaning', 'Brick Cleaning', 'Stone Cleaning', 'Wood Cleaning',
      'Metal Cleaning', 'Vinyl Cleaning', 'Stucco Cleaning', 'Siding Cleaning',
      'Commercial Pressure Washing', 'Industrial Pressure Washing', 'Restaurant Cleaning', 'Gas Station Cleaning',
      'Parking Lot Cleaning', 'Garage Cleaning', 'Warehouse Cleaning', 'Factory Cleaning',
      'Fleet Washing', 'Vehicle Washing', 'Truck Washing', 'Equipment Washing',
      'Graffiti Removal', 'Stain Removal', 'Oil Stain Removal', 'Rust Removal',
      'Mold Removal', 'Mildew Removal', 'Algae Removal', 'Lichen Removal',
      'Surface Preparation', 'Paint Preparation', 'Staining Preparation', 'Sealing Preparation',
      'High-Pressure Washing', 'Low-Pressure Washing', 'Soft Washing', 'Gentle Cleaning',
      'Hot Water Washing', 'Cold Water Washing', 'Steam Cleaning', 'Chemical Cleaning',
      'Eco-Friendly Washing', 'Green Cleaning', 'Biodegradable Cleaning', 'Non-Toxic Cleaning',
      'Specialty Cleaning', 'Delicate Surface Cleaning', 'Historic Surface Cleaning', 'Antique Cleaning',
      'Emergency Cleaning', 'Storm Cleanup', 'Disaster Cleanup', 'Emergency Service',
      'Seasonal Cleaning', 'Spring Cleaning', 'Fall Cleaning', 'Annual Cleaning',
      'Maintenance Cleaning', 'Preventive Cleaning', 'Regular Service', 'Scheduled Service',
      'Deep Cleaning', 'Heavy-Duty Cleaning', 'Intensive Cleaning', 'Thorough Cleaning',
      'Gentle Washing', 'Delicate Washing', 'Soft Washing', 'Low-Pressure Washing',
      'Professional Washing', 'Expert Service', 'Quality Cleaning', 'Certified Service',
      'Pressure Washing Equipment', 'Professional Tools', 'Specialized Equipment', 'Modern Technology',
      'Pressure Washing Products', 'Cleaning Solutions', 'Detergents', 'Chemicals',
      'Pressure Washing Techniques', 'Advanced Methods', 'Innovative Solutions', 'Expert Techniques',
      'Pressure Washing Safety', 'Safety Equipment', 'Protective Gear', 'Safety Training',
      'Pressure Washing Consulting', 'Technical Advice', 'Expert Guidance', 'Professional Consultation',
      'Pressure Washing Planning', 'Service Planning', 'Project Planning', 'Custom Solutions',
      'Pressure Washing Inspection', 'Pre-Cleaning Inspection', 'Surface Assessment', 'Damage Evaluation',
      'Pressure Washing Restoration', 'Surface Restoration', 'Color Restoration', 'Appearance Restoration',
      'Pressure Washing Protection', 'Sealant Application', 'Protective Coating', 'Surface Treatment',
      'Pressure Washing Maintenance', 'Ongoing Service', 'Maintenance Plans', 'Service Contracts',
      'Pressure Washing Guarantee', 'Service Warranty', 'Quality Assurance', 'Customer Satisfaction',
      'Pressure Washing Communication', 'Professional Service', 'Customer Support', 'Expert Explanation'
    ],
    'Junk Removal': [
      'Junk Hauling', 'Debris Removal', 'Trash Removal', 'Waste Removal',
      'Garbage Removal', 'Rubbish Removal', 'Clutter Removal', 'Clean Out Services',
      'Estate Clean Out', 'Foreclosure Clean Out', 'Eviction Clean Out', 'Hoarding Clean Out',
      'Construction Debris Removal', 'Renovation Cleanup', 'Demolition Cleanup', 'Building Debris',
      'Yard Waste Removal', 'Landscape Debris', 'Tree Debris', 'Branch Removal',
      'Furniture Removal', 'Appliance Removal', 'Electronics Removal', 'Mattress Removal',
      'Carpet Removal', 'Flooring Removal', 'Tile Removal', 'Construction Materials',
      'Metal Recycling', 'Scrap Metal Removal', 'Aluminum Recycling', 'Steel Recycling',
      'E-Waste Recycling', 'Computer Recycling', 'Electronics Recycling', 'Battery Recycling',
      'Donation Pickup', 'Charity Donation', 'Reusable Items', 'Furniture Donation',
      'Recycling Services', 'Material Recovery', 'Waste Sorting', 'Separation Services',
      'Hazardous Waste Removal', 'Chemical Waste', 'Paint Disposal', 'Oil Disposal',
      'Commercial Junk Removal', 'Industrial Junk Removal', 'Office Clean Out', 'Retail Clean Out',
      'Restaurant Clean Out', 'Warehouse Clean Out', 'Factory Clean Out', 'Storage Unit Clean Out',
      'Residential Junk Removal', 'House Clean Out', 'Apartment Clean Out', 'Condo Clean Out',
      'Emergency Junk Removal', 'Same Day Service', 'Urgent Removal', 'Quick Service',
      'Heavy Item Removal', 'Piano Removal', 'Safe Removal', 'Hot Tub Removal',
      'Bulk Removal', 'Large Volume', 'Multiple Items', 'Complete Clean Out',
      'Specialty Removal', 'Difficult Items', 'Awkward Items', 'Heavy Items',
      'Professional Service', 'Expert Removal', 'Quality Service', 'Certified Service',
      'Junk Removal Equipment', 'Professional Tools', 'Specialized Equipment', 'Heavy-Duty Equipment',
      'Junk Removal Safety', 'Safety Equipment', 'Protective Gear', 'Safety Training',
      'Junk Removal Products', 'Recycling Materials', 'Reusable Items', 'Donation Items',
      'Junk Removal Techniques', 'Efficient Methods', 'Professional Techniques', 'Expert Methods',
      'Junk Removal Consulting', 'Expert Advice', 'Technical Support', 'Professional Guidance',
      'Junk Removal Planning', 'Service Planning', 'Project Planning', 'Custom Solutions',
      'Junk Removal Inspection', 'Pre-Removal Assessment', 'Item Evaluation', 'Volume Estimation',
      'Junk Removal Restoration', 'Space Restoration', 'Area Cleanup', 'Site Preparation',
      'Junk Removal Protection', 'Floor Protection', 'Property Protection', 'Damage Prevention',
      'Junk Removal Maintenance', 'Ongoing Service', 'Regular Removal', 'Scheduled Service',
      'Junk Removal Guarantee', 'Service Warranty', 'Quality Assurance', 'Customer Satisfaction',
      'Junk Removal Communication', 'Professional Service', 'Customer Support', 'Expert Explanation',
      'Junk Removal Documentation', 'Service Reports', 'Inventory Lists', 'Photo Documentation',
      'Junk Removal Scheduling', 'Appointment Scheduling', 'Flexible Scheduling', 'Emergency Service',
      'Junk Removal Pricing', 'Fair Pricing', 'Transparent Pricing', 'Free Estimates',
      'Junk Removal Environmental', 'Green Practices', 'Eco-Friendly', 'Sustainable Methods',
      'Junk Removal Community', 'Local Service', 'Community Support', 'Neighborhood Service'
    ],
    'Pool Maintenance': [
      'Pool Cleaning', 'Pool Maintenance', 'Pool Service', 'Pool Care',
      'Pool Opening', 'Pool Closing', 'Winterizing', 'Summerizing',
      'Pool Inspection', 'Pool Assessment', 'Pool Evaluation', 'Pool Analysis',
      'Pool Repair', 'Pool Restoration', 'Pool Renovation', 'Pool Upgrade',
      'Pool Equipment Repair', 'Pump Repair', 'Filter Repair', 'Heater Repair',
      'Pool Cleaning', 'Vacuuming', 'Skimming', 'Brushing',
      'Water Testing', 'Water Chemistry', 'Water Balancing', 'Water Treatment',
      'Chemical Service', 'Chlorine Service', 'pH Balancing', 'Algaecide Treatment',
      'Filter Cleaning', 'Filter Replacement', 'Cartridge Cleaning', 'Sand Filter Service',
      'Pump Service', 'Pump Maintenance', 'Pump Repair', 'Pump Replacement',
      'Heater Service', 'Heater Maintenance', 'Heater Repair', 'Heater Replacement',
      'Pool Leak Detection', 'Leak Repair', 'Crack Repair', 'Structural Repair',
      'Tile Repair', 'Tile Replacement', 'Grout Repair', 'Surface Repair',
      'Pool Resurfacing', 'Pool Refinishing', 'Pool Painting', 'Pool Coating',
      'Pool Equipment Installation', 'New Equipment', 'Equipment Upgrade', 'Modernization',
      'Pool Automation', 'Smart Pool Systems', 'Remote Control', 'Automated Systems',
      'Pool Lighting', 'Underwater Lighting', 'LED Lighting', 'Fiber Optic Lighting',
      'Pool Heating', 'Solar Heating', 'Heat Pump', 'Gas Heater',
      'Pool Covers', 'Cover Installation', 'Cover Repair', 'Cover Replacement',
      'Pool Safety', 'Safety Equipment', 'Fence Installation', 'Alarm Systems',
      'Commercial Pool Service', 'Hotel Pool Maintenance', 'Resort Pool Care', 'Public Pool Service',
      'Residential Pool Service', 'Home Pool Care', 'Backyard Pool', 'Private Pool',
      'Pool Consulting', 'Expert Advice', 'Technical Support', 'Professional Guidance',
      'Pool Products', 'Chemicals', 'Equipment', 'Accessories',
      'Pool Supplies', 'Cleaning Tools', 'Test Kits', 'Maintenance Items',
      'Pool Technology', 'Modern Equipment', 'Advanced Systems', 'Innovative Solutions',
      'Pool Safety', 'Water Safety', 'Equipment Safety', 'Chemical Safety',
      'Pool Environment', 'Eco-Friendly', 'Green Practices', 'Sustainable Methods',
      'Pool Training', 'Safety Training', 'Equipment Training', 'Chemical Training',
      'Pool Documentation', 'Service Records', 'Maintenance Logs', 'Chemical Logs',
      'Pool Scheduling', 'Regular Service', 'Scheduled Maintenance', 'Preventive Care',
      'Pool Emergency', 'Emergency Service', 'Urgent Repair', 'Quick Response',
      'Pool Quality', 'Professional Service', 'Expert Care', 'Quality Workmanship',
      'Pool Guarantee', 'Service Warranty', 'Quality Assurance', 'Customer Satisfaction',
      'Pool Communication', 'Customer Service', 'Professional Support', 'Expert Explanation',
      'Pool Planning', 'Service Planning', 'Maintenance Planning', 'Budget Planning',
      'Pool Inspection', 'Regular Inspection', 'Safety Inspection', 'Equipment Inspection',
      'Pool Restoration', 'Complete Restoration', 'Partial Restoration', 'Surface Restoration',
      'Pool Modernization', 'Equipment Upgrade', 'System Upgrade', 'Technology Update'
    ],
    'Tree Service': [
      'Tree Removal', 'Tree Trimming', 'Tree Pruning', 'Tree Cutting',
      'Tree Planting', 'Tree Transplanting', 'Tree Relocation', 'Tree Installation',
      'Tree Care', 'Tree Maintenance', 'Tree Health', 'Tree Treatment',
      'Tree Inspection', 'Tree Assessment', 'Tree Evaluation', 'Tree Analysis',
      'Stump Grinding', 'Stump Removal', 'Root Removal', 'Stump Treatment',
      'Emergency Tree Service', 'Storm Damage', 'Fallen Trees', 'Hazardous Trees',
      'Tree Cabling', 'Tree Bracing', 'Tree Support', 'Tree Stabilization',
      'Tree Fertilizing', 'Tree Feeding', 'Tree Nutrition', 'Soil Treatment',
      'Tree Disease Treatment', 'Pest Control', 'Insect Management', 'Fungus Treatment',
      'Tree Surgery', 'Arborist Service', 'Professional Tree Care', 'Certified Arborist',
      'Tree Consulting', 'Expert Advice', 'Technical Support', 'Professional Guidance',
      'Tree Risk Assessment', 'Safety Evaluation', 'Hazard Assessment', 'Risk Analysis',
      'Tree Preservation', 'Tree Conservation', 'Historic Trees', 'Protected Trees',
      'Tree Restoration', 'Tree Recovery', 'Tree Rehabilitation', 'Tree Revitalization',
      'Tree Pruning', 'Crown Thinning', 'Crown Reduction', 'Crown Cleaning',
      'Tree Shaping', 'Aesthetic Pruning', 'Decorative Pruning', 'Artistic Pruning',
      'Tree Planting', 'New Trees', 'Replacement Trees', 'Specimen Trees',
      'Tree Transplanting', 'Large Tree Moving', 'Mature Tree Relocation', 'Tree Spading',
      'Tree Removal', 'Selective Removal', 'Complete Removal', 'Partial Removal',
      'Tree Stump Work', 'Stump Grinding', 'Stump Removal', 'Root Grinding',
      'Tree Equipment', 'Professional Tools', 'Specialized Equipment', 'Safety Equipment',
      'Tree Safety', 'Fall Protection', 'Safety Harness', 'Safety Training',
      'Tree Products', 'Wood Chips', 'Mulch', 'Firewood',
      'Tree Services', 'Complete Service', 'Full-Service', 'Comprehensive Service',
      'Tree Solutions', 'Custom Solutions', 'Tailored Solutions', 'Personalized Service',
      'Tree Technology', 'Modern Equipment', 'Advanced Techniques', 'Innovative Methods',
      'Tree Expertise', 'Professional Service', 'Expert Care', 'Quality Workmanship',
      'Tree Documentation', 'Service Reports', 'Inspection Reports', 'Photo Documentation',
      'Tree Scheduling', 'Appointment Scheduling', 'Flexible Scheduling', 'Emergency Service',
      'Tree Communication', 'Customer Service', 'Professional Support', 'Expert Explanation',
      'Tree Planning', 'Service Planning', 'Project Planning', 'Custom Planning',
      'Tree Environmental', 'Eco-Friendly', 'Green Practices', 'Sustainable Methods',
      'Tree Community', 'Local Service', 'Community Support', 'Neighborhood Service',
      'Tree Regulations', 'Compliance', 'Permits', 'Legal Requirements',
      'Tree Insurance', 'Liability Coverage', 'Protection', 'Risk Management',
      'Tree Quality', 'Professional Service', 'Expert Care', 'Quality Workmanship',
      'Tree Guarantee', 'Service Warranty', 'Quality Assurance', 'Customer Satisfaction'
    ],
    'Snow Removal': [
      'Snow Plowing', 'Snow Removal', 'Snow Clearing', 'Snow Hauling',
      'Ice Removal', 'Ice Control', 'Ice Melting', 'Ice Prevention',
      'Salting Services', 'Deicing', 'Anti-Icing', 'Pre-Treatment',
      'Snow Shoveling', 'Snow Blowing', 'Snow Brooming', 'Snow Raking',
      'Roof Snow Removal', 'Roof Ice Removal', 'Ice Dam Prevention', 'Roof Clearing',
      'Sidewalk Clearing', 'Walkway Clearing', 'Path Clearing', 'Trail Clearing',
      'Driveway Clearing', 'Parking Lot Clearing', 'Commercial Clearing', 'Industrial Clearing',
      'Emergency Snow Removal', 'Storm Response', '24/7 Service', 'Urgent Service',
      'Snow Management', 'Snow Control', 'Snow Monitoring', 'Snow Planning',
      'Snow Equipment', 'Plow Trucks', 'Snow Blowers', 'Salt Spreaders',
      'Snow Products', 'Rock Salt', 'Calcium Chloride', 'Magnesium Chloride',
      'Snow Safety', 'Safety Equipment', 'Protective Gear', 'Safety Training',
      'Snow Consulting', 'Expert Advice', 'Technical Support', 'Professional Guidance',
      'Snow Inspection', 'Pre-Storm Inspection', 'Site Assessment', 'Risk Evaluation',
      'Snow Documentation', 'Service Records', 'Storm Reports', 'Photo Documentation',
      'Snow Scheduling', 'Storm Tracking', 'Weather Monitoring', 'Service Planning',
      'Snow Communication', 'Customer Service', 'Professional Support', 'Expert Explanation',
      'Snow Environmental', 'Eco-Friendly', 'Green Practices', 'Sustainable Methods',
      'Snow Technology', 'Modern Equipment', 'Advanced Techniques', 'Innovative Methods',
      'Snow Expertise', 'Professional Service', 'Expert Care', 'Quality Workmanship',
      'Snow Guarantee', 'Service Warranty', 'Quality Assurance', 'Customer Satisfaction',
      'Snow Contracts', 'Seasonal Service', 'Annual Contracts', 'Service Agreements',
      'Snow Monitoring', 'Weather Alerts', 'Storm Warnings', 'Service Notifications',
      'Snow Preparation', 'Pre-Storm Preparation', 'Equipment Readiness', 'Supply Stocking',
      'Snow Response', 'Quick Response', 'Fast Service', 'Efficient Service',
      'Snow Quality', 'Professional Service', 'Expert Care', 'Quality Workmanship',
      'Snow Community', 'Local Service', 'Community Support', 'Neighborhood Service',
      'Snow Regulations', 'Compliance', 'Permits', 'Legal Requirements',
      'Snow Insurance', 'Liability Coverage', 'Protection', 'Risk Management',
      'Snow Products', 'Deicing Materials', 'Anti-Icing Products', 'Snow Removal Tools',
      'Snow Equipment', 'Plows', 'Blowers', 'Spreaders',
      'Snow Vehicles', 'Trucks', 'Loaders', 'Equipment',
      'Snow Storage', 'Snow Hauling', 'Snow Disposal', 'Snow Management',
      'Snow Training', 'Safety Training', 'Equipment Training', 'Weather Training',
      'Snow Planning', 'Service Planning', 'Emergency Planning', 'Contingency Planning',
      'Snow Coordination', 'Team Coordination', 'Equipment Coordination', 'Service Coordination',
      'Snow Logistics', 'Equipment Management', 'Supply Management', 'Resource Management',
      'Snow Operations', 'Field Operations', 'Service Operations', 'Emergency Operations',
      'Snow Management', 'Complete Management', 'Full-Service Management', 'Comprehensive Management',
      'Snow Solutions', 'Custom Solutions', 'Tailored Solutions', 'Personalized Service'
    ]
  };

  // Generate services for each category
  for (const category of categories) {
    const categoryName = category.categoryName;
    const serviceList = categoryServices[categoryName] || [];
    
    // Create 50+ services for each category
    for (let i = 0; i < Math.min(55, serviceList.length); i++) {
      const serviceName = serviceList[i];
      let s = await dataSource.manager.findOne(Service, { where: { name: serviceName } });
      if (!s) {
        s = dataSource.manager.create(Service, {
          name: serviceName,
          description: `Professional ${serviceName.toLowerCase()} service with quality assurance and customer satisfaction guarantee`,
          category: category,
        });
        await dataSource.manager.save(s);
      }
      services.push(s);
    }
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
        title: 'Welcome to your Local Service Marketplace',
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
