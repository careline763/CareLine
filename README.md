# 🚗 CareLine - Premium Doorstep Car Care Platform

<div align="center">

![CareLine Logo](https://img.shields.io/badge/CareLine-Premium_Car_Care-C5A880?style=for-the-badge&logo=car&logoColor=white)

**Professional doorstep car cleaning services with luxury-grade attention to detail**

[![React](https://img.shields.io/badge/React-19.2.7-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**CareLine** is a comprehensive multi-tenant SaaS platform that connects customers with professional car cleaning service providers. The platform features a luxury APEX MOTORS dark theme with gold accents, providing an elegant user experience across all interfaces.

### 🎯 Key Highlights

- **Multi-Tenant Architecture**: Separate portals for Customers, Partners, Admins, and Fleet Managers
- **Real-Time Updates**: Live booking status, partner location tracking, and notifications
- **Smart Pricing**: Dynamic surge pricing based on demand, time slots, and location
- **Subscription Management**: Daily, weekly, and monthly car wash plans
- **Payment Integration**: Razorpay payment gateway with UPI, cards, and wallets
- **Geolocation Services**: Interactive maps with Leaflet for service area coverage
- **Progressive Web App**: Installable on mobile devices with offline support

---

## ✨ Features

### 👨‍💼 Customer Portal (`/client`)

#### 🏠 **Home & Landing**
- Hero section with luxury animations and typography
- Service showcase with glassmorphism effects
- Statistics counter (customers, partners, cities served)
- Client testimonials and reviews
- Coverage area display with city-wise partner count
- Special offers and promotional banners

#### 📅 **Booking System**
- **6-Step Booking Flow**:
  1. **Car Type Selection**: Hatchback, Sedan, SUV, MUV, Luxury
  2. **Location Input**: Pincode validation with service area check
  3. **Date & Time Picker**: Calendar with time slot selection, peak hour indicators
  4. **Package Selection**: One-time, Weekly, Monthly, Society plans
  5. **Add-on Services**: Interior vacuum, dashboard polish, tire dressing, etc.
  6. **Payment**: Razorpay integration, coupon code support, wallet balance
- Luxury progress indicator with animated steps
- Real-time booking summary sidebar
- Surge pricing calculation and display

#### 🎫 **Plans & Pricing**
- One-Time Wash (₹249)
- Weekly Plan (₹799/month - 4 washes)
- Monthly Pro (₹1499/month - Daily wash)
- Society Plans (Bulk pricing)
- Feature comparison cards with hover effects
- Popular plan badges and recommendations

#### 🛠️ **Services**
- Category filtering (All, Exterior, Interior, Waterless, Specialty)
- Individual service cards with pricing
- Service descriptions and duration
- Quick booking from service page

#### 📱 **User Features**
- Profile management with avatar upload
- Booking history with status tracking
- Active bookings with real-time updates
- Wallet balance and transaction history
- Notifications center (unread count badge)
- Push notifications support
- Complaint submission and tracking
- Rating and review system
- Referral program

#### 💳 **Payment & Wallet**
- Razorpay payment gateway integration
- Multiple payment methods (UPI, Cards, Net Banking, Wallets)
- Coupon code application and validation
- Wallet recharge and auto-debit
- Transaction history with filters
- Invoice generation and download

---

### 🚚 Partner Portal (`/partner`)

#### 📊 **Dashboard**
- Earnings overview (today, week, month)
- Active bookings count
- Upcoming bookings list
- Rating and review summary
- Performance metrics

#### 📋 **Booking Management**
- New booking requests with accept/reject
- Active bookings with navigation
- Booking history and earnings
- Customer contact information
- Before/after photo upload
- Service completion confirmation

#### 🗺️ **Navigation & Tracking**
- Real-time GPS location tracking
- Route navigation to customer location
- Distance and ETA calculation
- Online/Offline status toggle

#### 💰 **Earnings & Payouts**
- Daily, weekly, monthly earnings reports
- Pending settlements display
- Payout request submission
- Bank account management
- Transaction history

#### ⚙️ **Profile & Settings**
- Profile information update
- Document upload (Aadhar, PAN, License)
- Vehicle details management
- Service area preferences
- Availability schedule
- Notification preferences

---

### 🎛️ Admin Portal (`/admin`)

#### 📈 **Analytics Dashboard**
- Revenue analytics with charts (Recharts)
- Booking trends (daily, weekly, monthly)
- User growth metrics
- Partner performance statistics
- Service area coverage maps
- Top-performing partners
- Customer satisfaction scores

#### 👥 **User Management**
- Customer list with search and filters
- User profile viewing and editing
- Subscription management
- Wallet balance adjustments
- Account suspension/activation
- User activity logs

#### 🤝 **Partner Management**
- Partner onboarding and verification
- Document verification (Aadhar, PAN, Bank)
- Partner status management (Active, Inactive, Suspended)
- Performance monitoring
- Rating and review management
- Commission and payout processing

#### 📦 **Booking Management**
- All bookings overview with filters
- Booking status updates
- Manual booking assignment
- Refund processing
- Booking cancellation handling
- Customer complaint resolution

#### 🚗 **Fleet Management**
- Vehicle registration and tracking
- Vehicle type management
- Maintenance scheduling
- Fleet utilization reports

#### 💳 **Subscription Plans**
- Plan creation and editing
- Pricing management
- Feature inclusion/exclusion
- Plan activation/deactivation
- Subscription statistics

#### 🎟️ **Coupon Management**
- Create promotional coupons
- Discount type (percentage, flat)
- Usage limits and expiry dates
- Coupon code generation
- Usage analytics

#### 📍 **Service Area Management**
- Add new service areas (cities, pincodes)
- Coverage map visualization
- Waterless zone designation
- Service area activation/deactivation
- Partner allocation per area

#### 🏘️ **Society Management**
- Register residential societies
- Bulk booking management
- Society-specific pricing
- Dedicated partner assignment

#### 🎯 **Pricing & Surge**
- Base price configuration
- Surge pricing rules (peak hours, high demand)
- Dynamic pricing algorithms
- Price history and analytics

#### 📢 **Notifications**
- Push notification campaigns
- Email marketing
- SMS notifications
- In-app announcements
- Notification scheduling

#### ⚙️ **System Settings**
- Platform configuration
- Payment gateway settings
- Commission rates
- Tax settings
- Email templates
- SMS templates
- Terms & conditions management

---

### 🚙 Fleet Management Portal (`/fleet`)

#### 🚗 **Vehicle Management**
- Fleet inventory tracking
- Vehicle assignment to partners
- Maintenance schedules
- Service history
- Fuel consumption tracking
- Vehicle documents management

#### 📊 **Fleet Analytics**
- Utilization rates
- Maintenance costs
- Partner vehicle performance
- Route optimization

---

## 🛠️ Tech Stack

### **Frontend**

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.7 | UI Framework |
| TypeScript | 6.0.2 | Type Safety |
| Vite | 8.1.0 | Build Tool & Dev Server |
| React Router | 7.18.0 | Client-side Routing |
| Tailwind CSS | 4.3.1 | Utility-first CSS Framework |
| Zustand | 5.0.14 | State Management |
| Axios | 1.18.1 | HTTP Client |
| React Hot Toast | 2.6.0 | Toast Notifications |
| Lucide React | 1.21.0 | Icon Library |
| Leaflet | 1.9.4 | Interactive Maps |
| Socket.io Client | 4.8.3 | Real-time Communication |
| Recharts | 3.9.0 | Data Visualization (Admin) |

### **Backend**

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime Environment |
| Express | 4.21.0 | Web Framework |
| TypeScript | 5.6.2 | Type Safety |
| Prisma | 5.22.0 | ORM & Database Toolkit |
| PostgreSQL | 15+ | Primary Database |
| Redis (IORedis) | 5.4.1 | Caching & Session Store |
| Socket.io | 4.8.0 | Real-time Communication |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 2.4.3 | Password Hashing |
| Razorpay | 2.9.4 | Payment Gateway |
| Nodemailer | 6.10.1 | Email Service |
| Web Push | 3.6.7 | Push Notifications |
| BullMQ | 5.13.0 | Job Queue |
| Winston | 3.14.2 | Logging |
| Helmet | 8.0.0 | Security Headers |
| Express Rate Limit | 7.4.0 | Rate Limiting |
| Zod | 3.23.8 | Schema Validation |
| Multer | 2.2.0 | File Upload |

### **DevOps & Tools**

- **Version Control**: Git, GitHub
- **Package Manager**: npm
- **Code Quality**: Oxlint
- **API Testing**: Postman, Thunder Client
- **Database GUI**: Prisma Studio

---

## 🏗️ Architecture

### **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer / CDN                     │
└───────────────────────────┬─────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼──────┐   ┌───────▼──────┐   ┌───────▼──────┐
│   Client     │   │   Partner    │   │    Admin     │
│   Portal     │   │   Portal     │   │    Portal    │
│  (React)     │   │  (React)     │   │   (React)    │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                   │
       └──────────────────┼───────────────────┘
                          │
                  ┌───────▼────────┐
                  │  API Gateway   │
                  │   (Express)    │
                  └───────┬────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼──────┐  ┌───────▼──────┐  ┌──────▼───────┐
│  PostgreSQL  │  │    Redis     │  │  Socket.io   │
│  (Database)  │  │   (Cache)    │  │   (Real-time)│
└──────────────┘  └──────────────┘  └──────────────┘
        │
┌───────▼──────────────────────────────┐
│        Background Jobs (BullMQ)      │
├──────────────────────────────────────┤
│  • Email Notifications               │
│  • SMS Notifications                 │
│  • Push Notifications                │
│  • Payment Processing                │
│  • Report Generation                 │
└──────────────────────────────────────┘
```

### **Database Schema (Simplified)**

```prisma
User
├── Profile
├── Bookings
├── Wallet
├── WalletTransactions
├── Subscriptions
├── Notifications
├── Reviews
└── Complaints

Partner
├── Profile
├── Documents
├── Vehicle
├── Bookings
├── Earnings
└── Availability

Booking
├── User
├── Partner
├── Plan
├── Services
├── Payment
└── Photos

Plan
├── Pricing
├── Features
└── Subscriptions

ServiceArea
├── Pincodes
└── Partners
```

---

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+ installed
- PostgreSQL 15+ database
- Redis server (optional but recommended)
- npm or yarn package manager
- Git

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/careline763/CareLine.git
cd CareLine
```

2. **Install Dependencies**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install admin dependencies
cd ../admin
npm install

# Install partner dependencies
cd ../partner
npm install
```

3. **Environment Setup**

Create `.env` files in each folder:

**Server (.env)**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/careline"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_HOST="localhost"
REDIS_PORT=6379

# Razorpay
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# Email (Nodemailer)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"

# Push Notifications
VAPID_PUBLIC_KEY="your_vapid_public_key"
VAPID_PRIVATE_KEY="your_vapid_private_key"

# Server
PORT=5000
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
```

**Client (.env)**
```env
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
VITE_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

**Admin (.env)**
```env
VITE_API_URL="http://localhost:5000/api"
```

**Partner (.env)**
```env
VITE_API_URL="http://localhost:5000/api"
VITE_SOCKET_URL="http://localhost:5000"
```

4. **Database Setup**

```bash
cd server

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Prisma Studio
npm run db:studio
```

5. **Start Development Servers**

Open 4 terminal windows:

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev

# Terminal 3 - Admin
cd admin
npm run dev

# Terminal 4 - Partner
cd partner
npm run dev
```

6. **Access the Applications**

- **Client Portal**: http://localhost:5173
- **Admin Portal**: http://localhost:5174
- **Partner Portal**: http://localhost:5175
- **API Server**: http://localhost:5000

---

## 📁 Project Structure

```
CareLine/
├── client/                 # Customer-facing React app
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, icons
│   │   ├── components/    # Reusable components
│   │   │   ├── common/    # Button, Card, Modal, etc.
│   │   │   └── layout/    # Navbar, Footer, Sidebar
│   │   ├── features/      # Zustand stores
│   │   ├── pages/         # Route pages
│   │   │   ├── Auth/      # Login, OTP verification
│   │   │   ├── Booking/   # Booking flow with steps
│   │   │   ├── Home/      # Landing page
│   │   │   ├── Plans/     # Pricing plans
│   │   │   ├── Services/  # Service catalog
│   │   │   ├── Profile/   # User profile
│   │   │   └── ...
│   │   ├── routes/        # Route configuration
│   │   ├── services/      # API services (axios)
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── .env               # Environment variables
│   ├── package.json
│   ├── tailwind.config.js # Tailwind configuration
│   └── vite.config.ts     # Vite configuration
│
├── admin/                 # Admin dashboard React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Analytics/
│   │   │   ├── Users/
│   │   │   ├── Partners/
│   │   │   ├── Bookings/
│   │   │   ├── Plans/
│   │   │   ├── Coupons/
│   │   │   └── ...
│   │   └── ...
│   └── ...
│
├── partner/               # Partner dashboard React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── Bookings/
│   │   │   ├── Earnings/
│   │   │   ├── Profile/
│   │   │   └── ...
│   │   └── ...
│   └── ...
│
├── fleet/                 # Fleet management app
│   └── ...
│
├── server/                # Node.js + Express backend
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Auth, validation, etc.
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helper functions
│   │   ├── workers/       # Background jobs (BullMQ)
│   │   ├── types/         # TypeScript types
│   │   └── server.ts      # Entry point
│   ├── .env               # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── README.md              # This file
└── LICENSE
```

---

## 📚 API Documentation

### **Authentication**

#### POST `/api/auth/register`
Register a new user
```json
{
  "name": "John Doe",
  "phone": "9876543210",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### POST `/api/auth/login`
Login with phone/email and password
```json
{
  "phone": "9876543210",
  "password": "SecurePass123"
}
```

#### POST `/api/auth/send-otp`
Send OTP for phone verification
```json
{
  "phone": "9876543210"
}
```

#### POST `/api/auth/verify-otp`
Verify OTP and login
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

### **Bookings**

#### GET `/api/bookings`
Get user bookings (with filters)
- Query params: `status`, `page`, `limit`

#### POST `/api/bookings`
Create a new booking
```json
{
  "planId": 1,
  "vehicleType": "sedan",
  "vehicleModel": "Honda City",
  "plate": "MH02AB1234",
  "address": "123 Street, Mumbai",
  "pincode": "400001",
  "scheduledAt": "2024-12-25T10:00:00Z",
  "extras": [101, 102],
  "couponCode": "FIRST50"
}
```

#### PATCH `/api/bookings/:id/status`
Update booking status
```json
{
  "status": "completed"
}
```

### **Plans**

#### GET `/api/plans`
Get all subscription plans

#### GET `/api/plans/:id`
Get plan details

### **Pricing**

#### POST `/api/pricing/calculate`
Calculate booking price with surge
```json
{
  "plan_id": 1,
  "scheduled_at": "2024-12-25T18:00:00Z",
  "pincode": "400001"
}
```

### **Service Areas**

#### POST `/api/service-areas/check-pincode`
Check service availability
```json
{
  "pincode": "400001"
}
```

### **Coupons**

#### POST `/api/coupons/apply`
Apply coupon code
```json
{
  "code": "FIRST50",
  "order_amount": 500
}
```

### **Payments**

#### POST `/api/payments/create-order`
Create Razorpay order
```json
{
  "bookingId": 123,
  "amount": 500
}
```

#### POST `/api/payments/verify`
Verify payment signature
```json
{
  "orderId": "order_xyz",
  "paymentId": "pay_abc",
  "signature": "signature_hash"
}
```

---

## 🎨 Design System

### **Color Palette**

```css
/* Luxury Dark Theme */
--luxury-dark-base: #0A0A0A;
--luxury-dark-card: #141414;
--luxury-dark-input: #1A1A1A;
--luxury-dark-border: #242424;

/* Luxury Gold Accents */
--luxury-gold: #C5A880;
--luxury-gold-light: #DFCBAD;
--luxury-gold-dark: #A6875D;
```

### **Typography**

- **Headings**: Playfair Display (Serif)
- **Body**: Montserrat (Sans-serif)
- **Monospace**: Courier New (For codes, plates)

### **Components**

- **Buttons**: Gold fill or outline style with hover effects
- **Cards**: Dark background with gold borders on hover
- **Inputs**: Dark with gold focus rings
- **Modals**: Glassmorphism with backdrop blur
- **Notifications**: Toast messages with icon and animations

---

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: Prevent brute force attacks
- **Helmet.js**: Security headers
- **CORS**: Configured for specific origins
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **XSS Protection**: React automatic escaping
- **HTTPS**: SSL/TLS in production

---

## 📊 Key Metrics & Analytics

- **Revenue Tracking**: Daily, weekly, monthly earnings
- **User Acquisition**: New signups, retention rate
- **Booking Analytics**: Completion rate, cancellation rate
- **Partner Performance**: Average rating, bookings completed
- **Service Area Coverage**: Cities served, pincodes covered
- **Customer Satisfaction**: Average rating, reviews

---

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

---

## 🚢 Deployment

### **Frontend (Vercel/Netlify)**

```bash
# Build client
cd client
npm run build

# Build admin
cd admin
npm run build

# Build partner
cd partner
npm run build
```

### **Backend (Railway/Render/AWS)**

```bash
cd server
npm run build
npm start
```

### **Database Migration**

```bash
cd server
npm run db:push
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary and confidential. All rights reserved.

---

## 👥 Team

- **Developer**: MohdAjeej
- **Repository Owner**: careline763
- **Contact**: royalpathan9839@gmail.com

---

## 🐛 Known Issues

- Push notifications require HTTPS in production
- Geolocation may not work on some browsers
- Real-time tracking requires stable WebSocket connection

---

## 🗺️ Roadmap

- [ ] Multi-language support (Hindi, regional languages)
- [ ] AI-powered partner matching
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Partner earnings prediction
- [ ] Smart route optimization
- [ ] Video call support for customer service
- [ ] Integration with Google Calendar
- [ ] Car health monitoring
- [ ] Insurance integration

---

## 📞 Support

For support, email royalpathan9839@gmail.com or create an issue in the repository.

---

<div align="center">

**Made with ❤️ and ☕ by the CareLine Team**

⭐ Star us on GitHub — it helps!

[Report Bug](https://github.com/careline763/CareLine/issues) · [Request Feature](https://github.com/careline763/CareLine/issues)

</div>
