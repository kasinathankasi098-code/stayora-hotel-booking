-- =======================================================
-- Stayora Hotel Booking PostgreSQL Schema
-- =======================================================

-- 1. Locations Table
CREATE TABLE IF NOT EXISTS locations (
  id SERIAL PRIMARY KEY,
  state VARCHAR(100) NOT NULL UNIQUE,
  cities TEXT[] NOT NULL
);

-- 2. Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  destination VARCHAR(100),
  rating NUMERIC(3, 1) DEFAULT 4.5,
  price NUMERIC(10, 2) NOT NULL,
  rooms INT NOT NULL DEFAULT 10,
  image TEXT,
  description TEXT,
  amenities TEXT[] DEFAULT ARRAY['Free Wi-Fi', 'Breakfast', 'Air conditioning']::TEXT[],
  latitude NUMERIC(10, 6),
  longitude NUMERIC(10, 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Rooms Table
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  hotel_id INT REFERENCES hotels(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  available INT NOT NULL DEFAULT 5,
  image TEXT,
  facilities TEXT[] DEFAULT ARRAY['Wi-Fi', 'Breakfast', 'AC']::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  booking_id VARCHAR(60) NOT NULL UNIQUE,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  selected_hotel VARCHAR(255) NOT NULL,
  selected_room VARCHAR(100) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests INT NOT NULL DEFAULT 1,
  payment_method VARCHAR(50) DEFAULT 'UPI',
  status VARCHAR(50) DEFAULT 'Confirmed',
  total_price NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_hotels_city ON hotels(city);
CREATE INDEX IF NOT EXISTS idx_hotels_destination ON hotels(destination);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON bookings(booking_id);

-- Ensure latitude and longitude exist on existing tables
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 6);
ALTER TABLE hotels ADD COLUMN IF NOT EXISTS longitude NUMERIC(10, 6);

