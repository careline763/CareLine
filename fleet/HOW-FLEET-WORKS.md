# Fleet Portal - Complete Guide

## 📋 What is the Fleet Portal?

The **Fleet Portal** is a B2B (Business-to-Business) web application for **corporate clients** who manage multiple vehicles. It allows companies (like Uber, Ola, delivery services, or corporate fleets) to:

- **Book car cleaning services** for multiple vehicles
- **Track all bookings** made by the company
- **Manage fleet vehicles** (add, view, remove vehicles)
- **View and download invoices** for billing and accounting
- **Monitor booking history** and service status

---

## 🏗️ Architecture Overview

```
Fleet Portal (React App - Port 5177)
           ↓
     API Server (Express - Port 4000)
           ↓
      MySQL Database
```

### Key Concepts

1. **Fleet** = A corporate client (e.g., "Uber Delhi", "Amazon Logistics")
2. **Fleet Manager** = User with `fleet_manager` role who can access the portal
3. **Fleet Member** = Regular user in the company (can also be added)
4. **Fleet Vehicle** = Vehicles assigned to a specific fleet
5. **Fleet Invoice** = Monthly consolidated bill for all bookings

---

## 📁 Folder Structure Explained

```
fleet/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── FleetLayout.tsx # Main layout with sidebar navigation
│   │
│   ├── pages/              # Page components (routes)
│   │   ├── Auth/           # Login page
│   │   ├── Dashboard/      # Overview page (stats, charts)
│   │   ├── Bookings/       # List of all bookings
│   │   ├── Vehicles/       # Manage fleet vehicles
│   │   └── Invoices/       # View and download invoices
│   │
│   ├── routes/             # Routing configuration
│   │   └── AppRoutes.tsx   # Defines all routes
│   │
│   ├── services/           # API communication
│   │   └── api.ts          # Axios instance and API calls
│   │
│   ├── store/              # State management
│   │   └── authStore.ts    # Zustand store for authentication
│   │
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles (Tailwind)
│
├── package.json            # Dependencies
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

---

## 🔑 Key Files & Their Purpose

### 1. **`src/main.tsx`** - Entry Point
```tsx
// Renders the root React app
// Sets up React Router and Toast notifications
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
    <Toaster />
  </BrowserRouter>
);
```

### 2. **`src/App.tsx`** - Root Component
```tsx
// Simply renders the routing logic
export default function App() {
  return <AppRoutes />;
}
```

### 3. **`src/routes/AppRoutes.tsx`** - Route Configuration
Defines which URL shows which page:
- `/login` → Login Page
- `/dashboard` → Dashboard (protected)
- `/bookings` → Bookings List (protected)
- `/vehicles` → Vehicles Management (protected)
- `/invoices` → Invoices List (protected)

### 4. **`src/store/authStore.ts`** - Authentication State
Manages:
- User login/logout
- JWT token storage
- User role verification
- Persists auth state in localStorage

### 5. **`src/services/api.ts`** - API Communication
Handles all HTTP requests to the backend:
```typescript
// Example API calls:
- POST /api/auth/send-otp
- POST /api/auth/verify-otp
- GET /api/fleet/:id/bookings
- GET /api/fleet/:id/invoices
- POST /api/vehicles
```

### 6. **`src/components/FleetLayout.tsx`** - Main Layout
Provides:
- Sidebar navigation menu
- Header with user info
- Logout button
- Wraps all protected pages

---

## 🎯 How Each Page Works

### 1. **Login Page** (`pages/Auth/Login.tsx`)

**Purpose:** Authenticate fleet managers

**Flow:**
1. User enters phone number
2. Click "Send OTP" → API sends OTP via SMS (MSG91)
3. User enters OTP code
4. Click "Verify" → API verifies OTP
5. If valid → JWT tokens stored → Redirect to Dashboard

**Key Features:**
- OTP-based authentication (no passwords)
- Form validation
- Error handling (invalid OTP, rate limiting)
- Redirects if already logged in

---

### 2. **Dashboard Page** (`pages/Dashboard/index.tsx`)

**Purpose:** Overview of fleet statistics

**Displays:**
- Total bookings (all-time)
- Active bookings (in-progress)
- Completed bookings
- Total fleet vehicles
- Monthly spending chart
- Recent bookings list
- Quick action buttons

**Data Sources:**
- `GET /api/fleet/:id/bookings` (summary)
- `GET /api/fleet/:id/invoices` (spending data)

---

### 3. **Bookings Page** (`pages/Bookings/index.tsx`)

**Purpose:** View all fleet bookings

**Features:**
- **List View:** Shows all bookings with:
  - Vehicle details (model, plate number)
  - Service plan (package type)
  - Scheduled date/time
  - Status (pending, assigned, in-progress, completed)
  - Total amount
  - Partner info (when assigned)

- **Filters:**
  - Status filter (All, Pending, In Progress, Completed)
  - Date range filter
  - Vehicle search

- **Pagination:** Load bookings page-by-page

**API Endpoint:**
```typescript
GET /api/fleet/:fleetId/bookings?page=1&limit=20
```

---

### 4. **Vehicles Page** (`pages/Vehicles/index.tsx`)

**Purpose:** Manage fleet vehicles

**Features:**

**View Vehicles:**
- List all vehicles assigned to the fleet
- Shows: Type, Model, Plate Number, Added Date
- Total vehicle count

**Add New Vehicle:**
- Modal form to add vehicle:
  - Vehicle Type (Hatchback, Sedan, SUV, Luxury)
  - Model/Brand
  - Registration Number (plate)
- Validation (duplicate plate check)

**Remove Vehicle:**
- Unassign vehicle from fleet
- Confirmation dialog

**API Endpoints:**
```typescript
GET /api/vehicles                   // List all vehicles
POST /api/fleet/:id/vehicles        // Add vehicle to fleet
DELETE /api/fleet/vehicles/:vehicleId  // Remove from fleet
```

---

### 5. **Invoices Page** (`pages/Invoices/index.tsx`)

**Purpose:** View and download monthly invoices

**Features:**

**Invoice List:**
- Shows all generated invoices
- Details per invoice:
  - Invoice Number (unique ID)
  - Period (month/year)
  - Total Amount
  - Status (Draft, Sent, Paid)
  - Booking Count (how many services)
  - Generated Date

**Invoice Actions:**
- **Download PDF:** Export invoice as PDF
- **View Details:** Expand to see individual bookings
- **Mark as Paid:** Update status

**Invoice Generation:**
- Admin generates invoice at month-end
- Consolidates all completed bookings
- Calculates total amount
- Sends email to fleet's billing email

**API Endpoints:**
```typescript
GET /api/fleet/:id/invoices           // List all invoices
POST /api/fleet/:id/invoices          // Generate new invoice
PATCH /api/fleet/invoices/:id/status  // Update invoice status
```

---

## 🔐 Authentication & Authorization

### Role-Based Access Control

**Fleet Manager Role:**
- Can only access Fleet Portal
- Cannot access Customer App or Admin Panel
- Can view only their own fleet's data

**Authentication Flow:**
1. User logs in with phone + OTP
2. Backend checks user role = `fleet_manager`
3. If valid → JWT token issued
4. Token stored in `authStore` (Zustand + localStorage)
5. All API requests include token in header:
   ```
   Authorization: Bearer <jwt_token>
   ```

**Protected Routes:**
- All routes except `/login` require authentication
- If not logged in → Redirect to `/login`
- Token auto-refreshed when expired

---

## 🗄️ Database Schema (Fleet-Related Tables)

### 1. **`fleets` Table**
Stores fleet client information:
```sql
id              INT PRIMARY KEY
name            VARCHAR (e.g., "Uber Delhi")
company_name    VARCHAR
billing_email   VARCHAR
contact_phone   VARCHAR
gstin           VARCHAR (optional, for GST invoice)
is_active       BOOLEAN
created_at      DATETIME
```

### 2. **`fleet_members` Table**
Maps users to fleets:
```sql
id         INT PRIMARY KEY
fleet_id   INT (FK → fleets.id)
user_id    INT (FK → users.id)
role       ENUM ('manager', 'member')
joined_at  DATETIME
```

### 3. **`fleet_vehicles` Table**
Maps vehicles to fleets:
```sql
id          INT PRIMARY KEY
fleet_id    INT (FK → fleets.id)
vehicle_id  INT (FK → vehicles.id)
added_at    DATETIME
```

### 4. **`fleet_invoices` Table**
Stores monthly invoices:
```sql
id            INT PRIMARY KEY
fleet_id      INT (FK → fleets.id)
period_start  DATE
period_end    DATE
total_amount  DECIMAL
status        ENUM ('draft', 'sent', 'paid')
booking_count INT
generated_at  DATETIME
```

### 5. **`bookings` Table** (with fleet support)
Bookings can be linked to a fleet:
```sql
...
fleet_id          INT (FK → fleets.id, nullable)
fleet_invoice_id  INT (FK → fleet_invoices.id, nullable)
...
```

---

## 🔄 Complete User Flow Example

### Scenario: "Amazon Logistics" wants to book cleaning for 10 delivery vans

**Step 1: Admin Setup (One-time)**
1. Admin creates fleet: "Amazon Logistics"
2. Admin adds fleet manager (user with phone: 9876543210)
3. Admin assigns 10 vehicles to the fleet

**Step 2: Fleet Manager Login**
1. Manager opens: `http://localhost:5177`
2. Enters phone: 9876543210
3. Receives OTP via SMS
4. Enters OTP → Logged in → Redirected to Dashboard

