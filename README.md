# Stayora Hotels and Resort - Fullstack Hotel Booking Application

A fullstack hotel booking application with a **React + Vite** frontend and a **Node.js, Express, and PostgreSQL** backend featuring complete **CRUD (Create, Read, Update, Delete)** operations.

---

## 🏗️ System Architecture & Tech Stack

- **Frontend**: React 19, React Router v7, Vite, Vanilla CSS design system.
- **Backend**: Node.js (ES Modules), Express 4, PostgreSQL (`pg` connection pool), CORS, Morgan logger, Dotenv.
- **Database**: PostgreSQL with relational schemas for `hotels`, `rooms`, `bookings`, and `locations`.
- **High-Availability Storage Engine**: Includes automated table creation and a persistent fallback mode that keeps all CRUD operations 100% operational even if the PostgreSQL service is temporarily restarting or offline.

---

## 🗄️ Database Schema & Relational Tables

The PostgreSQL schema is defined in [`backend/src/db/schema.sql`](file:///d:/hotel%20booking/backend/src/db/schema.sql):

1. **`hotels` Table**:
   - `id SERIAL PRIMARY KEY`
   - `name VARCHAR(255) NOT NULL`
   - `city VARCHAR(100) NOT NULL`
   - `state VARCHAR(100)`
   - `destination VARCHAR(100)`
   - `rating NUMERIC(3, 1) DEFAULT 4.5`
   - `price NUMERIC(10, 2) NOT NULL`
   - `rooms INT NOT NULL DEFAULT 10`
   - `image TEXT`
   - `description TEXT`
   - `amenities TEXT[]`
   - `created_at`, `updated_at`

2. **`rooms` Table**:
   - `id SERIAL PRIMARY KEY`
   - `hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE`
   - `name VARCHAR(100) NOT NULL`
   - `price NUMERIC(10, 2) NOT NULL`
   - `available INT NOT NULL DEFAULT 5`
   - `image TEXT`
   - `facilities TEXT[]`
   - `created_at`, `updated_at`

3. **`bookings` Table**:
   - `id SERIAL PRIMARY KEY`
   - `booking_id VARCHAR(60) NOT NULL UNIQUE`
   - `full_name VARCHAR(150) NOT NULL`
   - `email VARCHAR(150) NOT NULL`
   - `phone VARCHAR(50) NOT NULL`
   - `selected_hotel VARCHAR(255) NOT NULL`
   - `selected_room VARCHAR(100) NOT NULL`
   - `check_in DATE NOT NULL`
   - `check_out DATE NOT NULL`
   - `guests INT NOT NULL DEFAULT 1`
   - `payment_method VARCHAR(50) DEFAULT 'UPI'`
   - `status VARCHAR(50) DEFAULT 'Confirmed'`
   - `total_price NUMERIC(10, 2)`
   - `created_at`, `updated_at`

4. **`locations` Table**:
   - `id SERIAL PRIMARY KEY`
   - `state VARCHAR(100) NOT NULL UNIQUE`
   - `cities TEXT[] NOT NULL`

---

## 🚀 API Endpoints & CRUD Operations

Base URL: `http://localhost:5000/api`

### 🏨 Hotels CRUD (`/api/hotels`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/hotels` | Get all hotels (supports `?search=`, `?city=`, `?destination=`, `?minPrice=`) |
| `GET` | `/api/hotels/:id` | Get single hotel by ID |
| `POST` | `/api/hotels` | Create a new hotel |
| `PUT` | `/api/hotels/:id` | Update hotel by ID |
| `DELETE` | `/api/hotels/:id` | Delete hotel by ID |

### 📅 Bookings CRUD (`/api/bookings`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bookings` | Get all bookings (supports `?search=`, `?email=`, `?hotel=`, `?status=`) |
| `GET` | `/api/bookings/:id` | Get booking by ID or `booking_id` |
| `POST` | `/api/bookings` | Create new reservation |
| `PUT` | `/api/bookings/:id` | Update reservation / status (Confirmed, Cancelled, Completed) |
| `DELETE` | `/api/bookings/:id` | Cancel and delete reservation |

### 🛏️ Rooms & Locations
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/rooms` | Get room options (supports `?hotelId=`) |
| `GET` | `/api/locations` | Get available states and cities |
| `GET` | `/api/locations/destinations` | Get popular destination list |
| `GET` | `/api/health` | Health check & PostgreSQL connection status |

---

## 🛠️ Setup & Running

### 1. Configure PostgreSQL (`backend/.env`)
Edit `backend/.env` with your PostgreSQL credentials:
```env
PORT=5000
PGHOST=localhost
PGPORT=5432
PGDATABASE=hotel_booking
PGUSER=postgres
PGPASSWORD=your_password
```
*(Or set `DATABASE_URL=postgresql://user:password@localhost:5432/hotel_booking`)*

### 2. Run Database Migration & Seed
```bash
cd backend
npm run migrate   # Creates PostgreSQL tables
npm run seed      # Seeds hotels, rooms, and locations
```

### 3. Start Backend Server
```bash
cd backend
npm run dev       # Starts with nodemon at http://localhost:5000
```

### 4. Start Frontend
```bash
cd frontend
npm run dev       # Starts Vite dev server at http://localhost:5173
```

### 5. Automated API Test Suite
Run the automated end-to-end CRUD test suite:
```bash
cd backend
node test-api.js
```
