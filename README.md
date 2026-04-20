# Local Service Management System (LSM)

![LSM Banner](https://img.shields.io/badge/LSM-Local%20Service%20Management-blueviolet?style=for-the-badge)

A comprehensive, full-stack platform designed for orchestrating local services. Connecting customers with service providers seamlessly, managing everything from scheduling and bookings to payments and reviews.

---

## 🚀 Overview

The **Local Service Management System (LSM)** is built using a modern technology stack to ensure performance, scalability, and an excellent developer and user experience. 

### Key Features
* **Role-Based Access Control (RBAC):** Secure authentication and authorization using JWTs for Customers, Providers, and Admins.
* **Service Discovery:** Customers can browse, filter, and search across various service categories.
* **Booking & Scheduling:** Seamless calendar scheduling, booking management, and availability tracking.
* **Payments Integration:** Robust payment modules for handling transactions efficiently.
* **Review & Rating System:** Customers can leave feedback and rate providers ensuring a trusting community.
* **Live Notifications:** Real-time updates and notifications for booking status changes.

---

## 🛠️ Technology Stack

### Backend (`/backend`)
Built with **NestJS**, following an enterprise-grade modular architecture.
- **Framework:** [NestJS](https://nestjs.com/) (v11)
- **Database ORM:** [TypeORM](https://typeorm.io/)
- **Database:** MySQL
- **Authentication:** Passport.js (JWT strategies)
- **Data Seeding:** Fakel-js for easy development database population
- **Testing:** Jest & Supertest

### Frontend (`/frontend`)
Built with **Angular**, featuring a beautiful and responsive UI component library.
- **Framework:** [Angular](https://angular.dev/) (v21)
- **UI Components:** [PrimeNG](https://primeng.org/) 
- **Styling:** CSS & PrimeUI Themes
- **Data Visualization:** Chart.js & ng2-charts for analytics dashboards
- **Testing:** Vitest

---

## 📂 Project Structure

```text
├── backend/                  # NestJS API application
│   ├── src/
│   │   ├── common/           # Decorators, Enums, Interfaces, Guards
│   │   ├── entities/         # TypeORM Database Entities (User, Booking, Payment, etc.)
│   │   └── modules/          # Feature Modules
│   │       ├── addresses/    # Handling physical locations
│   │       ├── auth/         # Authentication & Authorization
│   │       ├── bookings/     # Booking orchestration
│   │       ├── categories/   # Service categorization
│   │       ├── notification/ # In-app notifications
│   │       ├── payments/     # Transactions processing
│   │       ├── reviews/      # Customer feedback system
│   │       ├── schedules/    # Provider availability
│   │       ├── services/     # Core services listing
│   │       └── users/        # User profile management
│   └── test/                 # E2E test suites
│
├── frontend/                 # Angular SPA Web application
│   └── src/
│       ├── app/
│       │   ├── core/         # Core singletons, interceptors, and services
│       │   ├── features/     # Smart components and lazy-loaded modules
│       │   └── layout/       # Structural UI (Headers, Footers, Sidebars)
│       └── environments/     # Environment specific configurations
│
└── README.md                 # Project documentation
```

---

## 💻 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
* [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
* [npm](https://www.npmjs.com/)
* [MySQL](https://www.mysql.com/) server running locally or remotely

### 🔧 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your database connection inside your NestJS environment/ORM configuration files.
4. (Optional) Run database seeders if you want dummy data to test UI components out of the box.
5. Start the development server:
   ```bash
   npm run start:dev
   ```
   *The API will typically be exposed at `http://localhost:3000`.*

### 🎨 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Angular development server:
   ```bash
   npm run start
   ```
   *The application will automatically reload if you change any of the source files. Access it at `http://localhost:4200`.*

---

## 🧪 Testing

### Backend tests
```bash
cd backend
npm run test         # Unit tests
npm run test:e2e     # End-to-end tests
npm run test:cov     # Coverage report
```

### Frontend tests
```bash
cd frontend
npm run test         # Unit testing with Vitest
```

---

## 📝 License

This project is [UNLICENSED](UNLICENSED). All rights reserved.