**Step 3: View Dashboard**
- Sees: "10 Active Vehicles"
- Sees: "15 Total Bookings (this month)"
- Sees: "₹12,500 Monthly Spending"

**Step 4: View Vehicles**
- Clicks "Vehicles" in sidebar
- Sees list of 10 vans with plate numbers
- (Optional) Adds new vehicle via "Add Vehicle" button

**Step 5: View Bookings**
- Clicks "Bookings" in sidebar
- Sees all past/current bookings
- Filters by "In Progress" to see active cleanings
- Each booking shows:
  - Vehicle: DL 3C AB 1234
  - Service: Weekly Express Clean
  - Date: 2026-06-25, 10:00 AM
  - Status: In Progress
  - Partner: Raj Kumar (★4.8)
  - Amount: ₹800

**Step 6: View Invoices**
- Clicks "Invoices" in sidebar
- Sees monthly invoices:
  - **Invoice #1234** | May 2026 | ₹12,500 | 15 bookings | Status: Paid
  - **Invoice #1235** | June 2026 | ₹10,800 | 12 bookings | Status: Sent
- Downloads PDF for accounting

**Step 7: (Customer App) Booking Creation**
- Regular users in Amazon can use Customer App
- They see only their fleet's vehicles
- Book service → Automatically linked to fleet
- Payment handled by fleet (not individual)

