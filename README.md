# Local Service Management System (LSM)

![LSM Banner](https://img.shields.io/badge/LSM-Local%20Service%20Management-blueviolet?style=for-the-badge)
![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![PrimeNG](https://img.shields.io/badge/PrimeNG-007ACC?style=for-the-badge&logo=primeng&logoColor=white)

A comprehensive, full-stack platform designed for orchestrating local services. Connecting customers with service providers seamlessly, managing everything from scheduling and bookings to payments and reviews.

---
<div align="center">
  <video src="https://github.com/sarimkhan4/Local_Service_Marketplace/raw/main/project_lsm.mp4" width="100%" controls autoplay loop muted playsinline></video>
</div>

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
- **Validation:** `class-validator` & `class-transformer`
- **Authentication:** Passport.js (JWT strategies)
- **Data Seeding:** Faker.js for easy development database population
- **Testing:** Jest & Supertest

### Frontend (`/frontend`)
Built with **Angular**, featuring a beautiful and responsive UI component library.
- **Framework:** [Angular](https://angular.dev/) (v21)
- **UI Components:** [PrimeNG](https://primeng.org/) 
- **Styling:** CSS & PrimeUI Themes
- **Animation & Scrolling:** GSAP & Lenis for advanced animations and smooth scrolling
- **Data Visualization:** Chart.js & ng2-charts for analytics dashboards
- **Testing:** Vitest

---

## 📂 Project Structure

```text
├── backend/                  # NestJS API application
│   ├── src/
│   │   ├── common/           # Decorators, Enums, Errors, Guards, Pipes, Utils
│   │   ├── entities/         # TypeORM Database Entities (User, Booking, Payment, etc.)
│   │   └── modules/          # Feature Modules
│   │       ├── addresses/    # Handling physical locations
│   │       ├── auth/         # Authentication & Authorization
│   │       ├── bookings/     # Booking orchestration
│   │       ├── categories/   # Service categorization
│   │       ├── database/     # Database connection and config
│   │       ├── notification/ # In-app notifications
│   │       ├── payments/     # Transactions processing
│   │       ├── reviews/      # Customer feedback system
│   │       ├── saved-services/# Customer saved/favorite services
│   │       ├── schedules/    # Provider availability
│   │       ├── services/     # Core services listing
│   │       └── users/        # User profile management
│   └── test/                 # E2E test suites
│
├── frontend/                 # Angular SPA Web application
│   ├── public/               # Static assets & images
│   └── src/
│       ├── app/
│       │   ├── core/         # Core singletons, interceptors, and services
│       │   ├── features/     # Smart components and lazy-loaded modules
│       │   ├── layout/       # Structural UI (Headers, Footers, Sidebars)
│       │   └── app.routes.ts # Application routing definitions
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
3. Set up your environment variables:
   Create a `.env` file in the `backend` root and configure your database and JWT secrets (e.g., `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`).
4. (Optional) Run database seeders if you want dummy data to test UI components out of the box:
   ```bash
   npx ts-node seed.ts
   ```
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
   ng serve
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

This project is proprietary and confidential. All rights reserved.