**Step 8: Month-End**
- Admin generates invoice for June
- System:
  1. Finds all completed bookings for Amazon (June 1-30)
  2. Calculates total: ₹10,800 (12 bookings)
  3. Creates invoice record
  4. Sends email to `billing@amazon.com`
- Fleet manager sees new invoice in portal

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI framework |
| **Routing** | React Router v7 | Page navigation |
| **Styling** | Tailwind CSS v4 | Utility-first CSS |
| **State Management** | Zustand | Global auth state |
| **HTTP Client** | Axios | API requests |
| **Build Tool** | Vite 8 | Fast dev server & bundler |
| **Language** | TypeScript 6 | Type safety |
| **Icons** | Lucide React | Icon library |
| **Notifications** | React Hot Toast | Toast messages |
| **Linter** | Oxlint | Fast code linting |

---

## 🚀 How to Start Working on Fleet Portal

### 1. **Install Dependencies**
```bash
cd fleet
npm install
```

### 2. **Set Environment Variables**
Create `fleet/.env`:
```env
VITE_API_URL=http://localhost:4000/api
```

### 3. **Start Development Server**
```bash
npm run dev
```
Opens at: `http://localhost:5177`

### 4. **Create a Test Fleet Manager**
In MySQL:
```sql
-- Create a fleet
INSERT INTO fleets (name, company_name, billing_email, contact_phone) 
VALUES ('Test Fleet', 'Test Company', 'test@test.com', '9999999999');

-- Create a user
INSERT INTO users (phone, role) VALUES ('9999999999', 'fleet_manager');

-- Link user to fleet
INSERT INTO fleet_members (fleet_id, user_id, role) VALUES (1, 1, 'manager');
```

### 5. **Login**
- Phone: 9999999999
- OTP: (check server console for dev OTP)

---

## 📝 Common Development Tasks

### Add a New Page
1. Create file: `src/pages/NewPage/index.tsx`
2. Add route in `src/routes/AppRoutes.tsx`
3. Add navigation link in `src/components/FleetLayout.tsx`

### Add New API Call
1. Open `src/services/api.ts`
2. Add new function:
```typescript
export const getFleetStats = async (fleetId: number) => {
  const { data } = await api.get(`/fleet/${fleetId}/stats`);
  return data;
};
```
3. Use in component:
```typescript
import { getFleetStats } from '@/services/api';

const stats = await getFleetStats(fleetId);
```

### Add New State
1. Open `src/store/authStore.ts` (or create new store)
2. Add state and actions:
```typescript
interface FleetStore {
  fleetData: Fleet | null;
  setFleetData: (data: Fleet) => void;
}

export const useFleetStore = create<FleetStore>((set) => ({
  fleetData: null,
  setFleetData: (data) => set({ fleetData: data }),
}));
```

---

## 🐛 Common Issues & Fixes

### Issue 1: "Cannot read property of undefined"
**Cause:** API data not loaded yet  
**Fix:** Add loading state:
```typescript
const [loading, setLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  fetchData().then(res => {
    setData(res);
    setLoading(false);
  });
}, []);

if (loading) return <div>Loading...</div>;
return <div>{data.name}</div>;
```

### Issue 2: "Network Error" when calling API
**Cause:** Backend server not running  
**Fix:** Start server: `cd server && npm run dev`

### Issue 3: "Unauthorized" error
**Cause:** JWT token expired or invalid  
**Fix:** Logout and login again

---

## 📚 Learn More

### Key Concepts to Understand

1. **React Hooks:**
   - `useState` - Local component state
   - `useEffect` - Side effects (API calls)
   - `useNavigate` - Programmatic navigation

2. **Zustand Store:**
   - Global state management
   - Persists auth state in localStorage
   - Simpler than Redux

3. **React Router:**
   - `<Route>` - Define page routes
   - `<Navigate>` - Redirect
   - `useNavigate()` - Navigate programmatically

4. **Axios:**
   - HTTP client for API calls
   - Interceptors for auth headers
   - Error handling

5. **Tailwind CSS:**
   - Utility classes for styling
   - `className="bg-blue-500 text-white px-4 py-2"`
   - Responsive design with `sm:`, `md:`, `lg:`

---

## 🎓 Next Steps

1. **Explore the Code:** Open each file and read the comments
2. **Test Features:** Login and try all pages
3. **Modify UI:** Change colors, layouts, add new components
4. **Add Features:** Create new pages or enhance existing ones
5. **Debug:** Use React DevTools and Network tab

---

## 📞 Need Help?

- **React Docs:** https://react.dev
- **Zustand Docs:** https://docs.pmnd.rs/zustand
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Vite Docs:** https://vite.dev

---

**Happy Coding! 🚀**
